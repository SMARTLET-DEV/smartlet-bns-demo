"use client";

import { SmartmoveCircleTickIcon } from "@/assets/icons";
import { Button } from "../ui/button";

const requirements = [
    "Number of items",
    "Distance covered",
    "Number of manpower needed",
];

const ProvideQuotationSection = () => {
    return (
        <div className="container mx-auto px-5">
            <div className="bg-[#f9f9f9] grid lg:grid-cols-2 rounded-xl overflow-hidden">
                <div className="flex flex-col justify-center lg:ps-20 p-5">
                    <p className="text-4xl font-extrabold w-[100%] capitalize whitespace-nowrap">
                        We provide quotations based on
                    </p>
                    <div className="bg-white p-5 rounded-lg my-7 w-fit flex flex-col gap-6">
                        {requirements.map((requirement, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <SmartmoveCircleTickIcon className="w-4 h-4 text-primary" />
                                <p className="text-xl">{requirement}</p>
                            </div>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        className="w-fit border-primary text-primary hover:bg-primary hover:text-white duration-200 font-normal bg-transparent"
                        size="lg"
                        onClick={() => {
                            document
                                .getElementById("request-smartmove-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Get a Quote
                    </Button>
                </div>
                <div className="relative">
                    <img
                        src={"/smartmove-img-2.png"}
                        alt="provide-quotation"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProvideQuotationSection;
