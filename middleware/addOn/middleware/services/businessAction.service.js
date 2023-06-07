const CONFIG = require('../config/config');
const parsePhoneNumber = require('libphonenumber-js');
var mustache = require('mustache');
const dayjs = require('dayjs');
const urlJoin = require('url-join');
const LocalizedFormat = require( 'dayjs/plugin/localizedFormat')
dayjs.extend(LocalizedFormat)
require('dayjs/locale/fr')
dayjs.locale('fr');

function normalisePredicate(data, predicate) {
  return data[predicate] == undefined ? [] : Array.isArray(data[predicate]) ? data[predicate] : [data[predicate]];
}

module.exports = {
  name: 'businessAction',
  events : {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId } = ctx.params;
      console.log('------------------- created',newData,webId)
      const container = await ctx.call('ldp.registry.getByUri', { resourceUri});
      switch (container.path) {
        case '/organizations':
          const user = await ctx.call('ldp.resource.get', { resourceUri : webId, accept:'application/ld+json'});
          await ctx.call('mailer.sendMail', {
            template:4658992,
            to:[{
              Email :user['pair:e-mail']
            }],
            variables:{
              company:newData['pair:label']
            }
          });
          break;
        case '/users':
          await ctx.call('mailer.sendMail', {
            template:4659000,//1.c
            to:[{
              Email :newData['foaf:email']
            }],
            variables:{
              user:newData['foaf:email']
            }
          });
          break;
        default:
          break;
  }
    },
    async 'ldp.resource.updated'(ctx) {
        const { resourceUri, oldData, newData, webId } = ctx.params;
        const frontUrl = CONFIG.FRONT_URL;
        // console.log('______________________________ldp.resource.updated',ctx.params);
        const container = await ctx.call('ldp.registry.getByUri', { resourceUri});
        // console.log('ldp.resource.updated container',container)
        const queryArchivee= `
        PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
        PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
        CONSTRUCT {
          ?s1 ?p1 ?o1.
        }
        WHERE {
          ?s1 a ep:JobStatus.
          ?s1 pair:label ?l1.
          FILTER(REGEX(LCASE(STR(?l1)), LCASE("Archivée"))).
          ?s1 ?p1 ?o1.
        }`

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
                  to:[{
                    Email :user['pair:e-mail']
                  }],
                  variables:{
                    user : newData['pair:e-mail'],
                    company:company['pair:label'],
                    url:`${CONFIG.FRONT_URL}company/${encodeURIComponent(company.id)}/users`
                  }
                });
              }
              await ctx.call('mailer.sendMail', {
                template:4708782,
                to:[{
                  Email :newData['pair:e-mail']
                }],
                variables:{
                  company:company['pair:label'],
                  url:`${CONFIG.FRONT_URL}company/${encodeURIComponent(company.id)}/users`
                }
              });
              
              // console.log('company',company)
            }
            // const newAffiliation = newData['pair:affiliatedBy']==undefined?[]:Array.isArray(newData['pair:affiliatedBy'])?newData['pair:affiliatedBy']:[newData['pair:affiliatedBy']];
            // const oldAffiliation = oldData['pair:affiliatedBy']==undefined?[]:Array.isArray(oldData['pair:affiliatedBy'])?oldData['pair:affiliatedBy']:[newData['pair:affiliatedBy']];
            // const diffCompanies=newAffiliation.filter(c=>!oldAffiliation.includes(c));

            // for (const diffCompany of diffCompanies) {
            //   const company = await ctx.call('ldp.resource.get', { resourceUri : diffCompany, accept:'application/ld+json'});
            //   await ctx.call('mailer.sendMail', {
            //     template:4708834,
            //     to:[{
            //       Email :newData['pair:e-mail']
            //     }],
            //     variables:{
            //       company:company['pair:label'],
            //       url:`${CONFIG.FRONT_URL}company/${encodeURIComponent(company.id)}/users`
            //     }
            //   });
            //   // console.log('company',company)
            // }

            break;

            case '/organizations':

              const newAffiliation = newData['pair:affiliates']==undefined?[]:Array.isArray(newData['pair:affiliates'])?newData['pair:affiliates']:[newData['pair:affiliates']];
              const oldAffiliation = oldData['pair:affiliates']==undefined?[]:Array.isArray(oldData['pair:affiliates'])?oldData['pair:affiliates']:[newData['pair:affiliates']];
              const diffUsers=newAffiliation.filter(c=>!oldAffiliation.includes(c));
  
              for (const diffUser of diffUsers) {
                const user = await ctx.call('ldp.resource.get', { resourceUri : diffUser, accept:'application/ld+json'});
                await ctx.call('mailer.sendMail', {
                  template:4708834,
                  to:[{
                    Email :user['pair:e-mail']
                  }],
                  variables:{
                    company:newData['pair:label']
                  }
                });
                // console.log('company',company)
              }
              break;

            case '/jobs':
              const statusArchivee  = await ctx.call('triplestore.query', { query : queryArchivee, accept:'application/ld+json'});

              if (oldData['pair:hasStatus']!=statusArchivee['@id'] && newData['pair:hasStatus']==statusArchivee['@id']){
                const timeSlots= oldData['ep:subjectOf']==undefined?[]:Array.isArray(oldData['ep:subjectOf'])?oldData['ep:subjectOf']:[newData['ep:subjectOf']]
                for (const timeSlot of timeSlots) {
                  const timeSlotObject = await ctx.call('ldp.resource.get', { resourceUri : timeSlot, accept:'application/ld+json'});
                  if (timeSlotObject['pair:concerns'] && (new Date(timeSlotObject['pair:startDate'] > new Date()))){
                    const abordedTimeSlot={
                      ...timeSlotObject,
                      'pair:concerns':undefined
                    }
                    await ctx.call('ldp.resource.put', { resource:abordedTimeSlot, webId:webId, contentType:'application/ld+json'});
                  }
                }
              }
              break;
            case '/timeSlot':

              const predicate = 'pair:concerns';
              const newConcerns = normalisePredicate(newData, predicate);
              const oldConcerns = normalisePredicate(oldData, predicate);

          
              const diffConcerns=newConcerns.filter(c=>!oldConcerns.includes(c));
              if(diffConcerns.length>0){
                //RDV
                const job = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:about'], accept:'application/ld+json'});
                // const query= `
                // PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                // PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                // CONSTRUCT {
                //   ?s1 ?p1 ?o1.
                // }
                // WHERE {
                //   ?s1 a ep:JobStatus.
                //   ?s1 pair:label ?l1.
                //   FILTER(REGEX(LCASE(STR(?l1)), LCASE("Pourvue"))).
                //   ?s1 ?p1 ?o1.
                // }`
                // const status  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});

                // let newJob = {
                //   ...job,
                //   'pair:hasStatus':status['@id']
                // }
                const timing = dayjs(newData['pair:startDate']).format('LLLL');


                const user = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:concerns'], accept:'application/ld+json'});
                const company =  await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});                


                await ctx.call('mailer.sendMail', {
                  template:4708943,//2.a

                  to:[{
                    Email :user['pair:e-mail']
                  }],
                  variables:{
                    user : user['pair:e-mail'],
                    company: company['pair:label'],
                    timing:  timing,
                    job : job['pair:label'],
                    place : job['pair:hasLocation']['pair:label'],
                    mail : job['pair:e-mail'],
                    phone : job['pair:phone']
                    
                  }
                });


                if(job['pair:e-mail']){
                  await ctx.call('mailer.sendMail', {
                    template:4641813,

                    to:[{
                      Email :job['pair:e-mail']
                    }],
                    variables:{
                      user : user['pair:e-mail'],
                      company: company['pair:label'],
                      timing:  timing,
                      job : job['pair:label']
                    }
                  });
                }
                const companyUsers = company['pair:affiliates']==undefined?[]:Array.isArray(company['pair:affiliates'])?company['pair:affiliates']:[company['pair:affiliates']];
                for (const companyUser of companyUsers) {
                  const companyUserObject = await ctx.call('ldp.resource.get', { resourceUri : companyUser, accept:'application/ld+json'});

                  await ctx.call('mailer.sendMail', {
                    template:4641813,
                    to:[{
                      Email :companyUserObject['pair:e-mail']
                    }],
                    variables:{
                      user : user['pair:e-mail'],
                      company: company['pair:label'],
                      timing:  timing,
                      job : job['pair:label']
                    }
                  });
                }
              }
              const invDiffConcerns=oldConcerns.filter(c=>!newConcerns.includes(c));
              if(invDiffConcerns.length>0){
                  //ANNULATION
                  const job = await ctx.call('ldp.resource.get', { resourceUri : newData['pair:about'], accept:'application/ld+json'});
 
                  // const query= `
                  // PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                  // PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                  // CONSTRUCT {
                  //   ?s1 ?p1 ?o1.
                  // }
                  // WHERE {
                  //   ?s1 a ep:JobStatus.
                  //   ?s1 pair:label ?l1.
                  //   FILTER(REGEX(LCASE(STR(?l1)), LCASE("Publiée"))).
                  //   ?s1 ?p1 ?o1.
                  // }`
                  // const status  = await ctx.call('triplestore.query', { query, accept:'application/ld+json'});

                  // let newJob = {
                  //   ...job,
                  //   'pair:hasStatus':status['@id']
                  // }

                  const timing = dayjs(newData['pair:startDate']).format('LLLL');
                  const user = await ctx.call('ldp.resource.get', { resourceUri : oldData['pair:concerns'], accept:'application/ld+json'});
                  const company =  await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});                

                  if (user.id==webId){
                    if (job['pair:e-mail']){
                      await ctx.call('mailer.sendMail', {
                        template:4658987,//4.b
                        to:[{
                          Email :job['pair:e-mail']
                        }],
                        variables:{
                          user : user['pair:e-mail'],
                          company: company['pair:label'],
                          timing:  timing,
                          job : job['pair:label'],
                          url1 : urlJoin(frontUrl,'offers',encodeURIComponent(job.id))
                        }
                      });
                    }

                    if(job['pair:phone']){
                      const smsText = await getSmsMessage(ctx,"SMS - annulation", {
                        user:user['pair:e-mail'],
                        timing:timing,
                        job:job['pair:label'],
                        mail:job['pair:e-mail']
                      });
                      const parsedPhoneNumber = parsePhoneNumber(job['pair:phone'], 'FR').number;
                      await ctx.call('mailer.sendSms', {
                        // subject:"[essai-possible] rendez-vous",
                        to:parsedPhoneNumber,
                        from:process.env.SMS_SENDER,
                        text:smsText
                      });
                    }


                    const companyUsers = company['pair:affiliates']==undefined?[]:Array.isArray(company['pair:affiliates'])?company['pair:affiliates']:[company['pair:affiliates']];
                    for (const companyUser of companyUsers) {
                      const companyUserObject = await ctx.call('ldp.resource.get', { resourceUri : companyUser, accept:'application/ld+json'});

                      await ctx.call('mailer.sendMail', {
                        template:4658987,//4.b
                        to:[{
                          Email :companyUserObject['pair:e-mail']
                        }],
                        variables:{
                          user : user['pair:e-mail'],
                          company: company['pair:label'],
                          timing:  timing,
                          job : job['pair:label'],
                          url1 : urlJoin(frontUrl,'offers',encodeURIComponent(job.id))
                        }
                      });

                      if (companyUserObject['pair:phone']){
                        const smsText = await getSmsMessage(ctx,"SMS - annulation", {
                          user:user['pair:e-mail'],
                          timing:timing,
                          job:job['pair:label'],
                          mail:companyUserObject['pair:e-mail']
                        });
                        const parsedPhoneNumber = parsePhoneNumber(companyUserObject['pair:phone'], 'FR').number;
                        await ctx.call('mailer.sendSms', {
                          // subject:"[essai-possible] rendez-vous",
                          to:parsedPhoneNumber,
                          from:process.env.SMS_SENDER,
                          text:smsText
                        });
                      }
                    }                   
                    

                  } else {
                    console.log('queryArchivee',queryArchivee)
                    const statusArchivee  = await ctx.call('triplestore.query', { query : queryArchivee, accept:'application/ld+json'});
                    if(job['pair:hasStatus']==statusArchivee['@id']){
                      await ctx.call('mailer.sendMail', {
                        template:4709230,//3.a
                        to:[{
                          Email :user['pair:e-mail']
                        }],
                        variables:{
                          company: company['pair:label'],
                          timing:  timing,
                          job : job['pair:label'],
                        }
                      });
                    }else{
                      await ctx.call('mailer.sendMail', {
                        template:4642565,//4.1.i
                        to:[{
                          Email :user['pair:e-mail']
                        }],
                        variables:{
                          company: company['pair:label'],
                          timing:  timing,
                          job : job['pair:label'],
                        }
                      });
                    }
                    console.log('SEND SMS ANNULATION',user['pair:phone'])
                    if(user['pair:phone']){
                      const smsText = await getSmsMessage(ctx,"SMS - annulation entreprise", {
                        company: company['pair:label'],
                        timing:timing,
                        job:job['pair:label'],
                        mail:user['pair:e-mail']
                      });
                      const parsedPhoneNumber = parsePhoneNumber(job['pair:phone'], 'FR').number;
                      await ctx.call('mailer.sendSms', {
                        to:parsedPhoneNumber,
                        from:process.env.SMS_SENDER,
                        text:smsText
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

async function getSmsMessage(ctx, title, variables) {
  const query = `
                      PREFIX semapps: <http://semapps.org/ns/core#>
                      PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                      CONSTRUCT {
                        ?s1 ?p1 ?o1.
                      }
                      WHERE {
                        ?s1 a semapps:Page.
                        ?s1 semapps:title ?l1.
                        FILTER(REGEX(LCASE(STR(?l1)), LCASE("${title}"))).
                        ?s1 ?p1 ?o1.
                      }`;
  const page = await ctx.call('triplestore.query', { query, accept: 'application/ld+json' });
  console.log('page', page);

  const text = mustache.render(page.content, variables);
  console.log('text', text);
  return text;
}

