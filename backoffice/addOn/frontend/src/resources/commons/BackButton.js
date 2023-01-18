import React from 'react';
import { makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RawBackButton from '../../components/BackButton';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    padding: 4
  },
  icon: {
    width: 20
  },
  buttonLabel: {
    paddingLeft: 6
  }
}));

const BackButton = () => {
  const classes = useStyles();
  return (
    <RawBackButton className={classes.button} >
      <ArrowBackIcon className={classes.icon} />
      <span className={classes.buttonLabel}>Retour</span>
    </RawBackButton>
  );
};

export default BackButton