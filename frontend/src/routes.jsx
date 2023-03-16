import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React from "react";
import PageOffersList from "./routes/offers/PageOffersList.jsx";
import Root from "./Root.jsx";
import PageError from "./routes/PageError.jsx";
import PageOffer from "./routes/offers/PageOffer.jsx";
import HomePage from "./routes/HomePage.jsx";
import PageBook from "./routes/offers/book/PageBook.jsx";
import PageAccount from "./routes/account/PageAccount.jsx";
import DefinedOfferProtection from "./components/routingProtections/DefinedOfferProtection.jsx";
import ConnectedUserProtection from "./components/routingProtections/ConnectedUserProtection.jsx";
import PageMyMeetings from "./routes/account/PageMyMeetings.jsx";
import PageCGU from "./routes/PageCGU";
import PageEditOffer from "./routes/offers/edit/PageEditOffer";
import PageCompanyOffersList from "./routes/company/PageCompanyOffersList.jsx";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./app/auth-slice.js";
import CompanyAccountProtection from "./components/routingProtections/CompanyAccountProtection.jsx";
import PageEditCompany from "./routes/company/PageEditCompany";
import PageEditCompanyUsers from "./routes/company/PageEditCompanyUsers";
import PageSignUp from "./routes/account/PageSignUp.jsx";
import PageLogIn from "./routes/account/PageLogIn.jsx";
import PageAskAffilition from "./routes/account/PageAskAffiliation.jsx";

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
              element: <DefinedOfferProtection />,
              children: [
                {index: true, element: <PageOffer />},
                {
                  path: "book/:slotId?",
                  element: <PageBook />
                },
                {
                  path: "edit",
                  element: (
                    <CompanyAccountProtection redirectTo={".."}>
                      <PageEditOffer mode={"edit"} />
                    </CompanyAccountProtection>
                  ),
                },
                {
                  path: "copy",
                  element: (
                    <CompanyAccountProtection redirectTo={".."}>
                      <PageEditOffer mode={"edit"} isCopying />
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
            {
              path: "users",
              element: <PageEditCompanyUsers mode={"edit"} />,
            },
          ],
        },
        {
          path: "account",
          element: <ConnectedUserProtection />,
          children: [
            {index: true, element: <PageAccount />},
            {
              path: "my-meetings",
              element: <PageMyMeetings />,
            },
          ],
        },
        {
          path: "account/affiliation",
          element: <ConnectedUserProtection />,
          children: [
            {index: true, element: <PageAskAffilition />},
          ],
        },

        {path: "login", element: <PageLogIn />},
        {path: "signup", element: <PageSignUp />},
        {path: "company/signup", element: <PageSignUp companyMode />},
        {path: "cgu", element: <PageCGU />},
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
