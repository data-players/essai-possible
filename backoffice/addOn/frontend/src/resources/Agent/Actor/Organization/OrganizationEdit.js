import React from 'react';
import {
  TextInput,
  ImageInput,
  AutocompleteInput,
  AutocompleteArrayInput,
  SelectInput,
  TabbedForm,
  FormTab
} from 'react-admin';
import { ImageField } from '@semapps/field-components';
import { ReferenceInput, ReferenceArrayInput } from '@semapps/input-components';
import { MarkdownInput } from '@semapps/markdown-components';
import { MultiLinesInput } from '@semapps/input-components';
import { OrganizationsInput, EventsInput, ThemesInput, DocumentsInput, LocationInput } from '../../../../common/input';
import OrganizationTitle from './OrganizationTitle';
import Edit from "../../../../layout/edit/Edit";

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:label" fullWidth />
        <TextInput source="pair:comment" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <ReferenceInput reference="Status" source="pair:hasStatus" filter={{ a: 'pair:AgentStatus' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <ReferenceInput reference="Type" source="pair:hasType" filter={{ a: 'pair:OrganizationType' }}>
          <SelectInput optionText="pair:label" />
        </ReferenceInput>
        <TextInput source="pair:homePage" fullWidth />
        <LocationInput source="pair:hasLocation" fullWidth />
        <ImageInput source="image" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
      </FormTab>

      <FormTab label="Membres">
          <ReferenceArrayInput reference="Person" source="pair:affiliates" fullWidth>
            <AutocompleteArrayInput optionText="pair:label"
            shouldRenderSuggestions={value => value && value.length > 1}
            />
          </ReferenceArrayInput>
          <ReferenceArrayInput reference="Person" source="pair:hasAskedAffilitation" fullWidth>
            <AutocompleteArrayInput optionText="pair:label"
            shouldRenderSuggestions={value => value && value.length > 1}
            />
          </ReferenceArrayInput>

      </FormTab>
      <FormTab label="Relations">
        <ThemesInput source="pair:hasTopic" />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default OrganizationEdit;
