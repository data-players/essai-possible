const CONFIG = require('../config/config');

function normalisePredicate(data, predicate) {
  return data[predicate] == undefined ? [] : Array.isArray(data[predicate]) ? data[predicate] : [data[predicate]];
}

module.exports = {
  name: 'businessAction',
  events : {
    async 'ldp.resource.updated'(ctx) {
        const { resourceUri, oldData, newData, webId } = ctx.params;
        // console.log('______________________________ldp.resource.updated',ctx.params);
        const container = await ctx.call('ldp.registry.getByUri', { resourceUri});
        // console.log('container',container)
        switch (container.path) {
          case '/users':
            // const user = ctx.params.resourceUri;
            // console.log('PUT USER',oldData, newData);
            const newAskedAffiliation = newData['ep:askedAffiliation']==undefined?[]:Array.isArray(newData['ep:askedAffiliation'])?newData['ep:askedAffiliation']:[newData['ep:askedAffiliation']];
            const oldAskedAffiliation = oldData['ep:askedAffiliation']==undefined?[]:Array.isArray(oldData['ep:askedAffiliation'])?oldData['ep:askedAffiliation']:[newData['ep:askedAffiliation']];
        
            const diffAskedCompanies=newAskedAffiliation.filter(c=>!oldAskedAffiliation.includes(c));
            // console.log('diffAskedCompanies',diffAskedCompanies);
            for (const diffAskedCompany of diffAskedCompanies) {
              const company = await ctx.call('ldp.resource.get', { resourceUri : diffAskedCompany, accept:'application/ld+json'});
              const AskedCompanyUsers = company['pair:affiliates']==undefined?[]:Array.isArray(company['pair:affiliates'])?company['pair:affiliates']:[company['pair:affiliates']];
              for (const AskedCompanyUser of AskedCompanyUsers) {
                const user = await ctx.call('ldp.resource.get', { resourceUri : AskedCompanyUser, accept:'application/ld+json'});
                // console.log('user',user);

                // template || !ctx.params.subject  || !ctx.params.to || !ctx.params.variables
                await ctx.call('mailer.sendMail', {
                  template:4641817,
                  subject:"rattachement d'entreprise",
                  to:[{
                    Email :user['pair:e-mail']
                  }],
                  variables:{
                    user : newData['pair:e-mail'],
                    company:company['pair:label']
                  }
                });
              }
              // console.log('company',company)
            }

            break;

            case '/timeSlot':
              // const slot = ctx.params.resourceUri;
              // console.log('PUT SLOTS',oldData, newData);
              const predicate = 'pair:concerns';
              const newConcerns = normalisePredicate(newData,  'pair:concerns');
              const oldConcerns = normalisePredicate(oldData,  'pair:concerns');
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
                // console.log('UPDATE JOB',newJob)

                const updatedJob= await ctx.call('ldp.resource.put', { resource : newJob, webId:ctx.params.webId, contentType:'application/ld+json'});
                // console.log('updatedJob',updatedJob)

                const user = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:concerns'], accept:'application/ld+json'});
                const company =  await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});                
                // console.log('company',company)
                const companyUsers = company['pair:affiliates']==undefined?[]:Array.isArray(company['pair:affiliates'])?company['pair:affiliates']:[company['pair:affiliates']];
                for (const companyUser of companyUsers) {
                  const companyUserObject = await ctx.call('ldp.resource.get', { resourceUri : companyUser, accept:'application/ld+json'});
                  // console.log('user',user);
  
                  // template || !ctx.params.subject  || !ctx.params.to || !ctx.params.variables
                  await ctx.call('mailer.sendMail', {
                    template:4641813,
                    // subject:"[essai-possible] rendez-vous",
                    to:[{
                      Email :companyUserObject['pair:e-mail']
                    }],
                    variables:{
                      user : user['pair:e-mail'],
                      company: company['pair:label'],
                      timing:  newData['pair:startDate'],
                      job : job['pair:label']
                    }
                  });
                }


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
                  // console.log('updatedJob',updatedJob)

                  const user = await ctx.call('ldp.resource.get', { resourceUri : oldData['pair:concerns'], accept:'application/ld+json'});
                  const company =  await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});                
                  // console.log('company',company)
                  const companyUsers = company['pair:affiliates']==undefined?[]:Array.isArray(company['pair:affiliates'])?company['pair:affiliates']:[company['pair:affiliates']];
                  for (const companyUser of companyUsers) {
                    const companyUserObject = await ctx.call('ldp.resource.get', { resourceUri : companyUser, accept:'application/ld+json'});
                    // console.log('user',user);
    
                    // template || !ctx.params.subject  || !ctx.params.to || !ctx.params.variables
                    await ctx.call('mailer.sendMail', {
                      template:4642565,
                      // subject:"[essai-possible] rendez-vous",
                      to:[{
                        Email :companyUserObject['pair:e-mail']
                      }],
                      variables:{
                        user : user['pair:e-mail'],
                        company: company['pair:label'],
                        timing:  newData['pair:startDate'],
                        job : job['pair:label']
                      }
                    });

                    console.log('companyUserObject',companyUserObject)

                    if (companyUserObject['pair:phone']){
                      await ctx.call('mailer.sendSms', {
                        // subject:"[essai-possible] rendez-vous",
                        to:companyUserObject['pair:phone'],
                        text:`${user['pair:e-mail']} à annulé le rdv pour${job['pair:label']}`
                      });
                    }
                  }

                }

    
              break;
          
          default:
            break;
        }
    }
  }
};

