const path = require('path');
const urlJoin = require("url-join");
const { CoreService } = require('@semapps/core');
const CONFIG = require('../config/config');
const containers = require('../config/containers');
const ApiGatewayService = require('moleculer-web');

console.log('jsonContextl',urlJoin(CONFIG.HOME_URL, 'context.json'));

module.exports = {
  mixins: [CoreService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    baseDir: path.resolve(__dirname, '..'),
    jsonContext: urlJoin('https://data.essaipossible.fr/','context.json'),
    triplestore: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET,
    },
    containers,
    api: {
      port: CONFIG.PORT,
      routes: [
        {
          path: '/ontology',
          use: [
            ApiGatewayService.serveStatic('./public/ontology.ttl', {
              setHeaders: res => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'text/turtle; charset=utf-8');
              }
            })
          ]
        },
        {
           path: '/context.json',
           use: [
             ApiGatewayService.serveStatic('./public/context.json', {
               setHeaders: res => {
                 res.setHeader('Access-Control-Allow-Origin', '*');
                 res.setHeader('Content-Type', 'application/json; charset=utf-8');
               }
             })
           ]
       }
      ]
    },
    ldp: false,
    // ldp: {
    //   preferredViewForResource: async (resourceUri, containerPreferredView) => {
    //     if (!containerPreferredView) return resourceUri;
    //     return urlJoin(CONFIG.FRONT_URL, containerPreferredView, encodeURIComponent(resourceUri), 'show')
    //   },
      
    //   remoteContextFiles: [
    //     {
    //       uri: 'https://www.w3.org/ns/activitystreams',
    //       file: path.resolve(__dirname, './node_modules/@seampps/core/config/context-as.json')
    //     },
    //     {
    //       uri: 'https://data.essaipossible.fr/context.json',
    //       file: path.resolve(__dirname, './public/context.json')
    //     }
    //   ],
    // },
    void: {
      title: CONFIG.INSTANCE_NAME,
      description: CONFIG.INSTANCE_DESCRIPTION
    },
    webacl: {
      superAdmins: [
        'https://data.essaipossible.fr/users/simon.louvet.zen',
        'https://data.essaipossible.fr/users/bastien.siguier',
        'https://data.essaipossible.fr/users/tech',
        'https://data.essaipossible.fr/users/simon.louvet.zen',
        'https://data.essaipossible.fr/users/tech',
        'https://data.essaipossible.fr/users/claire.versini',
        'https://data.essaipossible.fr/users/maxime.gaudubois',
      ]
    }
  }
};
