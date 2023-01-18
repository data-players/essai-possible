import React from 'react';
import List from "../../layout/list/List";
import SimpleList from "../../common/list/SimpleList";
import StyleIcon from '@material-ui/icons/Style';

const ConceptList = props => (
  <List {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      leftAvatar={() => <StyleIcon />}
    />
  </List>
);

export default ConceptList;
