"use client";

import Link from "next/link";

const perks = [
    {
        image: "/why-choose-opendoor/perps/Best in Class Digital Exp (1).png",
        title: (
            <>
        Best in Class <br />
        Digital Experience
            </>
        ),
        targetId: "digital-experience",
    },
    {
        image: "/why-choose-opendoor/perps/Verified Properties (1).png",
        title: (
            <>
        Verified <br />
        Properties
            </>
        ),
        targetId: "verified-listings",
    },
    {
        image: "/why-choose-opendoor/perps/Tenant Screening (1).png",
        title: (
            <>
        Tenant <br />
        Screening
            </>
        ),
        targetId: "renter-screening",
    },
    {
        image: "/why-choose-opendoor/perps/Property Inspection.png",
        title: (
            <>
        Property <br />
        Inspection
            </>
        ),
        targetId: "property-inspection",
    },
    {
        image: "/why-choose-opendoor/perps/End to End Solution (1).png",
        title: (
            <>
        End to End <br />
        Solution
            </>
        ),
        targetId: "end-to-end",
    },
];

export default function OpendoorPerks() {
    return (
        <section className="relative py-12 bg-white">
            <div className="w-full max-w-[1000px] mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 place-items-center">
                    {perks.map((perk, index) => {
                        const encodedImagePath = encodeURI(perk.image);

                        return (
                            <Link href={`#${perk.targetId}`} key={index}>
                                <div
                                    className="relative flex items-end justify-center text-center cursor-pointer transition-transform duration-300 hover:scale-105"
                                    style={{
                                        backgroundImage: `url("${encodedImagePath}")`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        width: "190px",
                                        height: "190px",
                                    }}
                                >
                                    {/* Pure text only — no bg or blur */}
                                    <h3 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#191919] font-normal text-[13px] sm:text-[14px] leading-snug text-center w-[140px]">
                                        {perk.title}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
