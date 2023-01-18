import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import ProgramIcon from '@material-ui/icons/AccountTree';
import { Avatar } from "@material-ui/core";
import ProgramFilterSidebar from './ProgramFilterSidebar';
import {ReferenceField} from '@semapps/field-components';
import { Datagrid,
  TextField,
  ShowButton,
  EditButton } from 'react-admin';

const ProgramList = props => (
  <List {...props} aside={<ProgramFilterSidebar/>}>
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

export default ProgramList;
