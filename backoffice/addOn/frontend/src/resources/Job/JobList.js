import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import JobIcon from '@material-ui/icons/AccountTree';
import { Avatar } from "@material-ui/core";
import JobFilterSidebar from './JobFilterSidebar';
import {ReferenceField} from '@semapps/field-components';
import { Datagrid,
  TextField,
  ShowButton,
  EditButton } from 'react-admin';

const JobList = props => (
  <List {...props} aside={<JobFilterSidebar/>}>
    <Datagrid>
        <TextField source="pair:label" />
        <TextField source="pair:description" />
        <ReferenceField reference="DataSource" source="aurba:hasDataSource" link="show">
          <TextField source="pair:label" />
        </ReferenceField>
        <EditButton />
    </Datagrid>
  </List>
)

export default JobList;
