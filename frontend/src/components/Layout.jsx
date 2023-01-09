import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import {Container} from "@mui/joy";
import Stack from "@mui/joy/Stack";

function Root(props) {
  return (
    <Box
      {...props}
      sx={[{bgcolor: "background.surface"}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    />
  );
}

function Header(props) {
  return (
    <Box {...props}>
      <Container
        sx={[
          {
            py: 3,
            gap: 3,
            bgcolor: "background.surface",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}>
        {props.children}
      </Container>
    </Box>
  );
}

function SideNav(props) {
  return (
    <Box
      component="nav"
      className="Navigation"
      {...props}
      sx={[
        {
          p: 2,
          bgcolor: "background.surface",
          borderRight: "1px solid",
          borderColor: "divider",
          display: {
            xs: "none",
            sm: "initial",
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}

function Footer(props) {
  return (
    <Box component="footer" className="Footer" {...props}>
      <Sheet color={"neutral"} variant={"solid"} invertedColors>
        <Container>
          <Stack py={4}>
            {props.children}
            <Stack direction={"row"} justifyContent={"center"}>
              <Box
                component={"img"}
                src={
                  "https://www.toustespossibles.fr/wp-content/uploads/2022/06/TOUSTESPOSSIBLES_logo_blanc_rouge-1030x366.png"
                }
                width={300}
              />
            </Stack>
          </Stack>
        </Container>
      </Sheet>
    </Box>
  );
}

function Main(props) {
  return <Box {...props} />;
}

function SideDrawer({onClose, ...props}) {
  return (
    <Box
      {...props}
      sx={[
        {position: "fixed", zIndex: 1200, width: "100%", height: "100%"},
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}>
      <Box
        role="button"
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: (theme) => `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        }}
      />
      <Sheet
        sx={{
          minWidth: 256,
          width: "max-content",
          height: "100%",
          p: 2,
        }}>
        {props.children}
      </Sheet>
    </Box>
  );
}

export function HeroBanner(props) {
  const Component = props.component || Sheet;
  return (
    <Component
      variant="solid"
      color="neutral"
      invertedColors
      sx={[{overflow: "hidden", py: 8}, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
      <Box
        component="img"
        alt=""
        src="https://storage.googleapis.com/cms-storage-bucket/72521e62275b24d3c37d.png"
        sx={{position: "absolute", height: "100%", top: 0, right: 0, zIndex: 0}}
      />
      <Container sx={{position: "relative"}}>{props.children}</Container>
    </Component>
  );
}

export function PageContent(props) {
  return (
    <Container>
      <Stack my={4} mb={6} mt={2} mx={2} {...props} />
    </Container>
  );
}

const Layout = {
  Root,
  Header,
  SideNav,
  SideDrawer,
  Main,
  Footer,
};

export default Layout;
