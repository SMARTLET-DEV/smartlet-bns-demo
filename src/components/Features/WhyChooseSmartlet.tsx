"use client";
import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  {
    illustration: "/why-choose-opendoor/section/Best in Class Digital Experience.png",
    title: (
      <>
        Best in Class <br />
        Digital Experience
      </>
    ),
    desc: "Superior image quality and step-by-step rental flow offer a seamless, user-friendly experience - from discovery to deal.",
    sectionId: "digital-experience",
  },
  {
    illustration: "/why-choose-opendoor/section/Verified Properties (2).png",
    title: (
      <>
        Verified <br />
        Properties
      </>
    ),
    desc: "Every listing is verified for accuracy and authenticity, ensuring tenants see only real, trustworthy properties.",
    sectionId: "verified-listings",
  },
  {
    illustration: "/why-choose-opendoor/section/Tenant Verification.png",
    title: (
      <>
        Tenant <br />
        Screening
      </>
    ),
    desc: "Secured rentals by verifying tenant documents, protecting homeowners from risks and providing a smoother approval process.",
    sectionId: "renter-screening",
  },
  {
    illustration: "/why-choose-opendoor/section/Property Inspection (1).png",
    title: (
      <>
        Property <br />
        Inspection
      </>
    ),
    desc: "A fair, photo-documented inspection to protect both tenants and homeowners from future disputes.",
    sectionId: "property-inspection",
  },
  {
    illustration: "/why-choose-opendoor/section/End to End Solution (2).png",
    title: (
      <>
        End to End <br />
        Solution
      </>
    ),
    desc: "The entire rental process - from listing to move-in is ensured with a seamless, hassle-free experience for both tenants and homeowners.",
    sectionId: "end-to-end",
  },
];

export default function WhyChooseSmartLET() {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10 sm:mb-12">
          Why Choose OPENDOOR
        </h1>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0 sm:gap-8 mb-10 sm:mb-12">
          {features.map((feature, idx) => (
            <a
              key={idx}
              href={`/why-choose-opendoor#${feature.sectionId}`}
              className="flex flex-col items-center text-center p-0 sm:p-6 rounded-xl cursor-pointer bg-white transition-transform hover:scale-[1.02]"
            >
              <div
                className="flex items-center justify-center mb-1 sm:mb-4"
                style={{
                  width: "180px",
                  height: "180px",
                }}
              >
                <Image
                  src={feature.illustration}
                  alt={
                    typeof feature.title === "string"
                      ? feature.title
                      : "Feature illustration"
                  }
                  className="object-contain w-[160px] h-[160px] sm:w-[140px] sm:h-[140px]"
                  width={180}
                  height={180}
                />
              </div>

              <h3 className="text-base sm:text-lg font-light mb-1 sm:mb-2 max-w-44 -mt-2 sm:-mt-4">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-[14px] sm:text-[15px] font-light max-w-[230px] mx-auto leading-relaxed">
                {feature.desc}
              </p>
            </a>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="flex justify-center">
          <Button
            className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-10 sm:py-6 text-base"
            size="lg"
            asChild
          >
            <a href="/why-choose-opendoor">Learn More</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
