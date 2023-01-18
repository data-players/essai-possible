import React from 'react';

import { Avatar } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import { MultiViewsList } from '@semapps/list-components';
import SimpleList from "../../common/list/SimpleList";
import List from "../../layout/list/List";
import { MapList } from '@semapps/geo-components';
import MapIcon from '@material-ui/icons/Map';
import {ReferenceField} from '@semapps/field-components';

import {
  Datagrid,
  TextField,
  EditButton
} from 'react-admin';


import OrganizationFilterSidebar from './OrganizationFilterSidebar';

const OrganizationList = props => {
  return <MultiViewsList
    ListComponent={List}
    aside={<OrganizationFilterSidebar />}
    views={{
      list: {
        label: 'Liste',
        icon: ListIcon,
        sort: { field: 'pair:label', order: 'DESC' },
        perPage: 25,
        list: (

          <Datagrid>
              <TextField source="pair:label" />
              <TextField source="pair:description" />
              <ReferenceField reference="DataSource" source="aurba:hasDataSource">
                <TextField source="pair:label" />
              </ReferenceField>
              <EditButton />
          </Datagrid>
        )
      },
      map: {
        label: 'Carte',
        icon: MapIcon,
        perPage: 500,
        pagination: false,
        list: (
          <MapList
            latitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:latitude']}
            longitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:longitude']}
            label={record => record['pair:label']}
            /*description={record => record['pair:comment']}*/
            scrollWheelZoom
          />
        )
      }
    }}
    {...props}
  />
};

export default OrganizationList;
