"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import ListingRequestModal from "../navbar/ListingRequestModal";

export default function ExploreServices() {
  const [showListingRequestModal, setShowListingRequestModal] = useState(false);

  // Buttons JSX to reuse in both layouts
  const buttons = (
    <div className="px-2 flex flex-col sm:flex-row justify-center items-center gap-4">
      <Button
        asChild
        variant="outline"
        size="lg"
        className="w-fit border-primary text-black hover:bg-primary hover:text-white duration-200 font-normal bg-transparent"
      >
        <Link href="/residential/apartments-for-rent">Browse Properties</Link>
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-fit border-primary text-black hover:bg-primary hover:text-white duration-200 font-normal bg-transparent"
        onClick={() => setShowListingRequestModal(true)}
      >
        Add a Property
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <section
        className="relative w-full flex items-start justify-center bg-white bg-center bg-no-repeat bg-[length:100%_auto] sm:hidden h-[30vh] mt-12"
        style={{
          backgroundImage: "url('/explore-services/Explore_Our_Services_(New).png')",
          backgroundPosition: "center bottom",
        }}
      >
        <div className="relative text-center px-4 pt-12">
          <h2 className="text-2xl font-light text-black mb-6 leading-tight">
            Explore Our Services
          </h2>
          {buttons}
        </div>
      </section>

      {/* Desktop Layout */}
      <section
        className="hidden sm:block h-70 bg-white bg-contain bg-center bg-no-repeat relative flex items-start justify-center mt-12"
        style={{
          backgroundImage: "url('/explore-services/Explore_Our_Services_(New).png')",
        }}
      >
        <div className="relative max-w-4xl mx-auto px-4 text-center pt-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-3 leading-tight">
            Explore Our Services
          </h2>
          {buttons}
        </div>
      </section>

      {showListingRequestModal && (
        <ListingRequestModal
          open={showListingRequestModal}
          onClose={() => setShowListingRequestModal(false)}
        />
      )}
    </>
  );
}
