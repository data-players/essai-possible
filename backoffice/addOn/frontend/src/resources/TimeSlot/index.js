import { PairResourceCreate } from '../../pair';
import JobEdit from './JobEdit';
import JobList from './JobList';
import JobIcon from '@material-ui/icons/AccountTree';

export default {
  config: {
      list: JobList,
      create: PairResourceCreate,
      edit: JobEdit,
      icon: JobIcon,
      options: {
        label: 'Offres'
      },
  },
  dataModel: {
    types: ['ep:Job'],
    fieldsMapping: {
      title: 'pair:label'
    }
  },
  translations: {
    fr: {
      name: 'Offre |||| Les Offres',
      fields: {
        'pair:offeredBy': 'Proposé par', /*pair:Organization*/
        'pair:label': 'Nom',
        'pair:description': 'Description',
        'ep:subjectOf': 'Disponibilités' /*ep:TimeSlot*/
      }
    }
  }
};
