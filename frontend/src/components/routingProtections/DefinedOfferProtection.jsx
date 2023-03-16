// The Offer page wrapper that safely loads data so we don't need to worry about it inside it
import {Outlet, useParams} from "react-router-dom";
import {selectOfferById, useFetchOfferQuery, selectOfferReady} from "../../routes/offers/offers-slice.js";
import {useSelector} from "react-redux";
import {selectCompanyById, useLazyFetchCompanyQuery} from "../../routes/offers/companies-slice.js";
import {useEffect} from "react";
import {LoadingSpinner} from "../atoms.jsx";
// import {useFetchSlotsQuery} from "../../routes/offers/book/slots-slice.js";

export default function DefinedOfferProtection() {
  const {id} = useParams();

  // Fetch the full offer
  useFetchOfferQuery(id);
  const offer = useSelector((state) => selectOfferById(state, encodeURIComponent(id))) || {};

  // Fetch the offer slots
  // useFetchSlotsQuery({offer: encodeURIComponent(id)});

  // Fetch the full company when we have its id from the offer
  const [launchFetchCompanyQuery] = useLazyFetchCompanyQuery();
  useEffect(() => {
    if (offer.company) launchFetchCompanyQuery(offer.company);
  }, [offer.company]);
  const company = useSelector((state) => selectCompanyById(state, offer?.company)) || {};
  const sofferReady = useSelector(selectOfferReady);
  // console.log('company',company)

  // Don't use the ready status because sometimes the objects are partially loaded and can be displayed already.
  // Instead, if the id is present is a good test to see if we can display stuff.
  // console.log('DefinedOfferProtection',!(offer.id));
  if (!(sofferReady && offer.id)) return <LoadingSpinner />;

  return <Outlet />;
}
