const dataServers = {
  essaiPossible: {
    name: 'Essai Possible',
    baseUrl: process.env.REACT_APP_MIDDLEWARE_URL,
    sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
    authServer: true,
    default: true,
    containers: {
      essaiPossible: {
        'ep:Job': ['/jobs'],
        'pair:Organization': ['/organizations'],
        'semapps:Page': ['/pages'],
        'pair:Person': ['/users'],
        'pair:Sector':['/sectors'],
        'pair:Skill':['/skills'],
        'pair:Challenge':['/challenges'],
        'aurba:DataSource': ['/data-sources'],
        'ep:JobStatus': ['/status'],
      }
    },
  }
};

export default dataServers;
