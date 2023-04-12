const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const urlJoin = require('url-join');
const { defaultOntologies } = require('@semapps/core');
const CONFIG = require('../config/config');
const containers = require('../config/containers');
const {LDPNavigator,FetchAdapter} = require('fix-esm').require('ldp-navigator');
const { defaultContext } = require('@semapps/core');
const ontologies = require('../config/ontologies.json');
const { MoleculerError } = require('moleculer').Errors;

function normalisePredicate(data, predicate) {
  return data[predicate] == undefined ? [] : Array.isArray(data[predicate]) ? data[predicate] : [data[predicate]];
}

module.exports = {
  mixins: [LdpService, DocumentTaggerMixin],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies : ontologies,
    containers,
    preferredViewForResource: async (resourceUri, containerPreferredView) => {
      if (!containerPreferredView) return resourceUri;
      return urlJoin(CONFIG.FRONT_URL, containerPreferredView, encodeURIComponent(resourceUri), 'show')
    },
    defaultContainerOptions: {
      jsonContext: urlJoin('https://data.essai-possible.data-players.com/','context.json'),
    }
  },
  hooksContainer: {
        before: {
            "post":async (ctx, res)=>{
              // console.log('HOOK GET');
              // console.log('BEFORE POST',ctx.params);
              const resource = ctx.params.resource;
              // console.log('POST',resource);              
              const container = await ctx.call('ldp.registry.getByUri', { containerUri : ctx.params.containerUri})
              // console.log('container',container)
              switch (container.path) {
                case '/organizations':
                  // const user = ctx.params.resourceUri;

                  const newSiret = resource['ep:siret'];
                  // console.log('newSiret',newSiret)
                  const query= `PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                  CONSTRUCT {
                    ?s1 ?p1 ?o1.
                  }
                  WHERE {
                      ?s1 ep:siret "${newSiret}".
                      ?s1 ?p1 ?o1.
                  }`
                  // console.log('query',query)
                  const result  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});
                  // console.log('result',result);
                  if (result['@graph']||result['@id']){
                    // throw new Error('Siret deja existant');
                    throw new MoleculerError(
                      `Un entreprise avec siret "${newSiret}" existe déjà`,
                      400,
                      'BAD_REQUEST',
                    );
                  }  

                  break;
              
                default:
                  break;
              }

              return res
            }

        }
      },
      hooksResource: {
        after: {
            "put":async (ctx, res)=>{
              const { resourceUri, oldData, newData, webId } = res;
              console.log('XXXXXX hooksResource PUT',res)
              switch (newData.type) {
                case 'ep:TimeSlot' :
                  const predicate = 'pair:concerns';
                  const newConcerns = normalisePredicate(newData, predicate);
                  const oldConcerns = normalisePredicate(oldData, predicate);
                  // console.log('diff',newConcerns,oldConcerns)
              
                  const diffConcerns=newConcerns.filter(c=>!oldConcerns.includes(c));
                  if(diffConcerns.length>0){
                    const job = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:about'], accept:'application/ld+json'});
                    const query= `
                    PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                    PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                    CONSTRUCT {
                      ?s1 ?p1 ?o1.
                    }
                    WHERE {
                      ?s1 a ep:JobStatus.
                      ?s1 pair:label ?l1.
                      FILTER(REGEX(LCASE(STR(?l1)), LCASE("Pourvue"))).
                      ?s1 ?p1 ?o1.
                    }`
                    const status  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});
                    // const pourvuSubject = result['@graph'][0]
                    // console.log('status',status)
                    let newJob = {
                      ...job,
                      'pair:hasStatus':status['@id']
                    }
                    const updatedJob= await ctx.call('ldp.resource.put', { resource : newJob, webId:ctx.params.webId, contentType:'application/ld+json'});

                  }
                  const invDiffConcerns=oldConcerns.filter(c=>!newConcerns.includes(c));
                  if(invDiffConcerns.length>0){
                      const job = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:about'], accept:'application/ld+json'});
                      const query= `
                      PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                      PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                      CONSTRUCT {
                        ?s1 ?p1 ?o1.
                      }
                      WHERE {
                        ?s1 a ep:JobStatus.
                        ?s1 pair:label ?l1.
                        FILTER(REGEX(LCASE(STR(?l1)), LCASE("Publiée"))).
                        ?s1 ?p1 ?o1.
                      }`
                      const status  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});
                      // const pourvuSubject = result['@graph'][0]
                      // console.log('status',status)
                      let newJob = {
                        ...job,
                        'pair:hasStatus':status['@id']
                      }
    
                      const updatedJob= await ctx.call('ldp.resource.put', { resource : newJob, webId:ctx.params.webId, contentType:'application/ld+json'});

                    }
                  break;
              
                default:
                  break;
              }
              return res
            }

        }
      }
};
