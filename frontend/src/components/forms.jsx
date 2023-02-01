import Input from "@mui/joy/Input";
import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import {useSnackbar} from "./snackbar.jsx";
import {useFormik} from "formik";
import {getDeepValue} from "../app/utils.js";
import Stack from "@mui/joy/Stack";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import {ParagraphWithTitle} from "./atoms.jsx";

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

export function FormStep({
  stepNumber,
  setCurrentFormStep,
  currentFormStep,
  children,
  title,
  subtitle,
  showTitle = false,
  showContent = false,
  noDivider = false,
}) {
  showTitle = !!(currentFormStep >= stepNumber || showTitle);
  showContent = currentFormStep === stepNumber || showContent;
  const onClickProps = showTitle &&
    !showContent && {
      onClick: () => setCurrentFormStep(stepNumber),
      sx: {cursor: "pointer"},
    };
  return (
    <Stack {...onClickProps}>
      <Collapse in={showTitle} sx={{mb: 1}}>
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
        {(noDivider || showContent) && <Divider sx={{mt: 5, mb: 2}} />}
      </Collapse>
      {!noDivider && <Divider sx={{mt: 5, mb: 2}} />}
    </Stack>
  );
}

const MemoizedFormInput = React.memo(
  ({
    component: InputComponent = Input,
    wrapperComponent: WrapperComponent = FormControl,
    label,
    placeholder,
    help,
    registration,
    ...props
  }) => {
    return (
      <WrapperComponent>
        <FormLabel>{label}</FormLabel>
        <InputComponent placeholder={placeholder} {...registration} {...props} />
        <FormHelperText sx={registration?.errors && {color: "red", fontWeight: "lg"}}>
          {registration?.errors || help}
        </FormHelperText>
      </WrapperComponent>
    );
  },
  (pp, np) =>
    JSON.stringify([pp.registration?.value, pp.registration.errors]) ===
    JSON.stringify([np.registration?.value, np.registration.errors])
);

export const FormInput = ({
  name,
  component,
  wrapperComponent,
  label,
  placeholder,
  help,
  register,
  ...props
}) => {
  const registration = register?.(name) || {value: props.value, errors: props.errors};
  return (
    <MemoizedFormInput
      {...{
        component,
        wrapperComponent,
        label,
        placeholder,
        help,
        registration,
        ...props,
      }}
    />
  );
};
