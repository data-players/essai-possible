import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import Create from "../../layout/create/Create";

const ConceptCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
    </SimpleForm>
  </Create>
);

export default ConceptCreate;
