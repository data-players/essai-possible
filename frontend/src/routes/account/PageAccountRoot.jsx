import {selectCurrentUserReady, useFetchUserQuery} from "../../app/auth-slice.js";
import * as React from "react";
import {useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {LoadingSpinner} from "../../components/atoms";

export default function PageAccountRoot() {
  useFetchUserQuery();
  const currentUserReady = useSelector(selectCurrentUserReady);

  if (!currentUserReady) return <LoadingSpinner />;

  return <Outlet />;
}
