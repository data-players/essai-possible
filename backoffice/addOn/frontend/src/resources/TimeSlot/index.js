import { PairResourceCreate } from '../../pair';
import TimeSlotEdit from './TimeSlotEdit';
import TimeSlotShow from './TimeSlotShow';
import TimeSlotList from './TimeSlotList';
import TimeSlotIcon from '@material-ui/icons/AccountTree';

export default {
  config: {
      list: TimeSlotList,
      create: PairResourceCreate,
      edit: TimeSlotEdit,
      show : TimeSlotShow,
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
        'pair:about': 'Offre', /*pair:Organization*/
        'pair:label': 'Nom',
        'pair:description': 'Description',
        'pair:startDate':'date de début',
        'pair:endDate':'date de fin',
        'ep:subjectOf': 'Disponibilités' /*ep:TimeSlot*/
      }
    }
  }
};
