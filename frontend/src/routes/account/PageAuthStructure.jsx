import {SimpleBanner} from "../../components/atoms";
import {PageContent} from "../../components/Layout";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";

export default function PageAuthStructure({title, children}) {
  return (
    <>
      <SimpleBanner sx={{mb: 12}}></SimpleBanner>
      <Divider sx={{py: 4, bgcolor: "primary.solidBg"}} />
      <Sheet color={"neutral"} variant={"solid"} sx={{mt: -2, py: 6}}>
        <PageContent color="neutral" maxWidth={"sm"} gap={3} mt={-23}>
          {children}
        </PageContent>
      </Sheet>
    </>
  );
}
