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

export function BasicList({elements, component = "ul"}) {
  return (
    <Box component={component} sx={{mt: 1, ml: -1}}>
      {elements.map((el) => (
        <Box component={"li"}>{el}</Box>
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
        separator={<ChevronRightIcon sx={{color: "text.secondary"}} />}
        aria-label="breadcrumbs">
        <Chip
          startDecorator={<ChevronLeftIcon />}
          variant={"soft"}
          component={ReactRouterLink}
          to={breadcrumbs[0].to}>
          {breadcrumbs[0].label}
        </Chip>
        {breadcrumbs
          .slice(1)
          .filter((el) => !!el)
          .map(({label, to, onClick}) => (
            <Typography
              component={ReactRouterLink}
              to={to}
              onClick={onClick}
              sx={{textDecoration: "none", cursor: onClick && "pointer"}}>
              {label}
            </Typography>
          ))}
      </MuiBreadcrumbs>
    </Container>
  );
}
