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
import React, {useCallback, useEffect, useState} from "react";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded.js";
import {useSnackbar} from "./snackbar.jsx";
import ListItem from "@mui/joy/ListItem";
import List from "@mui/joy/List";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import {PageContent} from "./Layout.jsx";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded.js";
import Autocomplete from "@mui/joy/Autocomplete";
import {useLazyFetchGeocodingSuggestionsQuery} from "../app/geocodingApi.js";
import debounce from "@mui/utils/debounce.js";
import Pagination from "@mui/material/Pagination";
import {getDeepValue, getUrlParam, setURLParam} from "../app/utils.js";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Radio from "@mui/joy/Radio";
import MuiRadioGroup from "@mui/joy/RadioGroup";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/joy/Divider";

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
      placeholder={t("offers.searchAnOffer")}
      startDecorator={<SearchRoundedIcon color="primary" />}
      {...props}
      sx={[{display: "flex"}, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

export function LocationSearchBar({sx, ...props}) {
  const [inputValue, setInputValue] = useState(props.value?.label);

  const [launchGeocodingSuggestionsFetchQuery, {data: geocodingSuggestions = []}] =
    useLazyFetchGeocodingSuggestionsQuery();

  const debouncedFetchSuggestions = useCallback(
    debounce(launchGeocodingSuggestionsFetchQuery, 300),
    [launchGeocodingSuggestionsFetchQuery]
  );
  useEffect(() => {
    inputValue?.length > 1 && debouncedFetchSuggestions(inputValue);
  }, [inputValue]);

  return (
    <Autocomplete
      variant={"soft"}
      color={"neutral"}
      defaultValue={props.value}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      filterOptions={(options) => options} // Do not filter automatically the options
      isOptionEqualToValue={(option, value) =>
        option.label === value.label && option.context === option.context
      }
      getOptionLabel={(option) => `${option.label} (${option.context})`}
      options={geocodingSuggestions}
      placeholder={"Adresse, ville, région..."}
      startDecorator={<PlaceRoundedIcon color="primary" />}
      {...props}
      sx={[{display: "flex"}, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

export function FormInput({
  name,
  component: InputComponent = Input,
  wrapperComponent: WrapperComponent = FormControl,
  label,
  placeholder,
  help,
  register,
  ...props
}) {
  const registration = register?.(name);
  return (
    <WrapperComponent>
      <FormLabel>{label}</FormLabel>
      <InputComponent placeholder={placeholder} {...registration} {...props} />
      <FormHelperText sx={registration?.errors && {color: "red", fontWeight: "lg"}}>
        {registration?.errors || help}
      </FormHelperText>
    </WrapperComponent>
  );
}

export function Form({onSubmit, initialValues, children, successText, validationSchema}) {
  const [openSnackbar] = useSnackbar();

  // https://formik.org/docs/examples/with-material-ui
  const {
    handleSubmit,
    handleChange: onChange,
    setFieldValue,
    values,
    errors,
    dirty,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
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
    const splitName = name.split(".");

    const error = getDeepValue(touched, splitName) && getDeepValue(errors, splitName);
    return {
      name,
      value: getDeepValue(values, splitName),
      onChange,
      errors: error,
      color: error && "danger",
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      {children(register, {values, setFieldValue, onChange, errors, dirty})}
    </form>
  );
}

export const CheckboxGroup = React.memo(
  function ({options, value, onChange, color}) {
    console.log("col", color);
    const [val, setVal] = useState(value);
    return (
      <Card variant={"soft"} color={color} size={"sm"} sx={{my: 1}}>
        <List size="sm">
          {options.map((option, index) => {
            const checked = val.includes(option);
            return (
              <ListItem key={index}>
                <Checkbox
                  label={option}
                  checked={checked}
                  onChange={(event) => {
                    const newVal = event.target.checked
                      ? [...val, option]
                      : val.filter((checkedOption) => option !== checkedOption);
                    setVal(newVal);
                    onChange(newVal);
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Card>
    );
  },
  (pp, np) => pp.color === np.color
);

export function RadioGroup({options, color, ...props}) {
  return (
    <Card variant={"soft"} color={color} size={"sm"} sx={{mt: 1, p: 2}}>
      <MuiRadioGroup {...props}>
        {options.map((option) => (
          <Radio value={option} key={option} label={option} />
        ))}
      </MuiRadioGroup>
    </Card>
  );
}

export function ButtonWithConfirmation({
  children,
  color,
  cardColor = color,
  loading,
  areYouSureText,
  onClick,
  ...props
}) {
  const [areYouSure, setAreYouSure] = useState(false);

  return !areYouSure ? (
    <Button color={color} variant={"soft"} onClick={() => setAreYouSure(true)} {...props}>
      {children}
    </Button>
  ) : (
    <Card color={cardColor} variant={"solid"} invertedColors>
      <Stack gap={2}>
        <Typography>{areYouSureText}</Typography>
        <Button loading={loading} onClick={onClick} {...props}>
          {children}
        </Button>
        <Button variant={"soft"} size={"sm"} onClick={() => setAreYouSure(false)} {...props}>
          Annuler
        </Button>
      </Stack>
    </Card>
  );
}

export function ListPageContent({
  ready,
  noResultsContent,
  values,
  item: Item,
  getKey,
  itemsPerPage = 10,
}) {
  // Pagination
  const rawUrlSearchParams = new URLSearchParams(window.location.search);
  const [page, setPage] = useState(getUrlParam("page", rawUrlSearchParams, "number", 1));
  const numberOfPages = Math.ceil(values.length / itemsPerPage);
  const handlePageChange = (event, value) => {
    setPage(value);
    setURLParam("page", value, "number");
  };
  // If the pagination is too far away reset it back to 1
  useEffect(() => {
    values.length < itemsPerPage * (page - 1) && handlePageChange(undefined, 1);
  }, [values.length, page, itemsPerPage]);

  return (
    <PageContent mt={4} alignItems={"center"}>
      {ready ? (
        values.length > 0 ? (
          <>
            <Typography sx={{color: "text.tertiary", opacity: 0.7}} mb={1}>
              Résultats {itemsPerPage * (page - 1) + 1} à{" "}
              {Math.min(itemsPerPage * page, values.length)} sur {values.length}{" "}
            </Typography>

            <List sx={{alignSelf: "stretch"}}>
              {values.slice(itemsPerPage * (page - 1), itemsPerPage * page).map((value, index) => (
                <Item value={value} key={getKey ? getKey(value) : value} />
              ))}
            </List>

            {values.length > itemsPerPage && (
              <Pagination
                count={numberOfPages}
                page={page}
                onChange={handlePageChange}
                sx={{mt: 2}}
              />
            )}
          </>
        ) : (
          <Box mt={2}>{noResultsContent}</Box>
        )
      ) : (
        <Stack justifyContent={"center"} alignItems={"center"} minHeight={300}>
          <LoadingSpinner />
        </Stack>
      )}
    </PageContent>
  );
}

export function ParagraphWithTitle({title, children}) {
  return (
    <Stack gap={2}>
      <Typography level="h3" color="primary" fontWeight={"lg"}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export const FormStep = ({
  stepNumber,
  setCurrentFormStep,
  currentFormStep,
  children,
  title,
  subtitle,
  showTitle = false,
  showContent = false,
}) => {
  showTitle = !!(currentFormStep >= stepNumber || showTitle);
  showContent = currentFormStep === stepNumber || showContent;
  const onClickProps = showTitle &&
    !showContent && {
      onClick: () => setCurrentFormStep(stepNumber),
      sx: {cursor: "pointer"},
    };
  return (
    <Stack {...onClickProps}>
      <Collapse in={showTitle}>
        <ParagraphWithTitle title={stepNumber ? `${stepNumber}. ${title}` : title}>
          {subtitle}
        </ParagraphWithTitle>
      </Collapse>
      <Collapse in={showContent}>
        <Box mt={2}>{children}</Box>
      </Collapse>
      <Collapse in={showTitle && !showContent}>
        <Button sx={{mt: 2}} variant="soft" size={"sm"} color="neutral">
          Modifier
        </Button>
        <Divider sx={{mt: 2}} />
      </Collapse>
    </Stack>
  );
};

export function StatusChip({status, options}) {
  return (
    <Chip color={options[status].color} startDecorator={options[status].icon}>
      {options[status].label}
    </Chip>
  );
}
