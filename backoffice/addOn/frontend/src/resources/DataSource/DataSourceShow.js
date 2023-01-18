import React from 'react';
import Edit from "../../layout/edit/Edit";
import { ReferenceField } from "@semapps/semantic-data-provider";
import DataSourceTitle from "./DataSourceTitle";
import { MarkdownField } from '@semapps/markdown-components';
import Show from "../../layout/show/Show";
import { MainList } from '../../common/list';
import {
  TextField,
} from 'react-admin';

const DataSourceShow = props => (
  <Show title={<DataSourceTitle />} {...props}>
    <MainList>
        <TextField source="pair:label"></TextField>
        <MarkdownField source="pair:description" />
    </MainList>
  </Show>
);

export default DataSourceShow;
