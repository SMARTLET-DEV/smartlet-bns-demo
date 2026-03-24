import { RentalProperty } from "@/types/rental-process";
import { GeoAltIcon, CalendarIcon } from "@/assets/icons";
import { Wallet, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

interface PropertySummaryCardProps {
    property: RentalProperty & {
        depositRequiredForMonths?: number; // Keep this if it's UI specific
    };
}

export function PropertySummaryCard({ property }: PropertySummaryCardProps) {
    const price = property.rent_amount || property.price || 0;
    const depositMonths = property.depositRequiredForMonths || property.deposit_months || 0;
    const availabilityDate = property.createdAt ? new Date(property.createdAt) : new Date();

    return (
        <div className="w-full h-fit flex flex-col text-secondary bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-medium line-clamp-2 pr-4">{property.title}</h3>
                <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-primary transition-all shadow-sm"
                    onClick={() => window.open(`/properties/${property.id}`, "_blank")}
                    title="View Property"
                >
                    <ArrowUpRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex flex-col gap-3 text-muted">
                <p className="flex text-2xl font-light items-center gap-1 text-secondary">
                    &#2547;{price.toLocaleString()}{" "}
                    <span className="text-muted text-xs font-normal">per month</span>
                </p>

                {property.serviceCharge && (
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <p className="text-sm">
                            Service Charge{" "}
                            <span className="font-medium text-secondary">
                                &#2547;{Number(property.serviceCharge).toLocaleString()}
                            </span>
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <p className="text-sm">
                        Deposit{" "}
                        <span className="font-medium text-secondary">
                            {depositMonths} {depositMonths === 1 ? "month" : "months"}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <GeoAltIcon className="w-5 h-5 text-gray-400" />
                    <p className="text-sm">
                        {[property.address || property.street_address, property.area, property.city].filter(Boolean).join(", ")}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <p className="text-sm">
                        Available from{" "}
                        <span className="font-medium text-secondary">
                            {availabilityDate.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            }).replace(/(\w+)\s(\d+)/, "$1, $2")}
                        </span>
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Property ID</span>
                    <span className="text-secondary font-medium">{property.readablePropertyId || property.id.slice(0, 8).toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}
