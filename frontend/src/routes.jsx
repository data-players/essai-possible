import {createBrowserRouter} from "react-router-dom";
import React from "react";
import PageOffersList from "./routes/offers/PageOffersList.jsx";
import Root from "./Root.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import PageOffer from "./routes/offers/PageOffer.jsx";
import HomePage from "./routes/HomePage.jsx";
import PageBook from "./routes/offers/book/PageBook.jsx";
import PageAccount from "./routes/account/PageAccount.jsx";
import {AuthComponent} from "./routes/account/AuthComponent.jsx";
import PageOfferRoot from "./routes/offers/PageOfferRoot.jsx";
import PageAccountRoot from "./routes/account/PageAccountRoot";
import PageMyMeetings from "./routes/account/myoffers/PageMyMeetings.jsx";

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
      {index: true, element: <HomePage />},

      {path: "offers", element: <PageOffersList />},
      {
        path: "offers/:id",
        element: <PageOfferRoot />,
        children: [
          {index: true, element: <PageOffer />},
          {path: "book", element: <PageBook />},
        ],
      },

      {
        path: "account",
        element: <PageAccountRoot />,
        children: [{index: true, element: <PageAccount />}],
      },
      {path: "my-meetings", element: <PageMyMeetings />},

      {path: "login", element: <AuthComponent mode={"logIn"} redirect />},
      {path: "signup", element: <AuthComponent mode={"signUp"} redirect />},
    ],
  },
]);
