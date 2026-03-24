"use client";

import Image from "next/image";

export default function PhilosophySection() {
    return (
        <section id="philosophy-section" className="w-full bg-white py-16">
            <div className="container mx-auto px-5 flex flex-col lg:flex-row items-start justify-between gap-16">
                {/* Text Column */}
                <div className="lg:w-5/12 text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-6">Our Philosophy</h2>
                    <p className="text-[#5A5A5A] mb-4 text-base leading-relaxed">
At OPENDOOR, we don&apos;t just build features, we build for people. We believe that behind every service request, rental agreement, or moving box is a story that matters. That&apos;s why everything we do is guided by empathy, efficiency, and the belief that simple, well-built systems can unlock massive value for people&apos;s everyday lives.                    </p>
                    <p className="text-[#5A5A5A] mb-6 text-base leading-relaxed">
We&apos;re here to prove that meaningful change can be made, even in industries that feel stuck. We do it by asking better questions, hiring incredible people, and committing to actions that move us  and our beloved city forward.                    </p>
                </div>

                {/* Image Column */}
                <div className="relative h-[390px] w-full max-w-[575px] lg:w-[575px]">
                    <Image
                        src="/philosophy.jpg"
                        alt="Philosophy"
                        fill
                        className="object-cover rounded-xl"
                    />
                </div>
            </div>
        </section>
    );
}
