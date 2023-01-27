import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React from "react";
import PageOffersList from "./routes/offers/PageOffersList.jsx";
import Root from "./Root.jsx";
import PageError from "./routes/PageError.jsx";
import PageOffer from "./routes/offers/PageOffer.jsx";
import HomePage from "./routes/HomePage.jsx";
import PageBook from "./routes/offers/book/PageBook.jsx";
import PageAccount from "./routes/account/PageAccount.jsx";
import {AuthComponent} from "./routes/account/AuthComponent.jsx";
import PageOfferProtection from "./routes/offers/PageOfferProtection.jsx";
import ConnectedUserProtection from "./routes/account/ConnectedUserProtection.jsx";
import PageMyMeetings from "./routes/account/PageMyMeetings.jsx";
import PageCGU from "./routes/PageCGU";
import PageEditOffer from "./routes/offers/edit/PageEditOffer";
import PageCompanyOffersList from "./routes/company/PageCompanyOffersList.jsx";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./app/auth-slice.js";
import CompanyAccountProtection from "./routes/company/CompanyAccountProtection.jsx";
import PageEditCompany from "./routes/company/PageEditCompany";

export default function Router() {
  const currentUser = useSelector(selectCurrentUser);

  const isACompanyAccount = currentUser?.companies?.length > 0;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: (
        <Root>
          <PageError />
        </Root>
      ),
      children: [
        {index: true, element: <HomePage />},

        {
          path: "offers",
          children: [
            {index: true, element: <PageOffersList />},
            {
              path: ":id",
              element: <PageOfferProtection />,
              children: [
                {index: true, element: <PageOffer />},
                {path: "book", element: <PageBook />},
                {
                  path: "edit",
                  element: (
                    <CompanyAccountProtection redirectTo={".."}>
                      <PageEditOffer mode={"edit"} />
                    </CompanyAccountProtection>
                  ),
                },
              ],
            },
          ],
        },

        {
          path: "company/:companyId",
          element: <CompanyAccountProtection />,
          children: [
            {
              index: true,
              element: <PageCompanyOffersList />,
            },
            {
              path: "new-offer",
              element: <PageEditOffer mode={"new"} />,
            },
            {
              path: "edit",
              element: <PageEditCompany mode={"edit"} />,
            },
          ],
        },

        {
          path: "account",
          element: <ConnectedUserProtection />,
          children: [
            {index: true, element: <PageAccount />},

            !isACompanyAccount && {
              path: "my-meetings",
              element: <PageMyMeetings />,
            },
          ],
        },

        {path: "login", element: <AuthComponent mode={"logIn"} redirect />},
        {path: "signup", element: <AuthComponent mode={"signUp"} redirect />},

        {path: "cgu", element: <PageCGU />},
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
