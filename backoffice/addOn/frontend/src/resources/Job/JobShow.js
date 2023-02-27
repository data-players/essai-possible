import React from 'react';
import Edit from "../../layout/edit/Edit";
import {ReferenceField, ReferenceArrayField,SeparatedListField} from '@semapps/field-components';
import JobTitle from "./JobTitle";
import { MarkdownField } from '@semapps/markdown-components';
import Show from "../../layout/show/Show";
import { MainList } from '../../common/list';
import { ChipList } from '@semapps/list-components';
import {
  TextField,
} from 'react-admin';
import { MapField } from '@semapps/geo-components';

const DataSourceShow = props => (
  <Show title={<JobTitle />} {...props}>
    <MainList>
      <TextField source="pair:label" />
      <TextField source="pair:description" />
      <ReferenceField reference="DataSource" source="aurba:hasDataSource" link="show">
        <TextField source="pair:label" />
      </ReferenceField>
      <ReferenceField reference="Organization" source="pair:offeredBy" link="show">
        <TextField source="pair:label" />
      </ReferenceField>
      <ReferenceArrayField reference="Theme" source="pair:hasTopic">
        <ChipList primaryText="pair:label" linkType="show" />
      </ReferenceArrayField>
      <ReferenceArrayField reference="Status" source="pair:hasStatus">
        <SeparatedListField linkType={false}>
          <TextField source="pair:label" />
        </SeparatedListField>
      </ReferenceArrayField>
      <ReferenceArrayField reference="Skill" source="pair:hasSkill">
        <SeparatedListField linkType={false}>
          <TextField source="pair:label" />
        </SeparatedListField>
      </ReferenceArrayField>
      <ReferenceArrayField reference="Goal" source="pair:hasChallenge">
        <SeparatedListField linkType={false}>
          <TextField source="pair:label" />
        </SeparatedListField>
      </ReferenceArrayField>
      <MapField
        source="pair:hasLocation"
        address={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:label']}
        latitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:latitude']}
        longitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:longitude']}
      />

    </MainList>
  </Show>
);

export default DataSourceShow;
