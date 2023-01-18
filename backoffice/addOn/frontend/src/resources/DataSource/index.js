import DataSourceCreate from './DataSourceCreate';
import DataSourceEdit from './DataSourceEdit';
import DataSourceList from './DataSourceList';
import DataSourceShow from './DataSourceShow';
import BuildIcon from '@material-ui/icons/Build';

export default {
    config: {
        list: DataSourceList,
        show: DataSourceShow,
        create: DataSourceCreate,
        edit: DataSourceEdit,
        icon: BuildIcon,
        options: {
          label: 'Source de Données'
        },
    },
    dataModel: {
        types: ['aurba:DataSource'],
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'data-sources',
        slugField: 'pair:label',
        fieldsMapping: {
          title: 'pair:label'
        }
      },
      translations: {
        fr: {
          name: 'Source de données |||| Sources de données',
          fields: {
            'pair:label': 'Titre',
            'pair:description': 'description',
            'aurba:deleteEdit' : `Bloquer la suppression`
          }
        }
      }
};
