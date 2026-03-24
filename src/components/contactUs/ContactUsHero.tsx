"use client";

import Image from "next/image";
import ContactCard from "./ContactCard";

export default function ContactUsHero() {
    return (
        <section className="py-18 sm:py-9 w-full bg-white py-1">
            <div className="container mx-auto px-5">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-12">
                    {/* Left: Text + ContactCard */}
                    <div className="mt-0 sm:mt-8 max-w-xl w-full text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6">
              Contact Us
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
              Whether you're a tenant, landlord, or curious collaborator, our team is ready to support your journey — with transparency, care, and solutions that put people first.
                        </p>
                        <div className="w-full max-w-xl flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <ContactCard />
                        </div>
                    </div>

          
                    {/* Right: Image */}
                    <div className="relative w-full lg:w-auto flex justify-center">
                        <Image
                            src="/contact-hero.png"
                            alt="Contact Illustration"
                            width={398}
                            height={290}
                            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[398px] lg:h-[290px] object-contain"
                            priority
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
