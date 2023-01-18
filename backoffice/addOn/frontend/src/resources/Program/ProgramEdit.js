import React, { useState } from 'react';

import { TextInput } from "ra-ui-materialui";
import {
  ArrayInput,
  BooleanInput,
  DateInput,
  FormTab,
  NumberInput,
  SelectArrayInput,
  SelectInput,
  SimpleFormIterator,
  TabbedForm,
  AutocompleteInput,
  required,
  useEditController
} from 'react-admin';

import { MarkdownInput } from '@semapps/markdown-components'
import Title from '../commons/Title';
import Edit from "../../layout/edit/Edit";
import { ReferenceArrayInput,ReferenceInput } from "@semapps/input-components";
import { QuickAppendReferenceArrayField } from '@semapps/field-components';

export const ProgramEdit = props => {
  const controllerProps = useEditController(props);
  const [newOrganization, setNewOrganization] = useState();


  const validateMultiple = (value, allValues) => {
    const errors = {};
    // console.log(value, allValues);
    // console.log('1',allValues['opal:hasJobSearchGoals']);
    // console.log('2',allValues['opal:hasBusinessCreationGoals']);
    // console.log('3',allValues['opal:hasTrainingGoals']);
    // console.log('4',allValues['opal:hasFindingHelpGoals']);
    const hasJobSearchGoals=allValues['opal:hasJobSearchGoals']==undefined || allValues['opal:hasJobSearchGoals'].length==0;
    const hasBusinessCreationGoals=allValues['opal:hasBusinessCreationGoals']==undefined || allValues['opal:hasBusinessCreationGoals'].length==0;
    const hasTrainingGoals=allValues['opal:hasTrainingGoals']==undefined || allValues['opal:hasTrainingGoals'].length==0;
    const hasFindingHelpGoals=allValues['opal:hasFindingHelpGoals']==undefined || allValues['opal:hasFindingHelpGoals'].length==0;


    if ( hasJobSearchGoals && hasBusinessCreationGoals && hasTrainingGoals && hasFindingHelpGoals){
      // console.error('un des 4 champs doit être rempli');
      // // errors= {
      // //   'opal:hasJobSearchGoals':'oneOfFor',
      // //   'opal:hasBusinessCreationGoals':'oneOfFori',
      // //   'opal:hasTrainingGoals':'oneOfFor',
      // //   'opal:hasFindingHelpGoals':'oneOfFor'
      // // }
      return 'un des 4 champs doit être rempli';
    }
    else{
      return undefined
    }
    // if (!values.firstName) {
    //     errors.firstName = 'The firstName is required';
    // }
    // if (!values.age) {
    //     // You can return translation keys
    //     errors.age = 'ra.validation.required';
    // } else if (values.age < 18) {
    //     // Or an object if the translation messages need parameters
    //     errors.age = {
    //         message: 'ra.validation.minValue',
    //         args: { min: 18 }
    //     };
    // }
    // console.log(errors);
    // return errors
  };

  let organization = null;
  if ( controllerProps?.record && controllerProps.record['pair:offeredBy'] ) {
    organization = controllerProps.record['pair:offeredBy'];
  }
  if ( newOrganization && organization !== newOrganization ) {
    organization = newOrganization;
  }

  const record = controllerProps.record
  // console.log('record',record);
  const lock = record?.['aurba:externalSource']!=undefined;
  const deleteable = !lock || record?.['aurba:externalDeleted']!=undefined;

  return (
  <Edit title={<Title />} {...props} >
    <TabbedForm>
      <FormTab label="Principal">
        <TextInput source="pair:label" fullWidth validate={[required()]} />
        <ReferenceInput
          source="pair:offeredBy"
          reference="Organization"
          validate={[required()]}
          fullWidth
          onChange={value => {
            setNewOrganization(value)
          }}
        >
            <AutocompleteInput optionText="pair:label" shouldRenderSuggestions={value => {
              return value && value.length > 1
            }}/>
        </ReferenceInput>
        <MarkdownInput source="pair:description" multiline fullWidth readOnly={lock}/>
        <NumberInput source="opal:minimumAge" fullWidth disabled={lock}/>
        <NumberInput source="opal:maximumAge" fullWidth disabled={lock}/>
        <ReferenceArrayInput
          source="opal:hasDegreeLevel"
          reference="DegreeLevel"
          fullWidth
          helperText="Sélectionner tous les éléments éligibles au programme"
          disabled={lock}
        >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="opal:hasGenders"
          reference="Gender"
          fullWidth
          helperText="Sélectionner tous les éléments éligibles au programme"
          disabled={lock}
        >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <BooleanInput source="opal:rqth" defaultValue={false} fullWidth disabled={lock} />
        <BooleanInput source="opal:poleEmploi" defaultValue={false} fullWidth disabled={lock} />
        <TextInput source="opal:otherInfos" fullWidth disabled={lock} />
        <TextInput source="opal:duration" fullWidth disabled={lock} />
        <ArrayInput source="opal:startingDates" disabled={lock} >
          <SimpleFormIterator>
            <DateInput label="Dates de démarrage"/>
          </SimpleFormIterator>
        </ArrayInput>
        <NumberInput source="opal:numberOfParticipants" fullWidth disabled={lock} />
        <BooleanInput source="opal:financialParticipation" defaultValue={false} fullWidth disabled={lock} />
        <TextInput type="url" source="opal:registerLink" fullWidth disabled={lock} />
        <ReferenceArrayInput source="opal:hasTrainingMode" reference="TrainingMode" fullWidth validate={[required()]} disabled={lock}>
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        { organization &&
          <ReferenceInput
            source="opal:hasContactPerson"
            reference="ContactPerson"
            fullWidth
            filter={{"pair:affiliates":organization}}
            disabled={lock}
          >
            <SelectInput optionText={record => record["pair:firstName"] + ' ' + record["pair:lastName"]} allowEmpty resettable />
          </ReferenceInput>
        }
        { organization &&
          <ReferenceInput
            source="pair:offers"
            reference="TrainingSite"
            fullWidth
            filter={{"pair:offeredBy":organization}}
            disabled={lock}
          >
            <SelectInput optionText="pair:label" allowEmpty resettable />
          </ReferenceInput>
        }
        <ReferenceInput reference="DataSource" fullWidth source="aurba:hasDataSource" allowEmpty disabled={lock}>
          <SelectInput optionText="pair:label" disabled={lock}/>
        </ReferenceInput>
        {lock &&
          <BooleanInput source="aurba:externalDeleted" disabled={true} />
        }
      </FormTab>
      <FormTab label="Objectifs">
        <ReferenceArrayInput source="opal:hasJobSearchGoals" reference="JobSearchGoal" fullWidth validate={validateMultiple} disabled={lock} >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="opal:hasBusinessCreationGoals" reference="BusinessCreationGoal" fullWidth validate={validateMultiple} disabled={lock} >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="opal:hasTrainingGoals" reference="TrainingGoal" fullWidth validate={validateMultiple} disabled={lock} >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="opal:hasFindingHelpGoals" reference="FindingHelpGoal" fullWidth validate={validateMultiple}disabled={lock} >
          <SelectArrayInput optionText="pair:label" />
        </ReferenceArrayInput>
        <BooleanInput source="opal:noIdea" defaultValue={false} fullWidth validate={[required()]} disabled={lock}/>
      </FormTab>
    </TabbedForm>
  </Edit>
  );
}

export default ProgramEdit;
