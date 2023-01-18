import React from 'react';
import Edit from "../../layout/edit/Edit";
import { SimpleForm } from "ra-ui-materialui";
import DataSourceTitle from './DataSourceTitle';
// import MarkdownInput from '../../markdown/MarkdownInput'
// import MarkdownField from "../../markdown/MarkdownField";
import ToolBarCustom from '../commons/ToolBarCustom';
import {
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  TextInput,
  BooleanInput,
  useEditController
} from 'react-admin';
// import {ReificationArrayInput} from '@semapps/semantic-data-provider';

export const DataSourceEdit = props => {
  const {
      record, // record fetched via dataProvider.getOne() based on the id from the location
  } = useEditController(props);
  const lock = record?.['aurba:deleteEdit'];
  return (
      <Edit title={<DataSourceTitle />} {...props} >
        <SimpleForm redirect="show" toolbar={<ToolBarCustom deleteable={!lock}/>}>
            <TextInput source="pair:label" fullWidth />
            <BooleanInput source="aurba:deleteEdit" fullWidth />
        </SimpleForm>
      </Edit>
  )
}

export default DataSourceEdit;
