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
  const navigate = useNavigate();

  const offer = useSelector((state) => selectOfferById(state, encodeURIComponent(id)));
  const encodedCompanyId = companyId ? encodeURIComponent(companyId): offer?.company ? offer?.company: undefined 

  useFetchCompanyQuery(encodedCompanyId);

  const currentUser = useSelector(selectCurrentUser);
  const company = useSelector((state) => selectCompanyById(state, encodedCompanyId));
  // console.log('Protection currentUser',currentUser);

  // User not belonging to the company bump out
  useEffect(() => {
    if (currentUser && encodedCompanyId  && !currentUser?.companies.includes(encodedCompanyId)){
      navigate(redirectTo);
    }
  }, [encodedCompanyId, currentUser?.companies]);

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
