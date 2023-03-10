const CONFIG = require('./config');
const { ACTOR_TYPES } = require("@semapps/activitypub");
//
// const writePermissionsToCreator = creatorUri => {
//   console.log('---------------------------- writePermissionsToCreator',CONFIG.HOME_URL+'_groups/superadmins');
//   return {
//     anon : {
//       read: true
//     },
//     anyUser: {
//       read: true,
//     },
//     user: {
//       uri: creatorUri,
//       read: true,
//       write: true,
//       control : true
//     },
//     group: {
//       uri : CONFIG.HOME_URL+'_groups/superadmins',
//       read: true,
//       write: true,
//       control : true
//     }
//   }
// };
//
const writePermissionsToConnected = creatorUri => {
  console.log('---------------------------- writePermissionsToAll',CONFIG.HOME_URL+'_groups/superadmins');
  return {
    anon : {
      read: true,
      write: false,
      control : false
    },
    anyUser: {
      read: true,
      write: true,
      control : false
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
    path: '/organizations',
    acceptedTypes: ['pair:Organization'],
    preferredView: '/Organization',
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress'],
    newResourcesPermissions: writePermissionsToConnected,
    dereference: ['pair:hasLocation/pair:hasPostalAddress'],
  },
  {
    path: '/users',
    preferredView: '/Person',
    acceptedTypes: ['pair:Person'],
    dereference: ['sec:publicKey', 'pair:hasLocation/pair:hasPostalAddress']
  },
  {
    path: '/programs',
    acceptedTypes: ['opal:Program'],
    preferredView: '/Program',
  },
  {
    path: '/jobs',
    acceptedTypes: ['ep:Job'],
    preferredView: '/Program',
    newResourcesPermissions: writePermissionsToConnected,
    dereference: ['pair:hasLocation/pair:hasPostalAddress'],
  },
  {
    path: '/timeSlot',
    acceptedTypes: ['ep:TimeSlot'],
    preferredView: '/TimeSlot',
    newResourcesPermissions: writePermissionsToConnected
  },
  {
    path: '/data-sources',
    acceptedTypes: ['aurba:DataSource'],
    preferredView: '/DataSource',
  },
  {
    path: '/pages',
    acceptedTypes: ['semapps:Page'],
    // newResourcesPermissions: writePermissionsToCreator
  },
  {
    path: '/themes',
    preferredView: '/Theme',
    acceptedTypes: ['pair:Theme']
  },
  {
    path: '/sectors',
    preferredView: '/Sector',
    acceptedTypes: ['pair:Sector']
  },
  {
    path: '/skills',
    preferredView: '/Skill',
    acceptedTypes: ['pair:Skill']
  },
  {
    path: '/challenges',
    preferredView: '/Challenge',
    acceptedTypes: ['pair:Challenge']
  },
  {
    path: '/status',
    preferredView: '/Status',
    acceptedTypes: [
      'pair:Status',
      'pair:ActivityStatus',
      'pair:AgentStatus',
      'pair:DocumentStatus',
      'pair:EventStatus',
      'pair:IdeaStatus',
      'pair:ProjectStatus',
      'pair:TaskStatus',
      'ep:JobStatus'
    ]
  },
  {
    path: '/types',
    preferredView: '/Type',
    acceptedTypes: [
      'pair:Type',
      'pair:ActivityType',
      'pair:AgentType',
      'pair:ConceptType',
      'pair:DocumentType',
      'pair:EventType',
      'pair:FolderType',
      'pair:GroupType',
      'pair:IdeaType',
      'pair:ObjectType',
      'pair:OrganizationType',
      'pair:PlaceType',
      'pair:ProjectType',
      'pair:ResourceType',
      'pair:SubjectType',
      'pair:TaskType'
    ]
  },
  {
    path: '/bots',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    dereference: ['sec:publicKey'],
    excludeFromMirror: true
  },
];
