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
  AutocompleteArrayInput,
  required,
  useEditController
} from 'react-admin';

import { MarkdownInput } from '@semapps/markdown-components'
import Title from '../commons/Title';
import Edit from "../../layout/edit/Edit";
import { ReferenceArrayInput,ReferenceInput } from "@semapps/input-components";
import { QuickAppendReferenceArrayField } from '@semapps/field-components';
import { ThemesInput,LocationInput } from '../../common/input';

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
          source="pair:offeredBy"
          reference="Organization"
          validate={[required()]}
          fullWidth
        >
            <AutocompleteInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceInput>
        <MarkdownInput source="pair:description" multiline fullWidth/>
        <ReferenceInput reference="Status" source="pair:hasStatus">
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <ThemesInput source="pair:hasTopic" />
        <LocationInput source="pair:hasLocation" fullWidth />
        <ReferenceInput reference="DataSource" fullWidth source="aurba:hasDataSource" allowEmpty>
          <SelectInput optionText="pair:label"/>
        </ReferenceInput>
        <ReferenceInput reference="Goal" fullWidth source="pair:hasChallenge" allowEmpty>
          <SelectInput optionText="pair:label"/>
        </ReferenceInput>
        {lock &&
          <BooleanInput source="aurba:externalDeleted" disabled={true} />
        }
      </FormTab>
      <FormTab label="Relations">
            <ReferenceArrayInput reference="Skill" source='pair:hasSkill'>
              <AutocompleteArrayInput optionText="pair:label"
              shouldRenderSuggestions={value => value.length > 1} fullWidth />
            </ReferenceArrayInput>
            <ReferenceArrayInput reference="Goal" source="pair:hasChallenge" fullWidth>
              <AutocompleteArrayInput optionText="pair:label"
              shouldRenderSuggestions={value => value && value.length > 1}
              />
          </ReferenceArrayInput>
        </FormTab>
    </TabbedForm>
  </Edit>
  );
}

export default JobEdit;
