import {Outlet, useNavigate, useParams} from "react-router-dom";
import {selectCompanyById, useFetchCompanyQuery} from "../offers/companies-slice.js";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../app/auth-slice.js";
import {LoadingSpinner} from "../../components/atoms.jsx";
import * as React from "react";
import {useEffect} from "react";
import ConnectedUserProtection from "../account/ConnectedUserProtection.jsx";
import {selectOfferById} from "../offers/offers-slice";

const Protection = ({children, redirectTo = "/offers"}) => {
  const {id, companyId} = useParams();
  const navigate = useNavigate();

  const offer = useSelector((state) => selectOfferById(state, id));
  const finalCompanyId = companyId || offer.company;

  useFetchCompanyQuery(finalCompanyId);

  const currentUser = useSelector(selectCurrentUser);
  const company = useSelector((state) => selectCompanyById(state, finalCompanyId));

  // User not belonging to the company bump out
  useEffect(() => {
    console.log(finalCompanyId);
    if (!currentUser?.companies.includes(finalCompanyId)) navigate(redirectTo);
  }, [finalCompanyId, currentUser?.companies]);

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
