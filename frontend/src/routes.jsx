import {createBrowserRouter} from "react-router-dom";
import React from "react";
import Offers, {loader as offersLoader} from "./routes/offers/Offers.jsx";
import Root from "./Root.jsx";
import ErrorPage from "./routes/errorPage";
import Offer, {loader as offerLoader} from "./routes/offers/Offer.jsx";
import HomePage from "./routes/HomePage.jsx";
import BookMeeting from "./routes/offers/BookMeeting";

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
        loader: offersLoader,
        element: <Offers />,
      },
      {
        path: "offers/:id",
        loader: offerLoader,
        element: <Offer />,
      },
      {
        path: "offers/:id/book",
        loader: offerLoader,
        element: <BookMeeting />,
      },
    ],
  },
]);
