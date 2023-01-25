import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import TimeSlotIcon from '@material-ui/icons/AccountTree';
import { Avatar } from "@material-ui/core";
import {ReferenceField} from '@semapps/field-components';
import { Datagrid,
  TextField,
  ShowButton,
  EditButton } from 'react-admin';

const JobList = props => (
  <List {...props}>
    <Datagrid>
        <TextField source="pair:label" />
        <TextField source="pair:description" />
        <ReferenceField reference="Job" source="pair:about" link="show">
          <TextField source="pair:label" />
        </ReferenceField>
        <TextField source="pair:startDate" />
        <TextField source="pair:endDate" />
        <EditButton />
    </Datagrid>
  </List>
)

export default JobList;
