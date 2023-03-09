const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const urlJoin = require('url-join');
const { defaultOntologies } = require('@semapps/core');
const CONFIG = require('../config/config');
const containers = require('../config/containers');
const {LDPNavigator,FetchAdapter} = require('fix-esm').require('ldp-navigator');
const { defaultContext } = require('@semapps/core');
const ontologies = require('../config/ontologies.json');
const { MoleculerError } = require('moleculer').Errors;


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
              
              const container = await ctx.call('ldp.registry.getByUri', { containerUri : ctx.params.containerUri})
              switch (container.path) {
                case '/organizations':
                  // const user = ctx.params.resourceUri;
                  // console.log('POST ORGA',resource);
                  const newSiret = resource['ep:siret'];
                  const query= `PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                  CONSTRUCT {
                    ?s1 ?p1 ?o1.
                  }
                  WHERE {
                      ?s1 ep:siret "${newSiret}".
                      ?s1 ?p1 ?o1.
                  }`
                  const result  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});
                  // console.log('result',result['@graph']);
                  if (result['@graph'] && Array.isArray(result['@graph']) && result['@graph'].length>0){
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
      }
};
