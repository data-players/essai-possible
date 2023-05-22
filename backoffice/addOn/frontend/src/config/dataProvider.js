import { dataProvider as semanticDataProvider } from '@semapps/semantic-data-provider';
import ontologies from './ontologies.json';
import dataServers from './dataServers';
import * as resources from '../resources';

console.log ('dataServers',dataServers)

const dataProvider = semanticDataProvider({
  dataServers,
  resources: Object.fromEntries(Object.entries(resources).map(([k, v]) => [k, v.dataModel])),
  ontologies,
  jsonContext: "https://data.essai-possible.data-players.com/" + 'context.json'
});

export default dataProvider;
