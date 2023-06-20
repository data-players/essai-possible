const Cron = require("moleculer-cron");
const parsePhoneNumber = require('libphonenumber-js');
var mustache = require('mustache');
const dayjs = require('dayjs');

module.exports = {
    name: "reminder",
   mixins: [Cron],
    crons: [
        {
            name: "reminder-next-cron",
            cronTime: '*0 * * * *',
            onTick: function() {
                this.getLocalService("reminder")
                .actions.reminderNext()
                .then((data) => {
                    // console.log("Oh!", data);
                });
                // console.log('reminderNext ticked');
 
            },
            runOnInit: function() {
                // console.log("reminderNext is created");
            },
            timeZone: 'Europe/Paris'
        }
    ],
    actions: {
        reminderNext: {
            async handler(ctx) {
                
                const now = new Date();
                // console.log('-----------------reminder CRON -2')
                const dayNext = new Date(now.setDate(now.getDate() + 2));
                const dayNextIso = dayNext.toISOString();
                // console.log('dayNext',dayNext,dayNext);
                const queryNext= `
                PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                CONSTRUCT {
                  ?s1 ?p1 ?o1.
                }
                WHERE {
                  ?s1 a ep:TimeSlot.
                  ?s1 pair:startDate ?date .
                  FILTER (?date < "${dayNextIso}"^^xsd:dateTime).
                  FILTER EXISTS {?s1 pair:concerns ?user }.
                  FILTER NOT EXISTS {?s1 ep:remainderNext ?reminder }.
                  ?s1 ?p1 ?o1.
                }`
                // console.log(query);
                const timeSlotsResultNext  = await ctx.call('triplestore.query', { query:queryNext, accept:'application/ld+json'});
                // console.log(timeSlot);

                let timeSlotsNext=[];

                if (timeSlotsResultNext['@id']){
                    timeSlotsNext=[timeSlotsResultNext];
                }else if(timeSlotsResultNext['@graph']) {
                    timeSlotsNext=timeSlotsResultNext['@graph'].map(
                        g=>({...g,'@context':timeSlotsResultNext['@context']})
                    )
                }
                for (const timeSlot of timeSlotsNext) {
                    const job = await ctx.call('ldp.resource.get', { resourceUri : timeSlot.about, accept:'application/ld+json'});
                    const user = await ctx.call('ldp.resource.get', { resourceUri : timeSlot.concerns, accept:'application/ld+json'});
                    const company = await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});
                    // console.log(job,user,company);
                    const timing = dayjs(timeSlot['startDate']).format('LLLL');
                    let parsedPhoneNumber;
                    if(job['pair:phone']){
                        parsedPhoneNumber=parsePhoneNumber(job['pair:phone'], 'FR').number;
                    }

                    await ctx.call('mailer.sendMail', {
                        template:4709360,
                        to:[{
                            Email :user['pair:e-mail']
                        }],
                        variables:{
                            company:company['pair:label'],
                            timing,
                            mail:job['pair:e-mail'],
                            phonenumber:parsedPhoneNumber,
                            place:job['pair:hasLocation']['pair:label']
                        }
                    });

                    await ctx.call('mailer.sendMail', {
                        template:4709375,
                        to:[{
                            Email :job['pair:e-mail']
                        }],
                        variables:{
                            user : user['pair:label'],
                            timing,
                            place:job['pair:hasLocation']['pair:label']
                        }
                    });

                    const smsText = await getSmsMessage(ctx,"SMS - reminderNext", {
                        company:company['pair:label'],
                        timing:timing,
                        place:job['pair:hasLocation']['pair:label'],
                        mail:user['pair:e-mail']
                    });

                    const parsedPhoneNumberUSer = parsePhoneNumber(user['pair:phone'], 'FR').number;
                    await ctx.call('mailer.sendSms', {
                    to:parsedPhoneNumberUSer,
                    from:process.env.SMS_SENDER,
                    text:smsText
                    });

                    let newTimeSlot = {
                        ...timeSlot,
                        'ep:remainderNext':true
                    }

                    // console.log('reminder update',newTimeSlot)
                    const newTimeSlotUpdated= await ctx.call('ldp.resource.put', { resource : newTimeSlot, webId:'system', contentType:'application/ld+json'});

                }        
                
                // console.log('-----------------reminder CRON +10')
                const dayPrevious = new Date(now.setDate(now.getDate() - 10));
                const dayPreviousIso = dayPrevious.toISOString();
                // console.log('dayNext',dayNext,dayNext);
                const queryPrevious= `
                PREFIX ep: <https://data.essai-possible.data-players.com/ontology#>
                PREFIX pair: <http://virtual-assembly.org/ontologies/pair#>
                PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                CONSTRUCT {
                  ?s1 ?p1 ?o1.
                }
                WHERE {
                  ?s1 a ep:TimeSlot.
                  ?s1 pair:startDate ?date .
                  FILTER (?date < "${dayPreviousIso}"^^xsd:dateTime).
                  FILTER EXISTS {?s1 pair:concerns ?user }.
                  FILTER NOT EXISTS {?s1 ep:remainderPrevious ?reminder }.
                  ?s1 ?p1 ?o1.
                }`
                // console.log(queryPrevious);
                const timeSlotsResultPrevious  = await ctx.call('triplestore.query', { query:queryPrevious, accept:'application/ld+json'});
                // console.log(timeSlotsResultPrevious);


                let timeSlotsPrevious=[];

                if (timeSlotsResultPrevious['@id']){
                    timeSlotsPrevious=[timeSlotsResultPrevious];
                }else if(timeSlotsResultPrevious['@graph']) {
                    timeSlotsPrevious=timeSlotsResultPrevious['@graph'].map(
                        g=>({...g,'@context':timeSlotsResultPrevious['@context']})
                    )
                }
                for (const timeSlot of timeSlotsPrevious) {
                    const job = await ctx.call('ldp.resource.get', { resourceUri : timeSlot.about, accept:'application/ld+json'});
                    const user = await ctx.call('ldp.resource.get', { resourceUri : timeSlot.concerns, accept:'application/ld+json'});
                    const company = await ctx.call('ldp.resource.get', { resourceUri : job['pair:offeredBy'], accept:'application/ld+json'});
                    // console.log(job,user,company);
                    const timing = dayjs(timeSlot['startDate']).format('LLLL');
                    let parsedPhoneNumber;
                    if(job['pair:phone']){
                        parsedPhoneNumber=parsePhoneNumber(job['pair:phone'], 'FR').number;
                    }

                    await ctx.call('mailer.sendMail', {
                        template:4709562,//6.a beneficiare
                        to:[{
                            Email :user['pair:e-mail']
                        }],
                        variables:{
                        }
                    });

                    await ctx.call('mailer.sendMail', {
                        template:4709551,//6.1 entreprise
                        to:[{
                            Email :job['pair:e-mail']
                        }],
                        variables:{
                        }
                    });

                    const smsText = await getSmsMessage(ctx,"SMS - reminderPrevious", {
                        mail:user['pair:e-mail']
                    });

                    const parsedPhoneNumberUSer = parsePhoneNumber(user['pair:phone'], 'FR').number;
                    await ctx.call('mailer.sendSms', {
                    to:parsedPhoneNumberUSer,
                    from:process.env.SMS_SENDER,
                    text:smsText
                    });

                    let newTimeSlot = {
                        ...timeSlot,
                        'ep:remainderPrevious':true
                    }

                    // console.log('reminder update',newTimeSlot)
                    const newTimeSlotUpdated= await ctx.call('ldp.resource.put', { resource : newTimeSlot, webId:'system', contentType:'application/ld+json'});

                }                

                

                // return "HelloWorld!";

                
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
  