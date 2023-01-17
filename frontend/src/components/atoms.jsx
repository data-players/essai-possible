import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import Checkbox from "@mui/joy/Checkbox";
import CheckIcon from "@mui/icons-material/Check.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight.js";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft.js";
import {Link as ReactRouterLink} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import MuiBreadcrumbs from "@mui/joy/Breadcrumbs";
import Container from "@mui/joy/Container";
import "./spinner.css";
import React from "react";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded.js";
import {useSnackbar} from "./snackbar.jsx";

export function BasicList({elements, component = "ul"}) {
  return (
    <Box component={component} sx={{mt: 1, ml: -1}}>
      {elements?.map((el) => (
        <Box component={"li"} key={el}>
          {el}
        </Box>
      ))}
    </Box>
  );
}

export const RadioChips = ({options, name, value, setFieldValue, ...props}) => {
  // https://mui.com/joy-ui/react-chip/#with-a-checkbox
  return (
    <Stack direction="row" columnGap={2} rowGap={2} flexWrap="wrap">
      {options.map(({key, label, title, icon: Icon}) => {
        const checked = value === key;
        return (
          <Chip
            key={key}
            title={title}
            variant={checked ? "solid" : "soft"}
            color={checked ? "primary" : "neutral"}
            startDecorator={
              (Icon || checked) && (
                <>
                  {checked && <CheckIcon sx={{mr: 1}} />}
                  {Icon && <Icon />}
                </>
              )
            }
            {...props}>
            <Checkbox
              variant={checked ? "solid" : "soft"}
              disableIcon
              overlay
              label={label}
              checked={checked}
              onChange={(event) => setFieldValue(event.target.checked ? key : undefined)}
            />
          </Chip>
        );
      })}
    </Stack>
  );
};

export function Breadcrumbs({breadcrumbs}) {
  return (
    <Container>
      <MuiBreadcrumbs
        sx={{my: 1, display: {xs: "none", sm: "flex"}}}
        separator={<ChevronRightIcon color={"primary"} />}
        aria-label="breadcrumbs">
        <Chip
          component={ReactRouterLink}
          startDecorator={<ChevronLeftIcon />}
          variant={"soft"}
          to={breadcrumbs[0].to}>
          {breadcrumbs[0].label}
        </Chip>
        {breadcrumbs
          .slice(1)
          .filter((el) => !!el)
          .map(({label, to, onClick}, index) => (
            <Typography
              key={index}
              component={ReactRouterLink}
              to={to}
              onClick={onClick}
              sx={{
                textDecoration: "none",
                whiteSpace: "nowrap",
                maxWidth: 300,
                color: index > 0 && "text.tertiary",
                cursor: onClick && "pointer",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {label}
            </Typography>
          ))}
      </MuiBreadcrumbs>
    </Container>
  );
}

export function LoadingSpinner(props) {
  return (
    <Stack justifyContent={"center"} alignItems={"center"} minHeight={300} {...props}>
      <div className="lds-dual-ring" />
    </Stack>
  );
}

export function SearchBar({sx, ...props}) {
  const {t} = useTranslation();
  return (
    <Input
      variant={"soft"}
      color={"neutral"}
      placeholder={t("offer.searchAnOffer")}
      startDecorator={<SearchRoundedIcon color="primary" />}
      {...props}
      sx={[{display: "flex"}, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

export function Form({onSubmit, initialValues, children, successText}) {
  // https://formik.org/docs/examples/with-material-ui

  const [openSnackbar] = useSnackbar();
  const {
    handleSubmit,
    handleChange: onChange,
    values,
  } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        successText && openSnackbar(successText, {color: "success"});
      } catch (err) {
        console.error(err);
        openSnackbar(`Oh oh... Il y a eu une erreur: ${err.message}`);
      }
    },
  });

  // A function to register easily fields by putting {...register("fieldName") inside field components
  function register(name) {
    return {
      name,
      value: values[name],
      onChange,
    };
  }

  return <form onSubmit={handleSubmit}>{children(register, values, onChange)}</form>;
}
