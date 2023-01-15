import {createBrowserRouter} from "react-router-dom";
import React from "react";
import PageOffersList from "./routes/offers/PageOffersList.jsx";
import Root from "./Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import PageOffer from "./routes/offers/PageOffer.jsx";
import HomePage from "./routes/HomePage.jsx";
import PageBookMeeting from "./routes/offers/PageBookMeeting.jsx";
import UserAccount from "./routes/auth/UserAccount.jsx";
import {AuthComponent} from "./routes/auth/AuthComponent.jsx";

export default createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <Root>
        <ErrorPage />
      </Root>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "offers",
        element: <PageOffersList />,
      },
      {
        path: "offers/:id",
        element: <PageOffer />,
      },
      {
        path: "offers/:id/book",
        element: <PageBookMeeting />,
      },
      {
        path: "account",
        element: <UserAccount />,
      },
      {
        path: "login",
        element: <AuthComponent mode={"logIn"} redirect />,
      },
      {
        path: "signup",
        element: <AuthComponent mode={"signUp"} redirect />,
      },
    ],
  },
]);
