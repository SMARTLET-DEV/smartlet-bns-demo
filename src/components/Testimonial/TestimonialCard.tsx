import Image from "next/image";
import { UserIcon } from "@/assets/icons";
import React from "react";

interface TestimonialCardProps {
    rate: number;
    text: string;
    name: string;
    dp?: string;
    designation: string;
    className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
    rate,
    text,
    name,
    dp,
    designation,
    className = "",
}) => {
    const totalStars = 5;

    return (
        <div
            className={` h-full min-w-85 lg:min-w-80 px-6 py-9 rounded-xl border bg-white flex flex-col items-center sm:items-start text-center sm:text-left`}
        >
            <p className="text-muted mb-1 font-light mt-3 flex-grow italic">
                “{text}”
            </p>

            <div className="mt-5 flex items-center gap-3">
                {dp ? (
                    <div className="w-12 h-12 rounded-full border-2 border-primary/100 flex items-center justify-center overflow-hidden">
                        <Image
                            src={dp}
                            alt={name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-muted" />
                    </div>
                )}
                <div className="text-left">   {/* <-- force left alignment */}
                    <h4 className="font-normal text-secondary">{name}</h4>
                    <p className="text-muted text-base font-normal">{designation}</p>
                </div>
            </div>
        </div>
    );
};
