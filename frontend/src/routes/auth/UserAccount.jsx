import Button from "@mui/joy/Button";
import {authActions, selectCurrentUser} from "../../app/auth-slice.js";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {LoadingSpinner} from "../../components/atoms";

export default function UserAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);

  // Redirect user to home page if it is not connected
  if (!currentUser) return <LoadingSpinner />;

  return (
    <>
      Hey {currentUser.firstName} !
      <Button
        onClick={() => {
          dispatch(authActions.logOut());
          navigate("/login");
        }}>
        Log out
      </Button>
    </>
  );
}
