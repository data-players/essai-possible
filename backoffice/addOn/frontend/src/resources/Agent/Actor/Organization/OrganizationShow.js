import React from 'react';
import { TextField, SimpleList, ArrayField } from 'react-admin';
import { Box, Grid, Avatar } from '@material-ui/core';
import { MapField } from '@semapps/geo-components';
import { GroupedReferenceHandler } from '@semapps/semantic-data-provider';
import { ReferenceArrayField, ReferenceField, QuickAppendReferenceArrayField, MultiUrlField, AvatarWithLabelField, SeparatedListField } from '@semapps/field-components';
import { ChipList, GridList } from '@semapps/list-components';
import DescriptionIcon from '@material-ui/icons/Description';
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import OrganizationTitle from './OrganizationTitle';
import { MarkdownField } from '../../../../common/field';
import { Hero, MainList, SideList } from '../../../../common/list';
import RightLabel from "../../../../common/list/SideList/RightLabel";
import Show from "../../../../layout/show/Show";

const OrganizationShow = props => (
  <Show title={<OrganizationTitle />} {...props}>
    <Grid container spacing={5}>
      <Grid item xs={12} sm={9}>
        <Hero image="image">
          <TextField source="pair:comment" />
          <TextField source="pair:homePage" />
          <TextField source="ep:siret" />
        </Hero>
        <MainList>
          <MarkdownField source="pair:description" />
        </MainList>
      </Grid>
      <Grid item xs={12} sm={3}>
        <SideList>

            <ReferenceArrayField reference="Person" source="pair:affiliates">
              <GridList xs={6} linkType="show" externalLinks>
                <AvatarWithLabelField label="pair:label" image="image">
                  <HomeIcon />
                </AvatarWithLabelField>
              </GridList>
            </ReferenceArrayField>


          <QuickAppendReferenceArrayField reference="Theme" source="pair:hasTopic">
            <ChipList primaryText="pair:label" linkType="show" externalLinks />
          </QuickAppendReferenceArrayField>
        </SideList>
      </Grid>
    </Grid>
  </Show>
);

export default OrganizationShow;
