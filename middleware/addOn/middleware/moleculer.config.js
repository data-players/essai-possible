const CONFIG = require('./config/config');
const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');


console.log('Locale CACHE',CONFIG.REDIS_CACHE_HOST);

// Use the cacher only if Redis is configured
const cacherConfig = CONFIG.REDIS_CACHE_HOST
  ? {
      type: 'Redis',
      options: {
        prefix: 'action',
        ttl: 2592000, // Keep in cache for one month
        monitor: true,
        redis: {
         host: CONFIG.REDIS_CACHE_HOST,
         password: CONFIG.REDIS_CACHE_PASSW,
       },
      }
    }
  : undefined;

module.exports = {
  // You can set all ServiceBroker configurations here
  // See https://moleculer.services/docs/0.14/configuration.html
  middlewares: [
    CacherMiddleware(cacherConfig), // Set the cacher before the WebAcl middleware
    WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })
  ]
};
