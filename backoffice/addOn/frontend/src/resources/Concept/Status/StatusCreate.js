import React from 'react';
import { SimpleForm, TextInput, SelectArrayInput } from 'react-admin';
import Create from "../../../layout/create/Create";

const StatusCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <SelectArrayInput
        source="@type"
        choices={[
          { id: 'ep:JobStatus', name: 'JobStatus' }
        ]}
      />
    </SimpleForm>
  </Create>
);

export default StatusCreate;
