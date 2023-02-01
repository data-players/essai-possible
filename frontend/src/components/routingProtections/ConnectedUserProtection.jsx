import {
  selectAuthTokenExists,
  selectCurrentUserReady,
  useFetchUserQuery,
} from "../../app/auth-slice.js";
import * as React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import {LoadingSpinner} from "../atoms.jsx";

export default function ConnectedUserProtection({children}) {
  const navigate = useNavigate();

  useFetchUserQuery();

  const currentUserReady = useSelector(selectCurrentUserReady);
  const authTokenExists = useSelector(selectAuthTokenExists);

  // Non connected users bump out
  useEffect(() => {
    if (!authTokenExists) navigate("/login");
  }, [authTokenExists]);

  // Connected but loading users wait
// console.log('authTokenExists && !currentUserReady',authTokenExists && !currentUserReady);

  if (authTokenExists && !currentUserReady) return <LoadingSpinner />;



  return children || <Outlet />;
}
