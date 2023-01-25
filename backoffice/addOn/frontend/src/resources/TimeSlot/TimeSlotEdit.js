import React, { useState } from 'react';

import { TextInput } from "ra-ui-materialui";
import {
  ArrayInput,
  BooleanInput,
  DateInput,
  FormTab,
  NumberInput,
  SelectArrayInput,
  SelectInput,
  SimpleFormIterator,
  TabbedForm,
  AutocompleteInput,
  required,
  useEditController
} from 'react-admin';

import { MarkdownInput } from '@semapps/markdown-components'
import Title from '../commons/Title';
import { DateTimeInput } from '../../common/input';
import Edit from "../../layout/edit/Edit";
import { ReferenceArrayInput,ReferenceInput } from "@semapps/input-components";
import { QuickAppendReferenceArrayField } from '@semapps/field-components';

export const JobEdit = props => {
  const controllerProps = useEditController(props);
  // const [newOrganization, setNewOrganization] = useState();
  //
  // let organization = null;
  // if ( controllerProps?.record && controllerProps.record['pair:offeredBy'] ) {
  //   organization = controllerProps.record['pair:offeredBy'];
  // }
  // if ( newOrganization && organization !== newOrganization ) {
  //   organization = newOrganization;
  // }

  const record = controllerProps.record
  // console.log('record',record);
  const lock = record?.['aurba:externalSource']!=undefined;
  const deleteable = !lock || record?.['aurba:externalDeleted']!=undefined;

  return (
  <Edit title={<Title />} {...props} >
    <TabbedForm>
      <FormTab label="Principal">
        <TextInput source="pair:label" fullWidth validate={[required()]} />
        <ReferenceInput
          source="pair:about"
          reference="Job"
          validate={[required()]}
          fullWidth
        >
            <AutocompleteInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceInput>
        <DateTimeInput source="pair:startDate" />
        <DateTimeInput source="pair:endDate" />
      </FormTab>

    </TabbedForm>
  </Edit>
  );
}

export default JobEdit;
