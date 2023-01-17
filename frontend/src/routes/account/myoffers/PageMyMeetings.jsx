import {selectCurrentUser} from "../../../app/auth-slice.js";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {PageContent} from "../../../components/Layout";
import Typography from "@mui/joy/Typography";

export default function PageMyMeetings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);

  return (
    <PageContent gap={3}>
      <Typography level={"h1"}>Mes rendez-vous</Typography>
    </PageContent>
  );
}
