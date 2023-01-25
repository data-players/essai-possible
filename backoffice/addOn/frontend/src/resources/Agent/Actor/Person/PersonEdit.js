import React from 'react';
import { ImageInput, TabbedForm, TextInput, FormTab,  required, AutocompleteInput,AutocompleteArrayInput } from 'react-admin';
import { ImageField } from '@semapps/field-components';
import { ActivitiesInput, LocationInput, SkillsInput, ThemesInput } from '../../../../common/input';
import PersonTitle from './PersonTitle';
import Edit from "../../../../layout/edit/Edit";
import { ReferenceArrayInput,ReferenceInput } from "@semapps/input-components";

export const PersonEdit = props => (
  <Edit
    title={<PersonTitle />}
    transform={data => ({ ...data, 'pair:label': `${data['pair:firstName']} ${data['pair:lastName']?.toUpperCase()}` })}
    {...props}
  >
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:firstName" fullWidth />
        <TextInput source="pair:lastName" fullWidth />
        <TextInput source="pair:email" fullWidth />
      </FormTab>
      <FormTab label="Relations">

        <ReferenceArrayInput
          source="pair:affilitedBy"
          reference="Organization"
          fullWidth
        >
            <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceArrayInput>

        <ReferenceArrayInput
          source="ep:askedAffiliation"
          reference="Organization"
          fullWidth
        >
            <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceArrayInput>

        <ReferenceArrayInput
          source="pair:concernesBy"
          reference="TimeSlot"
          fullWidth
        >
            <AutocompleteArrayInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceArrayInput>


      </FormTab>
    </TabbedForm>
  </Edit>
);

export default PersonEdit;
