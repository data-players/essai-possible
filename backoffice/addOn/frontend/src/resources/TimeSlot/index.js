import { PairResourceCreate } from '../../pair';
import TimeSlotEdit from './TimeSlotEdit';
import TimeSlotList from './TimeSlotList';
import TimeSlotIcon from '@material-ui/icons/AccountTree';

export default {
  config: {
      list: TimeSlotList,
      create: PairResourceCreate,
      edit: TimeSlotEdit,
      icon: TimeSlotIcon,
      options: {
        label: 'Disponibiltés'
      },
  },
  dataModel: {
    types: ['ep:TimeSlot'],
    fieldsMapping: {
      title: 'pair:label'
    }
  },
  translations: {
    fr: {
      name: 'Disponibilité |||| Les Disponibilités',
      fields: {
        'pair:offeredBy': 'Proposé par', /*pair:Organization*/
        'pair:label': 'Nom',
        'pair:description': 'Description',
        'ep:subjectOf': 'Disponibilités' /*ep:TimeSlot*/
      }
    }
  }
};
