import { PairResourceCreate } from '../../pair';
import ProgramEdit from './ProgramEdit';
import ProgramList from './ProgramList';
import ProgramIcon from '@material-ui/icons/AccountTree';

export default {
  config: {
      list: ProgramList,
      create: PairResourceCreate,
      edit: ProgramEdit,
      icon: ProgramIcon,
      options: {
        label: 'Programmes'
      },
  },
  dataModel: {
    types: ['opal:Program'],
    list: {
      fetchContainer: true,
      dereference: ['pair:hasLocation/pair:hasPostalAddress'],
      forceArray: [
        'opal:hasBusinessCreationGoals',
        'opal:hasGenders',
        'opal:startingDates',
        'opal:hasJoBSearchGoals',
        'opal:hasTrainingGoals',
        'opal:hasFindingHelpGoals',
      ],
    },
    fieldsMapping: {
      title: 'pair:label'
    }
  },
  translations: {
    fr: {
      name: 'Programme |||| Les programmes',
      fields: {
        'pair:offeredBy': 'Proposé par', /*Organization*/
        'pair:label': 'Nom',
        'pair:description': 'Description',
        'opal:minimumAge' : 'Age minimum',
        'opal:maximumAge' : 'Age maximum',
        'opal:hasDegreeLevel': 'Niveau de diplôme',
        'opal:hasGenders': 'Genres',
        'opal:rqth': 'Reconnaissance de la qualité de travailleur handicapé',
        'opal:poleEmploi': 'Inscrit à Pôle Emploi',
        'opal:otherInfos': 'Autres',
        'opal:duration': 'Durée',
        'opal:startingDates': 'Dates de démarrage',
        'opal:numberOfParticipants': 'Nombre de participants',
        'opal:financialParticipation': 'Participation financière',
        'opal:registerLink': 'Lien pour postuler',
        'opal:hasTrainingMode': 'Mode de formation',
        'opal:hasBusinessCreationGoals': 'Création d\'entreprise',
        'opal:hasJobSearchGoals': 'Recherche d\'emploi',
        'opal:hasTrainingGoals': 'Se former',
        'opal:hasFindingHelpGoals': 'Besoin d\'aide',
        'opal:noIdea': 'Je ne sais pas ce que je veux faire',
        'opal:hasContactPerson': 'Personne à contacter', /*ContactPerson*/
        'pair:offers': 'Lieux de formation', /*TrainingSite*/
        'aurba:hasDataSource' : 'source',
      }
    }
  }
};
