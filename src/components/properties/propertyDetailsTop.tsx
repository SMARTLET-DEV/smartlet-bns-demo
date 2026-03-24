"use client";
import { Listingcardcontainer } from "../ListingCard/Listingcardcontainer";

const PropertyDetailsTop = ({ property }: any) => {
  // console.log("mama property: ",property);
  return (
    <>
      <div className="w-full">
        <Listingcardcontainer
          images={property?.media}
          label="smartVIEW"
          variant="large"
          virtualTour={property?.virtualTour}
          title={property?.title}
          location={property?.address}
          propertyId={property?.id}
          letAgreed={property?.letAgreed}
        />
      </div>
    </>
  );
};

export default PropertyDetailsTop;
