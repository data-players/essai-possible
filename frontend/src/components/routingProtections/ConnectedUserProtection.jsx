import {
  selectAuthTokenExists,
  selectCurrentUserReady,
} from "../../app/auth-slice.js";
import * as React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import {LoadingSpinner} from "../atoms.jsx";

export default function ConnectedUserProtection({children}) {

  const navigate = useNavigate();

  const authTokenExists = useSelector(selectAuthTokenExists);
  const currentUserReady = useSelector(selectCurrentUserReady);

  // const currentUser = useSelector(selectCurrentUser);

  // Non connected users bump out
  useEffect(() => {
    if (!authTokenExists ) navigate("/login");
  }, [authTokenExists]);

  // Connected but loading users wait
  // console.log('ConnectedUserProtection',!authTokenExists || !currentUserReady)
  if (!authTokenExists || !currentUserReady){
    console.log('ConnectedUserProtection Loading...')
    return <LoadingSpinner />;
  }

  return children || <Outlet />;
}
