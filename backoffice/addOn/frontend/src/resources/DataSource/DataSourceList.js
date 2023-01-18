import React from 'react';
import { ReferenceField } from "@semapps/semantic-data-provider";
import { Avatar } from "@material-ui/core";
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import {
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextField,
  Datagrid,
  TextInput,
  EditButton
} from 'react-admin';

const DataSourceList = props => (
  <List  {...props}>
      <SimpleList primaryText={record => record['pair:label']} linkType="show" />
  </List>
)

export default DataSourceList;
