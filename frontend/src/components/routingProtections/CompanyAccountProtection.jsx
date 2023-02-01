import {Outlet, useNavigate, useParams} from "react-router-dom";
import {selectCompanyById, useFetchCompanyQuery} from "../../routes/offers/companies-slice.js";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/auth-slice.js";
import {LoadingSpinner} from "../atoms.jsx";
import * as React from "react";
import {useEffect} from "react";
import ConnectedUserProtection from "./ConnectedUserProtection.jsx";
import {selectOfferById} from "../../routes/offers/offers-slice.js";

const Protection = ({children, redirectTo = "/offers"}) => {

  const {id, companyId} = useParams();
  // console.log('id, companyId',id, companyId);
  const navigate = useNavigate();

  const offer = useSelector((state) => selectOfferById(state, id));
  const finalCompanyId = companyId || offer.company;

  useFetchCompanyQuery(finalCompanyId);


  const currentUser = useSelector(selectCurrentUser);
    // console.log('currentUser',currentUser);
    // console.log('finalCompanyId',encodeURIComponent(finalCompanyId));
  const company = useSelector((state) => selectCompanyById(state, encodeURIComponent(finalCompanyId)));

  // User not belonging to the company bump out
  useEffect(() => {
    if (!currentUser?.companies.includes(finalCompanyId)) navigate(redirectTo);
  }, [finalCompanyId, currentUser?.companies]);

  console.log('protector company',company,!company?.id);
  if (!company?.id) return <LoadingSpinner />;

  return children || <Outlet />;
};

export default function CompanyAccountProtection(props) {
  return (
    <ConnectedUserProtection>
      <Protection {...props} />
    </ConnectedUserProtection>
  );
}
