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
          children: [
            {
              index: true,
              element: (
                <CompanyAccountProtection>
                  <PageCompanyOffersList />
                </CompanyAccountProtection>
              ),
            },
            {
              path: "new-offer",
              element: (
                <CompanyAccountProtection>
                  <PageEditOffer mode={"new"} />
                </CompanyAccountProtection>
              ),
            },
          ],
        },
        {
          path: "account",
          element: (
            <ConnectedUserProtection>
              <PageAccount />
            </ConnectedUserProtection>
          ),
        },

        !isACompanyAccount && {
          path: "my-meetings",
          element: (
            <ConnectedUserProtection>
              <PageMyMeetings />
            </ConnectedUserProtection>
          ),
        },

        {path: "login", element: <AuthComponent mode={"logIn"} redirect />},
        {path: "signup", element: <AuthComponent mode={"signUp"} redirect />},

        {path: "cgu", element: <PageCGU />},
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
