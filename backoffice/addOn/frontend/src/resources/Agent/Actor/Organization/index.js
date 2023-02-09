import CreateOrImport from '../../../../common/CreateOrImport';
import OrganizationEdit from './OrganizationEdit';
import OrganizationList from './OrganizationList';
import OrganizationShow from './OrganizationShow';
import HomeIcon from '@material-ui/icons/Home';

export default {
  config: {
    list: OrganizationList,
    show: OrganizationShow,
    create: CreateOrImport,
    edit: OrganizationEdit,
    icon: HomeIcon,
    options: {
      label: 'Entreprise',
    }
  },
  dataModel: {
    types: ['pair:Organization'],
    list: {
      servers: '@default',
      forceArray: ['pair:affiliates']
    },
    fieldsMapping: {
      title: 'pair:label'
    }
  },
  translations: {
    fr: {
      name: 'Entreprise |||| Entreprises',
      fields: {
        'pair:label': 'Nom',
        'pair:comment': 'Courte description',
        'pair:description': 'Description',
        'pair:homePage': 'Site web',
        image: 'Logo',
        'pair:affiliates': 'personne associées',
        'pair:partnerOf': 'Partenaire de',
        'pair:involvedIn': 'Impliqué dans',
        'pair:hasType': 'Type',
        'pair:hasStatus': 'Statut',
        'pair:hasTopic': 'A pour thème',
        'pair:documentedBy': 'Documenté par',
        'pair:hasLocation': 'Adresse',
        'pair:membershipActor': 'Membre',
        'pair:membershipRole': 'Role',
        'ep:siret': 'Siret'
      }
    }
  }
};
