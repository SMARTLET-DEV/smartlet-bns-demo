"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import PropertyDetailsOverviewModal from "@/components/dashboard/property-list/AddProperty-steps/PropertyDetailsOverviewModal/PropertyDetailsOverviewModal";
import ReviewModal from "@/components/dashboard/property-list/AddProperty-steps/review-submit-Modal/reviewModal";
import ListingSubmittedDialog from "@/components/dashboard/property-list/AddProperty-steps/review-submit-Modal/SubmitDialog";
import AddPropertyDetailsModal from "@/components/dashboard/property-list/Addpropertydetailsmodal";
import AddPropertyDropdown from "@/components/dashboard/property-list/AddPropertyDropdown";
import AdPackageModal from "@/components/dashboard/property-list/AdPackageModal";
import { DashboardPropertyCard } from "@/components/dashboard/property-list/dashboardPropertyCard";
import { DashboardPropertyCardSkeleton } from "@/components/dashboard/property-list/DashboardPropertyCardSkeleton";
import EmptyPropertyState from "@/components/dashboard/property-list/EmptyPropertyPlacehoder";
import PauseListingDialog from "@/components/dashboard/property-list/PauseListingDialog";
import DashboardHeader from "@/components/dashboard/property-list/PropertyListDashboardHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeEndToEndModal } from "@/redux/reducers/listingModal/listingModalSlice";
import { useGetPropertiesByOwnerQuery, useLazyGetSinglePropertyQuery, useUpdatePropertyStatusMutation } from "@/redux/reducers/property/propertyApi";
import { setAddPropertyDetailsModal, setCreatedProperty } from "@/redux/reducers/property/propertySlice";
import { useGetMeQuery } from "@/redux/reducers/user/userApi";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { useState } from "react";


const PropertyListPage = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const cardLayout = isMobile ? "vertical" : "horizontal";
  const dispatch=useAppDispatch();
  const { data } = useGetMeQuery();
  const user = data?.user;
  const userId= user?.id;
  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "";

  const [dropdownOpen, setDropdownOpen] = useState(false); // controls the dropdown menu
  const [modalOpen, setModalOpen] = useState(false); // controls the modal
  const [propertyType, setPropertyType] = useState<"RESIDENTIAL" | "COMMERCIAL" | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false); 
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [updatePropertyStatus] = useUpdatePropertyStatusMutation();
  const { success, error } = useToast();
  const [selectedPropertyPauseStatus, setSelectedPropertyPauseStatus] = useState<boolean>(false);
  const [reviewCameFromOverview, setReviewCameFromOverview] = useState(false);
  const selectedPackage = useAppSelector((state) => state.listingModal.listingOption);
  const [triggerGetProperty] = useLazyGetSinglePropertyQuery();
  const createdPropertyId = useAppSelector((state) => state.property.createdProperty.id);






  const [page, setPage] = useState(1);
  const take = 9;
  const skip = (page - 1) * take;

  const { data: propertyData, isLoading } = useGetPropertiesByOwnerQuery({
    ownerId: userId!,
    skip,
    take,
  }, {
    skip: !userId, 
  });


  const openReviewModalWithFreshData = async (id: string) => {
    try {
      await triggerGetProperty(id).unwrap(); // forcibly refreshes cache
      setReviewOpen(true);
      success("Property data refreshed successfully");
    } catch (err: any) {
      error(err?.data?.message || "Failed to fetch fresh property data for review modal");
      console.error("Failed to fetch fresh property data for review modal", err);
    }
  };

  //console.log("🧑 User ID:", userId);
  //console.log("🏡 Property Data:", propertyData);
  //console.log("📦 Properties:", propertyData?.properties);
  //console.log("⏳ Loading:", isLoading);

  const totalPages = Math.ceil((propertyData?.pagination?.totalCount || 1) / take);

  return (
    <div className="flex-grow container mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <DashboardHeader userRole={userRole} />
        <AddPropertyDropdown
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <DashboardPropertyCardSkeleton key={i} layout={cardLayout} />
          ))}
        </div>
      ) : propertyData?.properties?.length === 0 ? (
        <EmptyPropertyState onStartClick={() => setDropdownOpen(true)} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mr-1">
            {propertyData?.properties.map((property) => (
              <DashboardPropertyCard
                key={property.id}
                images={property.media}
                label={property.viewStatus}
                title={property.title}
                location={property.address}
                bed={property.bedrooms}
                bath={property.bathrooms}
                floorsqft={property.size}
                rent={property.price}
                layout={cardLayout}
                isPaused={property.isPaused} 
                ownerId={property.ownerId}
                packageType={property.package}
                onPauseClick={() => {
                  setSelectedPropertyId(property.id);
                  setPauseModalOpen(true);
                  setSelectedPropertyPauseStatus(property.isPaused);
                }}
                propertyId={property.id}
                onEditClick={(id) => {
                  dispatch(setCreatedProperty({ id }));
                  setOverviewOpen(true);
                }}
                viewStatus={property.viewStatus}
                onViewClick={(status, id) => {
                  if (status === "APPROVED") {
                    dispatch(setCreatedProperty({ id }));
                    setReviewCameFromOverview(false);
                    setReviewOpen(true);
                  } else {
                    dispatch(setCreatedProperty({ id }));
                    setOverviewOpen(true);
                  }
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            {/* Previous */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            {(() => {
              const paginationItems = [];
              let leftEllipsisShown = false;
              let rightEllipsisShown = false;

              for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const isCurrent = pageNum === page;
                const isEdge = pageNum === 1 || pageNum === totalPages;
                const isNearCurrent = Math.abs(pageNum - page) <= 1;

                if (isEdge || isNearCurrent) {
                  paginationItems.push(
                    <Button
                      key={pageNum}
                      variant={isCurrent ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="w-9 px-0 text-sm"
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (!leftEllipsisShown && pageNum < page - 1) {
                  paginationItems.push(
                    <span key="left-ellipsis" className="text-muted text-sm px-2">
                      ...
                    </span>
                  );
                  leftEllipsisShown = true;
                } else if (!rightEllipsisShown && pageNum > page + 1) {
                  paginationItems.push(
                    <span key="right-ellipsis" className="text-muted text-sm px-2">
                      ...
                    </span>
                  );
                  rightEllipsisShown = true;
                }
              }

              return paginationItems;
            })()}


            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

        </>
      )}

      {/*<DashboardPropertyCardSkeleton layout={cardLayout}/>*/}


      <AdPackageModal/>
      <AddPropertyDetailsModal
        open={useAppSelector((state) => state.listingModal.isEndToEndModalOpen)}
        onClose={() => dispatch(closeEndToEndModal())}
        onContinue={() => {
          dispatch(setAddPropertyDetailsModal(false));
          dispatch(closeEndToEndModal());
          setReviewCameFromOverview(true);
          openReviewModalWithFreshData(createdPropertyId);
        }}
        title="Post to Avail End-to-End Service"
        propertyType={propertyType!}
        packageType={selectedPackage!}
        userId={userId!}
      />

      <PropertyDetailsOverviewModal
        open={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        onContinue={() => {
          setOverviewOpen(false);
          setReviewCameFromOverview(true); 
          openReviewModalWithFreshData(createdPropertyId); 
        }}
        title="Property Overview"
        propertyType={propertyType!}
        userId={userId!}
      />
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onContinue={() => {
          setReviewOpen(false);
          if (reviewCameFromOverview) {
            setShowSubmittedModal(true);
          }
        }}
        title="Property Details Overview"
      />
      {showSubmittedModal && <ListingSubmittedDialog />}
      {pauseModalOpen && selectedPropertyId && (
        <PauseListingDialog
          open={pauseModalOpen}
          onClose={() => setPauseModalOpen(false)}
          mode={selectedPropertyPauseStatus ? "unpause" : "pause"}
          onConfirm={async () => {
            try {
              const response = await updatePropertyStatus({
                id: selectedPropertyId!,
                data: { isPaused: !selectedPropertyPauseStatus }, // <-- flip value
              }).unwrap();

              const statusText = !selectedPropertyPauseStatus ? 'paused' : 'resumed';
              success(`Property ${statusText} successfully`);
              setPauseModalOpen(false);
              window.location.reload();
            } catch (err: any) {
              error(err?.data?.message || "Failed to update pause status");
              console.error("❌ Failed to update pause status:", err);
            }
          }}
        />
      )}
    </div>

  );
};

export default PropertyListPage;
