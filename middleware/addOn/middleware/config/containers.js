const CONFIG = require('./config');
const { ACTOR_TYPES } = require("@semapps/activitypub");

const writePermissionsToCreator = creatorUri => {
  console.log('---------------------------- writePermissionsToCreator',CONFIG.HOME_URL+'_groups/superadmins');
  return {
    anon : {
      read: true
    },
    anyUser: {
      read: true,
    },
    user: {
      uri: creatorUri,
      read: true,
      write: true,
      control : true
    },
    group: {
      uri : CONFIG.HOME_URL+'_groups/superadmins',
      read: true,
      write: true,
      control : true
    }
  }
};

const writePermissionsToAll = creatorUri => {
  console.log('---------------------------- writePermissionsToAll',CONFIG.HOME_URL+'_groups/superadmins');
  return {
    anon : {
      read: true,
      read: true,
      write: true,
      control : true
    },
    anyUser: {
      read: true,
      read: true,
      write: true,
      control : true
    },
    user: {
      uri: creatorUri,
      read: true,
      write: true,
      control : true
    },
    group: {
      uri : CONFIG.HOME_URL+'_groups/superadmins',
      read: true,
      write: true,
      control : true
    }
  }
};

module.exports = [
  {
    path: '/',
  },
  {
    path: '/files',
    newResourcesPermissions: writePermissionsToAll
  },
  {
    path: '/business-creation-goals',
    acceptedTypes: ['opal:BusinessCreationGoal'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/configurations',
    acceptedTypes: ['opal:Configuration'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/contact-persons',
    acceptedTypes: ['opal:ContactPersons'],
    newResourcesPermissions: writePermissionsToAll
  },

  {
    path: '/degree-levels',
    acceptedTypes: ['opal:DegreeLevel'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/finding-help-goals',
    acceptedTypes: ['opal:FindingHelpGoal'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/faq',
    acceptedTypes: ['opal:FAQ'],
    newResourcesPermissions: writePermissionsToAll
  },
  {
    path: '/genders',
    acceptedTypes: ['opal:Gender'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/job-search-goals',
    acceptedTypes: ['opal:JobSearchGoal'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/organizations',
    acceptedTypes: ['pair:Organization'],
    dereference: ['pair:hasLocation/pair:hasPostalAddress'],
    newResourcesPermissions: writePermissionsToAll
  },
  {
    path: '/persons',
    acceptedTypes: ['pair:Person'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/programs',
    acceptedTypes: ['pair:Program'],
    newResourcesPermissions: writePermissionsToAll
  },
  {
    path: '/training-goals',
    acceptedTypes: ['opal:TrainingGoal'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/training-modes',
    acceptedTypes: ['opal:TrainingMode'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/training-sites',
    acceptedTypes: ['opal:TrainingSite'],
    dereference: ['pair:hasLocation/pair:hasPostalAddress'],
    newResourcesPermissions: writePermissionsToAll
  },
  {
    path: '/data-sources',
    acceptedTypes: ['aurba:DataSource'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/pages',
    acceptedTypes: ['semapps:Page'],
    newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/bots',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    dereference: ['sec:publicKey'],
    excludeFromMirror: true
  },
];
