const path = require('path');
const { MIME_TYPES } = require('@semapps/mime-types');

// console.log(process.env);

var mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);


module.exports = {
  name: 'mailer',
  dependencies: ['api'],
  // async started() {
  //   // Wait a bit before adding the route, or sometimes it is not added
  //   await new Promise(resolve => setTimeout(resolve, 3000));
  //   await this.broker.call('api.addRoute', {
  //     route: {
  //       bodyParsers: { json: true },
  //       aliases: {
  //         [`POST _mailer/send-email`]: 'mailer.sendMail'
  //       }
  //     }
  //   });
  // },
  actions: {
    async sendMail (ctx) {

      // console.log('ctx',ctx)
      if ( !ctx || !ctx.params || !ctx.params.template || !ctx.params.to || !ctx.params.variables ) {
        // console.log('CTX.PARAMS',ctx.params);
        throw new Error('One or more parameters are missing');
      }

      console.log('CTX.PARAMS',ctx.params);

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
          console.log('sendMail ok', result.body)
        })
        .catch((err) => {
          console.log('sendMail ko', err.statusCode, err.ErrorMessage)
          throw new Error('Error while sending mail');
        })

    },
  }
};
