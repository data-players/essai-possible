import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import StatusTitle from './StatusTitle';
import Edit from "../../../layout/edit/Edit";
import { ColorInput } from 'react-admin-color-input';

export const ThemeEdit = props => (
  <Edit title={<StatusTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" fullWidth />
      <TextInput label="Icone du thème" source="ep:icon" fullWidth/>
      <a href='https://mui.com/material-ui/material-icons/' style={{fontSize: "12px", paddingLeft: "15px"}}>Liste des icones disponibles ici, copiez son nom dans le champ</a>
      <TextInput label="Couleur du thème" source="ep:color" />
      <a href='https://mui.com/joy-ui/customization/theme-colors/' style={{fontSize: "12px", paddingLeft: "15px"}}>Liste des couleurs disponibles ici, copiez son nom dans le champ; (primary, neutral, danger, info, success, and warning) </a>
    </SimpleForm>
  </Edit>
);

export default ThemeEdit;
