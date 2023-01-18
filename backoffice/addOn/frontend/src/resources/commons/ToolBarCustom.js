import React from 'react';
import {Toolbar, SaveButton, DeleteButton} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});



const UserEditToolbar = ({deleteable,...props}) => (
    <Toolbar {...props} classes={useStyles()} >
        <SaveButton />
        {deleteable &&
          <DeleteButton />
        }

    </Toolbar>
);

export default UserEditToolbar;
