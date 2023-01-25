/**
 * Inspired from https://github.com/evandromacedo/react-simple-snackbar/blob/master/src/Snackbar.js
 */
import React, {createContext, useContext, useState} from "react";
import Slide from "@mui/material/Slide";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import ChipDelete from "@mui/joy/ChipDelete";

// Snackbar default values
export const defaultDuration = 5000;
export const defaultInterval = 250;

// Context used by the hook useSnackbar() and HoC withSnackbar()
export const SnackbarContext = createContext(null);

export function SnackbarProvider({children}) {
  // Current open state
  const [open, setOpen] = useState(false);
  // Current timeout ID
  const [timeoutId, setTimeoutId] = useState(null);
  // Snackbar's text
  const [text, setText] = useState("");
  // Snackbar's duration
  const [duration, setDuration] = useState(defaultDuration);
  // Custom styles for the snackbar itself
  const [props, setProps] = useState({});

  const triggerSnackbar = (text, props) => {
    setText(text);
    props?.duration && setDuration(duration);
    setProps(props);
    setOpen(true);
  };

  // Manages all the snackbar's opening process
  const openSnackbar = (text, props) => {
    // Closes the snackbar if it is already open

    if (open === true) {
      setOpen(false);
      setTimeout(() => {
        triggerSnackbar(text, props);
      }, defaultInterval);
    } else {
      triggerSnackbar(text, props);
    }
  };

  // Closes the snackbar just by setting the "open" state to false
  const closeSnackbar = () => setOpen(false);

  // Returns the Provider that must wrap the application
  return (
    <SnackbarContext.Provider value={{openSnackbar, closeSnackbar}}>
      {children}

      {/* Renders Snackbar on the end of the page */}
      <Slide
        direction="up"
        in={open}
        mountOnEnter
        unmountOnExit
        onEnter={() => {
          clearTimeout(timeoutId);
          setTimeoutId(setTimeout(closeSnackbar, duration));
        }}>
        {/* This div will be rendered with CSSTransition classNames */}
        <Box
          sx={[
            {position: "fixed", bottom: {xs: 10, md: 15}, right: 0, zIndex: 1202, width: "100%"},
          ]}>
          <Stack alignItems={"center"}>
            <Card
              size={"sm"}
              variant={"soft"}
              color={"neutral"}
              {...props}
              sx={{boxShadow: "sm", px: 2, ...props?.sx}}>
              <Stack direction={"row"} gap={2} alignItems={"center"}>
                {/* Snackbar text */}
                <Typography>{text}</Typography>

                {/* Snackbar close button */}
                <ChipDelete
                  onClick={closeSnackbar}
                  variant={"solid"}
                  color={props?.color || "neutral"}
                />
              </Stack>
            </Card>
          </Stack>
        </Box>
      </Slide>
    </SnackbarContext.Provider>
  );
}

// Custom hook to trigger the snackbar on function components
export function useSnackbar() {
  const {openSnackbar, closeSnackbar} = useContext(SnackbarContext);
  return [openSnackbar, closeSnackbar];
}
