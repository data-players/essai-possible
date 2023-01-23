import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import TimeSlotIcon from '@material-ui/icons/AccountTree';
import { Avatar } from "@material-ui/core";
import TimeSlotFilterSidebar from './TimeSlotFilterSidebar';
import {ReferenceField} from '@semapps/field-components';
import { Datagrid,
  TextField,
  ShowButton,
  EditButton } from 'react-admin';

const JobList = props => (
  <List {...props} aside={<TimeSlotFilterSidebar/>}>
    <Datagrid>
        <TextField source="pair:label" />
        <TextField source="pair:description" />
        <ReferenceField reference="DataSource" source="aurba:hasDataSource">
          <TextField source="pair:label" />
        </ReferenceField>
        <EditButton />
    </Datagrid>
  </List>
)

export default JobList;
