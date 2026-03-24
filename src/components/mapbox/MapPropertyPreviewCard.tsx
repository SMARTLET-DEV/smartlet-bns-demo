import { BedIcon, SizeIcon } from "@/assets/icons";

interface MapPropertyPreviewCardProps {
  propertyId: string;
  thumbnail: string;
  price: number;
  sqft: number;
  beds: number;
  tags?: string[];
  onCardClick: (propertyId: string) => void;
}

export default function MapPropertyPreviewCard({
    propertyId,
    thumbnail,
    price,
    sqft,
    beds,
    onCardClick,
}: MapPropertyPreviewCardProps) {
    return (
        <div
            onClick={() => onCardClick(propertyId)}
            className="flex bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-[190px]"
        >
            {/* Thumbnail */}
            <div className="w-[70px] flex-shrink-0 relative self-stretch">
                <img
                    src={thumbnail}
                    alt="Property"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col p-2 flex-1 min-w-0">
                {/* Price */}
                <div className="mb-1">
                    <h3 className="text-base font-normal text-secondary leading-none mb-0">
            ৳{Number(price).toLocaleString()}
                    </h3>
                    <span className="text-xs text-muted leading-none block -mt-0.5">per month</span>
                </div>

                {/* Property Info */}
                <div className="flex items-center gap-3 text-xs text-muted mt-auto">
                    <div className="flex items-center gap-0.5">
                        <BedIcon className="w-3 h-3" />
                        <span>{beds}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <SizeIcon className="w-3 h-3" />
                        <span>{sqft} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
