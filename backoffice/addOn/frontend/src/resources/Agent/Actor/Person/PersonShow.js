import React from 'react';
import { TextField, ArrayField } from 'react-admin';
import { Box, Grid } from '@material-ui/core';
import { QuickAppendReferenceArrayField, AvatarWithLabelField, ReferenceField, ReferenceArrayField } from '@semapps/field-components';
import { ChipList, GridList } from '@semapps/list-components';
import { GroupedReferenceHandler } from '@semapps/semantic-data-provider';
import { MapField } from '@semapps/geo-components';
import PersonTitle from './PersonTitle';
import { Hero, MainList, SideList } from '../../../../common/list';
import RightLabel from "../../../../common/list/SideList/RightLabel";
import Show from "../../../../layout/show/Show";

const ConditionalSourceDefinedHandler = ({ record, source, children, ...otherProps }) => {
  if (record?.[source] && (!Array.isArray(record[source]) || record[source].length > 0)) {
    return React.Children.map(children, (child, i) => {
      return React.cloneElement(child, { ...otherProps, record, source });
    });
  } else {
    return <></>;
  }
};

const PersonShow = props => (
  <Show title={<PersonTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:firstName" />
          <TextField source="pair:lastName" />
          <TextField source="pair:email" />
          <TextField source="pair:phone" />
        </Hero>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>
          <ReferenceArrayField reference="Organization" source="pair:affilitedBy">
            <ChipList primaryText="pair:label" linkType="show" externalLinks />
          </ReferenceArrayField>
          <ReferenceArrayField reference="Organization" source="ep:askedAffiliation">
            <ChipList primaryText="pair:label" linkType="show" externalLinks />
          </ReferenceArrayField>
          <ReferenceArrayField reference="TimeSlot" source="pair:concernedBy">
            <ChipList primaryText="pair:label" linkType="show" externalLinks />
          </ReferenceArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default PersonShow;
