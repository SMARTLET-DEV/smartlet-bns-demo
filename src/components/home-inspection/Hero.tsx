"use client";

import Image from "next/image";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="w-full pt-3 pb-12 bg-white">
      <div className="container mx-auto px-5">

        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-10">

          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">

            {/* Desktop Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black dark:text-white leading-tight tracking-tight">
              Home Inspection
            </h1>
            <p className="text-base sm:text-lg font-light text-gray-700">
              A detailed, timestamped photo inspection of your property covering
              every room, fixture, appliance, and outlet with documented
              condition reports.
              <br /> <br />
              Trusted by renters and homeowners to prevent disputes and protect
              deposits.
            </p>

            <Button
              variant="outline"
              className="w-fit border-primary text-primary hover:bg-primary hover:text-white duration-200 font-normal bg-transparent"
              size="lg"
              onClick={() => {
                document
                  .getElementById("request-home-inspection-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book A Home Inspection
            </Button>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={"/home_inspection/home_inspection.jpeg"}
              alt="hero"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
