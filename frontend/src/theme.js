import {extendTheme} from "./utils/mui";

export default extendTheme({
  colorSchemes: {
    light: {
      palette: {
        neutral: {
          50: "#F2F3F5",
          100: "#E0E2E8",
          200: "#B0B5C4",
          300: "#7F87A1",
          400: "#4F577E",
          500: "#1F255A",
          600: "#191E48",
          700: "#131636",
          800: "#0C0F24",
          900: "#060712",
        },
        primary: {
          50: "#FDF5F7",
          100: "#FBE7EC",
          200: "#F6C3CD",
          300: "#F09FA9",
          400: "#EB7A83",
          500: "#E55658",
          600: "#B74546",
          700: "#893435",
          800: "#5C2223",
          900: "#2E1112",
        },
        text: {
          secondary: "var(--joy-palette-neutral-500)",
          tertiary: "var(--joy-palette-neutral-400)",
        },
      },
    },
  },
  components: {
    JoyContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
        },
      },
    },
    JoyTextarea: {
      defaultProps: {
        variant: "soft",
      },
    },
    JoyTextField: {
      defaultProps: {
        variant: "soft",
      },
    },
  },
});
