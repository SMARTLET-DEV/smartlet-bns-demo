import { setHoveredCard } from "@/redux/reducers/listingCard/listingCardSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ListingcardBottom } from "./ListingcardBottom";
import { Listingcardcontainer } from "./Listingcardcontainer";

interface ListingCardProps {
  id: string;
  thumbnail?: string;
  images: string[];
  label: string;
  title: string;
  location: string;
  bed: number;
  bath: number;
  floorsqft: number;
  rent: number;
  virtualTour?: string;
  from?: "default" | "explorer";
  propertyType?: string;
  spaceType?: "enclosed" | "open" | "ENCLOSED_SPACE" | "OPEN_SPACE";
  mobileLayout?: "fixed" | "full";
}

export const ListingCard: React.FC<ListingCardProps> = ({
    id,
    thumbnail,
    images,
    label,
    title,
    location,
    bed,
    bath,
    floorsqft,
    rent,
    virtualTour,
    from = "default",
    propertyType,
    spaceType,
    mobileLayout = "fixed",
}) => {
    const dispatch = useDispatch();
    const hoveredCardId = useSelector(
        (state: RootState) => state.listingCard.hoveredCardId
    );

    const bottomContent = (
        <ListingcardBottom
            title={title}
            location={location}
            bed={bed}
            bath={bath}
            floorsqft={floorsqft}
            rent={rent}
            propertyType={propertyType}
            spaceType={spaceType}
            mobileLayout={mobileLayout}
        />
    );

    return (
        <div
            className={`flex flex-col ${mobileLayout === "full" ? "w-full sm:w-fit" : "w-fit"} items-center rounded-2xl group transition hover:outline hover:outline-primary`}
            onMouseEnter={() => dispatch(setHoveredCard(id))}
            onMouseLeave={() => dispatch(setHoveredCard(null))}
        >
            <Listingcardcontainer
                id={id}
                hoveredCardId={hoveredCardId}
                thumbnail={thumbnail}
                images={images}
                label={label}
                title={title}
                location={location}
                virtualTour={virtualTour}
                propertyId={id}
                mobileLayout={mobileLayout}
            />
            {from === "explorer" ? (
                <Link
                    href={`/properties/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                >
                    {bottomContent}
                </Link>
            ) : (
                <Link href={`/properties/${id}`} className="w-full">{bottomContent}</Link>
            )}
        </div>
    );
};
