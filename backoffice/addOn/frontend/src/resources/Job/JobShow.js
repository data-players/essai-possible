import React from 'react';
import Edit from "../../layout/edit/Edit";
import {ReferenceField} from '@semapps/field-components';
import JobTitle from "./JobTitle";
import { MarkdownField } from '@semapps/markdown-components';
import Show from "../../layout/show/Show";
import { MainList } from '../../common/list';
import {
  TextField,
} from 'react-admin';

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
    </MainList>
  </Show>
);

export default DataSourceShow;
