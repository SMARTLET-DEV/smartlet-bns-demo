import { RentStatus } from "@/assets/enumerators";
import { useGetAllRentalApplicationsQuery } from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { useGetRentedPropertyQuery } from "@/redux/reducers/rented-property/RentedPropertyApi";
import { useEffect, useState } from "react";
import SingleRentalApplication from "./SingleRentalApplication";
import SingleRentedProperty from "./SingleRentedProperty";

const RentalPropertyList = () => {
    const { data: allApplications, isLoading } =
        useGetAllRentalApplicationsQuery();
    const { data: rentedProperty, isLoading: isRentedPropertyLoading } =
        useGetRentedPropertyQuery();

    const [filteredApplications, setFilteredApplications] = useState<any[]>([]);

    useEffect(() => {
        if (allApplications) {
            const filtered = allApplications.applications.filter(
                (application: any) =>
                    application.propertyId !==
                        rentedProperty?.active?.propertyId &&
                    application.status !== RentStatus.CANCELLED
            );
            setFilteredApplications(filtered);
        }
    }, [allApplications, rentedProperty]);

    if (isLoading || isRentedPropertyLoading) {
        return <div>Loading...</div>;
    }

    if (filteredApplications.length === 0 && !rentedProperty?.active) {
        return (
            <p className="text-muted text-center text-xl">
                No applications found!
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {rentedProperty?.active && (
                <div className="pb-5 border-b-2 border-card border-dotted">
                    <p className="mb-2 text-lg">Rented Property</p>
                    <SingleRentedProperty
                        key={rentedProperty?.active.id}
                        property={rentedProperty?.active}
                    />
                </div>
            )}
            {filteredApplications.length > 0 && (
                <div>
                    <p className="mb-2 text-lg">Rental Applications</p>
                    <div className="flex flex-col gap-4">
                        {filteredApplications?.map((application: any) => (
                            <SingleRentalApplication
                                key={application.id}
                                application={application}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentalPropertyList;
