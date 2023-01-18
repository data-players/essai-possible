import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import PersonIcon from '@material-ui/icons/Person';
import { Avatar } from "@material-ui/core";

const PersonList = props => (
  <List {...props} sort={{ field: 'pair:label', order: 'ASC' }}>
    <SimpleList
      primaryText={record => record['pair:label']}
      /*secondaryText={record => record['pair:label']}*/
      leftAvatar={record => (
        <Avatar src={record['image']} width="100%">
          <PersonIcon />
        </Avatar>
      )}
      linkType="edit"
    />
  </List>
)

export default PersonList;
