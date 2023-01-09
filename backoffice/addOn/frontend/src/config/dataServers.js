const dataServers = {
  opaline: {
    name: 'Opaline',
    baseUrl: process.env.REACT_APP_MIDDLEWARE_URL,
    sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
    authServer: true,
    default: true,
    containers: {
      opaline: {
        'opal:BusinessCreationGoal': ['/business-creation-goals'],
        'opal:Configuration': ['/configurations'],
        'opal:ContactPerson': ['/contact-persons'],
        'opal:DegreeLevel': ['/degree-levels'],
        'opal:FAQ': ['/faq'],
        'opal:FindingHelpGoal': ['/finding-help-goals'],
        'opal:Gender': ['/genders'],
        'opal:JobSearchGoal': ['/job-search-goals'],
        'opal:TrainingGoal': ['/training-goals'],
        'opal:TrainingMode': ['/training-modes'],
        'opal:TrainingSite': ['/training-sites'],
        'opal:Program': ['/programs'],
        'pair:Organization': ['/organizations'],
        'semapps:Page': ['/pages'],
        'pair:Person': ['/persons'],
        'aurba:DataSource': ['/data-sources'],
      }
    },
    uploadsContainer: '/files'
  }
};

export default dataServers;
