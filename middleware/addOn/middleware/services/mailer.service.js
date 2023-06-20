// const path = require('path');
// const { MIME_TYPES } = require('@semapps/mime-types');
const fetch = require('node-fetch');
var mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);


module.exports = {
  name: 'mailer',
  dependencies: ['api'],
  async started() {
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE){
      throw new Error(`missing MJ_APIKEY_PUBLIC or MJ_APIKEY_PRIVATE environnment variable to send mails`)
    }
    if (!process.env.MJ_SMS_TOKEN){
      throw new Error(`missing MJ_SMS_TOKEN environnment variable to send sms`)
    }
  },
  actions: {
    async sendMail (ctx) {

      // console.log('ctx',ctx)
      if ( !ctx || !ctx.params || !ctx.params.template || !ctx.params.to || !ctx.params.variables ) {
        // console.log('CTX.PARAMS',ctx.params);
        throw new Error('One or more parameters are missing');
      }

      // console.log('CTX.PARAMS',ctx.params);

      const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": {
                "Email": process.env.REPLYTO_EMAIL,
                "Name": process.env.REPLYTO_LABEL
              },
              "To": ctx.params.to,
              "TemplateID": ctx.params.template,
              "TemplateLanguage": true,
              "Subject": ctx.params.subject,
              "Variables": ctx.params.variables
            }
          ]
        })
      await request
        .then((result) => {
          // console.log('sendMail ok', JSON.stringify(result.body))
        })
        .catch((err) => {
          console.error('sendMail ko', err.statusCode, err.ErrorMessage)
          throw new Error('Error while sending mail');
        })

    },
    async sendSms (ctx) {

      // console.log('ctx',ctx)
      if ( !ctx || !ctx.params ||!ctx.params.from || !ctx.params.to  || !ctx.params.text) {
        // console.log('CTX.PARAMS',ctx.params);
        throw new Error('One or more parameters are missing');
      }

      // console.log('CTX.PARAMS',ctx.params);

      let url = 'https://api.mailjet.com/v4/sms-send';
      const body={
        "From": ctx.params.from ,
        "To": ctx.params.to,
        "Text":ctx.params.text
      }

      let options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MJ_SMS_TOKEN}`,
         'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      // console.log('nodeFetch',fetch)

      fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
    },

  }
};
