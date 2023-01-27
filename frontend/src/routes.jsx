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
import PageAuth from "./routes/account/PageAuth.jsx";

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

        {path: "login", element: <PageAuth mode={"logIn"} type={"candidate"} />},
        {path: "signup", element: <PageAuth mode={"signUp"} type={"candidate"} />},
        {path: "login/company", element: <PageAuth mode={"logIn"} type={"company"} />},
        {path: "signup/company", element: <PageAuth mode={"signUp"} type={"company"} />},
        {path: "cgu", element: <PageCGU />},
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
