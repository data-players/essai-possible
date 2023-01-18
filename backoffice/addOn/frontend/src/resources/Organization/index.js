import { PairResourceCreate } from '../../pair';
import OrganizationEdit from './OrganizationEdit';
import OrganizationList from './OrganizationList';
import HomeIcon from '@material-ui/icons/Home';

export default {
  config: {
      list: OrganizationList,
      create: PairResourceCreate,
      edit: OrganizationEdit,
      icon: HomeIcon,
      options: {
        label: 'Entreprises'
      },
  },
  dataModel: {
    types: ['pair:Organization'],
    list: {
      dereference: ['pair:hasLocation/pair:hasPostalAddress'],
      fetchContainer: true,
      forceArray: [
        'pair:e-mail',
        'opal:socialNetworks',
      ],
    },
    fieldsMapping: {
      title: 'pair:label'
    }
  },
  translations: {
    fr: {
      name: 'Structure |||| Les structures',
      fields: {
        'pair:label': 'Nom',
        'pair:hasLocation': 'Adresse',
        'pair:description': 'Description',
        'pair:depictedBy': 'Logo',
        'pair:phone': 'Téléphone',
        'pair:e-mail': 'E-mail',
        'pair:webPage': 'Site internet',
        'opal:socialNetworks': 'Réseaux sociaux',
        'pair:hasLocation.pair:hasPostalAddress.pair:addressZipCode':'code postale',
        'aurba:hasDataSource' : 'source',
        'pair:hasLocation.pair:longitude' :'longitude',
        'pair:hasLocation.pair:latitude' :'latitude',
        'aurba:externalDeleted':`suppression à la source`,
        'aurba:siret':`siret`
      }
    }
  }
};
