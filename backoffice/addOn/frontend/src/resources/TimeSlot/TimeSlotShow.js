import React from 'react';
import Edit from "../../layout/edit/Edit";
import {ReferenceField} from '@semapps/field-components';
import TimeSlotTitle from "./TimeSlotTitle";
import { MarkdownField } from '@semapps/markdown-components';
import Show from "../../layout/show/Show";
import { MainList } from '../../common/list';
import {
  TextField,
} from 'react-admin';

const DataSourceShow = props => (
  <Show title={<TimeSlotTitle />} {...props}>
    <MainList>
      <TextField source="pair:label" />
      <TextField source="pair:description" />
      <ReferenceField reference="Job" source="pair:about" link="show">
        <TextField source="pair:label" />
      </ReferenceField>
      <TextField source="pair:startDate" />
      <TextField source="pair:endDate" />
    </MainList>
  </Show>
);

export default DataSourceShow;
