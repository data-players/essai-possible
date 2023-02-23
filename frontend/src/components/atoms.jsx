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
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded.js";
import ListItem from "@mui/joy/ListItem";
import List from "@mui/joy/List";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import {HeroBanner, PageContent} from "./Layout.jsx";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded.js";
import Autocomplete from "@mui/joy/Autocomplete";
import {useLazyFetchGeocodingSuggestionsQuery} from "../app/geocodingApi.js";
import debounce from "@mui/utils/debounce.js";
import Pagination from "@mui/material/Pagination";
import {getUrlParam, groupBy, setURLParam, sorter} from "../app/utils.js";
import Radio from "@mui/joy/Radio";
import MuiRadioGroup from "@mui/joy/RadioGroup";
import Link from "@mui/joy/Link";
import FileOpenRoundedIcon from "@mui/icons-material/FileOpenRounded.js";
import Grid from "@mui/joy/Grid";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import ListSubheader from "@mui/joy/ListSubheader";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded.js";
import {useTranslationWithDates} from "../app/i18n.js";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded.js";
import {CircularProgress} from "@mui/joy";
import * as Muicon from '@mui/icons-material';

/**
 * INPUTS
 */

export const RadioChips = ({options, name, value, onChange, deletable, itemSx, ...props}) => {
  // https://mui.com/joy-ui/react-chip/#with-a-checkbox
  return (
    <Stack direction="row" columnGap={2} rowGap={2} flexWrap="wrap">
      {options.map(({key, label, title, icon: Icon}) => {
        const checked = value === key;
        // console.log('checked',value,key)
        // console.log('RadioChips',value,key, label, title,checked)
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
            endDecorator={
              deletable && (
                <DeleteOutlineRoundedIcon
                  color={"danger"}
                  sx={{ml: 1, opacity: 0.6, ":hover": {color: "red"}}}
                />
              )
            }
            sx={itemSx?.({key, label, title, checked})}
            {...props}>
            <Checkbox
              variant={checked ? "solid" : "soft"}
              disableIcon
              overlay
              label={label}
              checked={checked}
              onChange={(event) => {
                console.log("onChange", key, event.target.checked);
                onChange(key, event.target.checked);
              }}
            />
          </Chip>
        );
      })}
    </Stack>
  );
};

export function SlotsList({
  slots,
  selectedSlot,
  onChange,
  deletable = false,
  itemSx,
  itemKey = "id",
  ...props
}) {
  // console.log('slots',slots)
  console.log('selectedSlot',selectedSlot)
  const {tDate, tTime} = useTranslationWithDates();
  let slotsReadyToSort = [...slots];
  // console.log('slotsReadyToSort',slots)
  const slotsByDate = groupBy(
    slotsReadyToSort?.sort((a, b) => sorter.date(a.start, b.start)),
    (slot) => tDate(slot.start, "long")
  );
  const slotsByDateArray= Object.entries(slotsByDate);
  // console.log('slotsByDateArray',slotsByDateArray)

  return (
    <List>
      {slotsByDateArray.map(([date, slots],index) => (
        <React.Fragment key={date}>
          <ListSubheader sx={{fontSize: "md"}}>{date}</ListSubheader>
          <ListItem sx={{mb: 3}}>
            <RadioChips
              key={index}
              itemSx={itemSx}
              deletable={deletable}
              options={slots.map((slot,index) => ({
                label: tTime(slot.start),
                icon: CalendarMonthRoundedIcon,
                key: slot[itemKey],
              }))}
              value={selectedSlot}
              onChange={onChange}
              {...props}
            />
          </ListItem>
        </React.Fragment>
      ))}
    </List>
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

export const CheckboxGroup = React.memo(
  function ({options, value, onChange, color, ...props}) {
    const [val, setVal] = useState(value);
    return (
      <Card variant={"soft"} color={color} size={"sm"} sx={{my: 1, boxShadow: "none"}}>
        <List size="sm" {...props}>
          {options.map((option, index) => {
            const checked = val && val.includes(option);
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

export const CheckboxGroupSemantic = function ({options, value = [], onChange, color, ...props}) {
  // console.log('CheckboxGroupSemantic',options)
  const [val, setVal] = useState(value);
  return (
    <Card variant={"soft"} color={color} size={"sm"} sx={{my: 1, boxShadow: "none"}}>
      <List size="sm" {...props}>
        {options.map((option, index) => {
          // console.log('checked',val,option.id)
          const checked = val && val.includes(option.id);
          // console.log('checked',checked)
          return (
            <ListItem key={index}>
              <Checkbox
                label={option.label}
                checked={checked}
                onChange={(event) => {
                  const newVal = event.target.checked
                    ? [...val, option.id]
                    : val.filter((checkedOption) => option.id !== checkedOption);
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
};

export function RadioGroup({options, color, ...props}) {
  return (
    <Card variant={"soft"} color={color} size={"sm"} sx={{mt: 1, p: 2, boxShadow: "none"}}>
      <MuiRadioGroup {...props}>
        {options.map((option,index) => (
          <Radio value={option} key={index} label={option} />
        ))}
      </MuiRadioGroup>
    </Card>
  );
}

export function RadioGroupSemantic({options, color, ...props}) {
  return (
    <Card variant={"soft"} color={color} size={"sm"} sx={{mt: 1, p: 2, boxShadow: "none"}}>
      <MuiRadioGroup {...props}>
        {options.map((option) => (
          <Radio value={option.id} key={option.id} label={option.label} />
        ))}
      </MuiRadioGroup>
    </Card>
  );
}

export function DateInput({
  value,
  datePickerComponent: DatePickerComponent = DatePicker,
  inputFormat,
  ...props
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"fr"}>
      <DatePickerComponent
        value={dayjs(value)}
        {...(inputFormat ? {inputFormat} : {})}
        renderInput={({inputRef, inputProps, InputProps}) => {
          const onClick = InputProps.endAdornment?.props.children.props.onClick;
          return (
            <Input
              onClick={onClick}
              slotProps={{input: {ref: inputRef, ...inputProps}}}
              endDecorator={InputProps.endAdornment}
            />
          );
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}

/**
 * COMPONENTS
 */

export function ButtonWithLoading(props) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...props}
      loading={loading}
      onClick={(e) => {
        setLoading(true);
        props.onClick(e);
      }}
    />
  );
}

export function ButtonWithConfirmation({
  children,
  color,
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
    <Card color={color} variant={"solid"} invertedColors>
      <Stack gap={2}>
        <Typography>{areYouSureText}</Typography>
        <Button loading={loading} onClick={onClick} {...props}>
          {children}
        </Button>
        <Button variant={"soft"} size={"sm"} onClick={() => setAreYouSure(false)}>
          Annuler
        </Button>
      </Stack>
    </Card>
  );
}

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
      <CircularProgress size="lg" color={"neutral"} />
    </Stack>
  );
}

export function BasicList({elements, component = "ul"}) {
  return (
    <Box component={component} sx={{mt: 1, ml: -1}}>
      {elements?.map((el,index) => (
        <Box component={"li"} key={index}>
          {el}
        </Box>
      ))}
    </Box>
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
  const numberOfPages = Math.ceil(values?.length / itemsPerPage);
  const handlePageChange = (event, value) => {
    setPage(value);
    setURLParam("page", value, "number");
  };
  // If the pagination is too far away reset it back to 1
  useEffect(() => {
    values?.length < itemsPerPage * (page - 1) && handlePageChange(undefined, 1);
  }, [values?.length, page, itemsPerPage]);

  return (
    <PageContent mt={4} alignItems={"center"}>
      {ready ? (
        values?.length > 0 ? (
          <>
            <Typography sx={{color: "text.tertiary", opacity: 0.7}} mb={1}>
              Résultats {itemsPerPage * (page - 1) + 1} à{" "}
              {Math.min(itemsPerPage * page, values?.length)} sur {values.length}{" "}
            </Typography>

            <List sx={{alignSelf: "stretch"}}>
              {values.slice(itemsPerPage * (page - 1), itemsPerPage * page).map((value, index) => (
                <Item value={value} key={getKey ? getKey(value) : value} />
              ))}
            </List>

            {values?.length > itemsPerPage && (
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

export function ParagraphWithTitle({title, children, sx}) {
  return (
    <Stack gap={2}>
      <Typography level="h3" color="primary" fontWeight={"lg"} mb={1}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export function StatusChip({status, options}) {
  const statusObect=options.find(s=>s.id==status);
  // console.log('statusObect',statusObect);
  let IconComponent 
  if(statusObect?.icon){
    const muiIcon =  Muicon[statusObect?.icon];
    // console.log('muiIcon',muiIcon)
    if(muiIcon){
      IconComponent=muiIcon;
    }
  }
  if(!IconComponent){
    IconComponent= Muicon['QuestionMark'];
  }
  console.log('IconComponent',IconComponent)
  return (
    <Chip color={statusObect?.color} startDecorator={<IconComponent/>}>
      {statusObect?.label}
    </Chip>
  );
}

export function ExternalLink(props) {
  return (
    <Link
      startDecorator={<FileOpenRoundedIcon />}
      textColor={"primary.700"}
      target="_blank"
      rel="noopener"
      {...props}
    />
  );
}

export const SimpleBanner = ({children, sx}) => (
  <HeroBanner invertedColors={false}>
    <Container mx={2}>
      <Grid container spacing={2}>
        <Grid xs={12} display={"flex"} justifyContent={"center"}>
          <Typography level="h1" color={"white"} {...sx}>
            {children}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </HeroBanner>
);

export function HelpBox({children, color = "warning"}) {
  return (
    <Card variant="soft" color={color} size={"lg"}>
      <Stack gap={1}>{children}</Stack>
    </Card>
  );
}
