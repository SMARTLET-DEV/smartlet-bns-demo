"use client";

import {
  CalendarIcon,
  CopyIcon,
  GeoAltIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@/assets/icons";
import { useIsMobile } from "@/hooks/useIsMobile";
import { changeLoginModalOpen } from "@/redux/reducers/authModals/authModalsSlice";
import {
  useCreateFavoriteListingMutation,
  useDeleteFavoriteListingMutation,
  useGetAllFavoritesByPropertyIdQuery,
} from "@/redux/reducers/favorites/favoritesApi";
import { RootState } from "@/redux/store";
import { CheckIcon, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SharePropertyDialog from "../property-details/sharePropertyDialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import PropertyRentalViewingAppointmentCard from "./PropertyRentalViewingAppointmentCard";
import { Wallet } from "lucide-react";

export interface PropertyInfoCardProps {
  title: string;
  location: string;
  price: number;
  tags: string[];
  availability: Date;
  propertyId: any;
  readablePropertyId: string;
  packageType: string;
  serviceCharge?: number;
  depositRequiredForMonths?: number;
}

export default function PropertyInfoCard({
  title,
  location,
  price,
  tags,
  availability,
  propertyId,
  readablePropertyId,
  packageType,
  serviceCharge,
  depositRequiredForMonths,
}: PropertyInfoCardProps) {
  //console.log("Tags array:", tags);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const user: any = useSelector((state: RootState) => state.auth.user);
  const isLoginModalOpen = useSelector(
    (state: RootState) => state.authModals.loginModalOpen
  );

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<any>("");
  const [copiedID, setCopiedID] = useState(false);

  const {
    data: favoriteData,
    isLoading,
    isError,
    refetch,
  } = useGetAllFavoritesByPropertyIdQuery(propertyId, { skip: !user });

  const [createFavoriteListing] = useCreateFavoriteListingMutation();
  const [deleteFavoriteListing] = useDeleteFavoriteListingMutation();

  useEffect(() => {
    if (favoriteData?.favoriteListings?.length > 0) {
      setIsFavorite(true);
      setFavoriteId(favoriteData.favoriteListings[0].id);
    } else {
      setIsFavorite(false);
      setFavoriteId("");
    }
  }, [favoriteData]);

  const handleFavorite = async () => {
    if (!user) {
      dispatch(changeLoginModalOpen(!isLoginModalOpen));
      return;
    }

    if (!isFavorite) {
      const favoriteRes = await createFavoriteListing({
        property: propertyId,
      }).unwrap();
      if (favoriteRes.success) {
        setIsFavorite(true);
        setFavoriteId(favoriteRes.favoriteListing.id);
      }
    } else {
      const favoriteRes = await deleteFavoriteListing(favoriteId).unwrap();
      if (favoriteRes.success) {
        setIsFavorite(false);
        setFavoriteId("");
      }
    }
  };

  return (
    <div className="w-full max-w-none md:max-w-[340px] lg:max-w-[410px] h-fit flex flex-col text-secondary bg-white rounded-2xl p-4 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-background capitalize text-sm rounded border-none text-muted font-normal"
            >
              {tag?.toLowerCase()}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SharePropertyDialog />
          {isMobile && (
            <Button
              onClick={handleFavorite}
              className="bg-background hover:shadow-md cursor-pointer text-secondary text-sm rounded border-none"
            >
              {isFavorite ? (
                <HeartFilledIcon className="w-5 h-5 text-primary hover:text-white" />
              ) : (
                <HeartIcon className="w-5 h-5 hover:text-white" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 text-muted">
        <p className="flex text-xl font-light mt-4 items-center gap-1 text-secondary">
          &#2547;{price.toLocaleString()}{" "}
          <span className="text-muted text-xs font-normal">per month</span>
        </p>
        {serviceCharge && (
          <div className="flex items-center gap-1">
            <FileText className="w-5 h-5" />
            <p>
              Service Charge{" "}
              <span className="font-normal text-secondary">
                &#2547;{Number(serviceCharge).toLocaleString()}
              </span>
            </p>
          </div>
        )}
        {depositRequiredForMonths && (
          <div className="flex items-center gap-1">
            <Wallet className="w-5 h-5" />
            <p>
              Deposit{" "}
              <span className="font-normal text-secondary">
                {depositRequiredForMonths}{" "}
                {depositRequiredForMonths === 1 ? "month" : "months"}
              </span>
            </p>
          </div>
        )}
        <p className="text-xl font-light mt-2 text-secondary hidden">{title}</p>

        <div className="flex items-center gap-1">
          <GeoAltIcon className="w-5 h-5" />
          <p>{location}</p>
        </div>

        <div className="flex items-center gap-1">
          <CalendarIcon className="w-5 h-5" />
          <p>
            Available from{" "}
            <span className="font-normal text-secondary">
              {availability
                .toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
                .replace(/(\w+)\s(\d+)/, "$1, $2")}
            </span>
          </p>
        </div>

        <div className="ms-auto flex items-center gap-2 border-b pb-4 border-background">
          <p>
            Property ID:{" "}
            <span className="text-secondary font-normal">
              {readablePropertyId}
            </span>
          </p>
          <Button
            variant="outline"
            className="bg-background cursor-pointer text-secondary text-sm rounded border-none has-[>svg]:p-[2px] h-fit w-fit"
            onClick={() => {
              navigator.clipboard.writeText(readablePropertyId);
              setCopiedID(true);
              setTimeout(() => setCopiedID(false), 2000);
            }}
          >
            {copiedID ? (
              <CheckIcon className="w-3 h-3 text-black" />
            ) : (
              <CopyIcon className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/*<p className="flex text-xl font-normal mt-4 items-center gap-1">
        &#2547;{price.toLocaleString()}{" "}
        <span className="text-muted text-xs font-normal">per month</span>
      </p>*/}

      <PropertyRentalViewingAppointmentCard
        packageType={packageType}
        propertyID={propertyId}
      />
    </div>
  );
}
