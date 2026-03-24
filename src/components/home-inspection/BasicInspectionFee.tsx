"use client";

import { SmartmoveCircleTickIcon } from "@/assets/icons";
import { Button } from "../ui/button";

const texts = [
    "Photographed and timestamped inspection report",
    "Detailed documentation of each appliance or fixture",
    "Digital PDF report accessible anytime",
    "Verified by trained OPENDOOR Inspectors",
];

const BasicInspectionFeeSection = () => {
    return (
        <div className="py-10 container mx-auto px-5">
            <div
                className="rounded-xl relative w-full overflow-hidden lg:px-10 py-30 px-5"
                style={{
                    background: "url('/home-inspection-bg-img-1.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Whitish overlay */}
                <div className="absolute inset-0 rounded-xl bg-white/40"></div>
                <div className="grid lg:grid-cols-2 gap-10 relative z-10">
                    <div className="">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-light">
                            Basic Inspection Fee
                        </p>
                        <p className="text-2xl sm:text-3xl font-light mt-10">
                            <span className="text-base font-normal">BDT</span>{" "}
                            5,000
                        </p>
                        <Button
                            variant="outline"
                            className="w-fit border-primary text-primary hover:bg-primary hover:text-white duration-200 font-normal mt-3 bg-transparent"
                            size="lg"
                            onClick={() => {
                                document
                                    .getElementById(
                                        "request-home-inspection-form"
                                    )
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Book Now
                        </Button>
                    </div>
                    <div  
                        className="p-5 flex flex-col gap-5"
                        style={{
                            borderRadius: "16px",
                            background: "rgba(255, 255, 255)",
                        }}
                    >
                        {texts.map((text, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <SmartmoveCircleTickIcon className="w-6 h-6 text-primary" />
                                <p className="text-base sm:text-lg font-light text-gray-700">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInspectionFeeSection;
