// The Offer page wrapper that safely loads data so we don't need to worry about it inside it
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {selectOfferById, useFetchOfferQuery} from "./offers-slice.js";
import {useSelector} from "react-redux";
import {selectCompanyById, useLazyFetchCompanyQuery} from "./companies-slice.js";
import {useEffect} from "react";
import {LoadingSpinner} from "../../components/atoms.jsx";
import {useFetchSlotsQuery} from "./book/slots-slice.js";
import {selectCurrentUser, selectCurrentUserReady} from "../../app/auth-slice.js";

export default function PageOfferProtection({onlyCompanyMembers = false}) {
  const {id} = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const currentUserReady = useSelector(selectCurrentUserReady);

  // Fetch the full offer
  useFetchOfferQuery(id);
  const offer = useSelector((state) => selectOfferById(state, id)) || {};

  // Fetch the offer slots
  useFetchSlotsQuery({offer: id});

  // Fetch the full company when we have its id from the offer
  const [launchFetchCompanyQuery] = useLazyFetchCompanyQuery();
  useEffect(() => {
    if (offer.company) launchFetchCompanyQuery(offer.company);
  }, [offer.company]);
  const company = useSelector((state) => selectCompanyById(state, offer.company)) || {};

  // If needed (onlyCompanyMembers == true), make sure that the user has the right to edit the offer

  if (onlyCompanyMembers) {
    const isMemberOfTheCompany = currentUser?.companies?.includes(company.id);
    if (!currentUserReady) return <LoadingSpinner />;
    if (!isMemberOfTheCompany) {
      navigate(`/offers/${id}`);
      return;
    }
  }

  // Don't use the ready status because sometimes the objects are partially loaded and can be displayed already.
  // Instead, if the id is present is a good test to see if we can display stuff.
  if (!(offer.id && company.id)) return <LoadingSpinner />;

  return <Outlet />;
}
