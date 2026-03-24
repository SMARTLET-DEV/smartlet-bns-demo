"use client";
import { XIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import RequestModal from "./RequestModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useIsMobile } from "@/hooks/useIsMobile";

const variants = {
    hidden: {
        opacity: 0,
        y: 100,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: 100,
    },
};

export default function HelpSection({ isScrolling }: { isScrolling: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    const isMobile = useIsMobile();
    const isHomeFilterOpen = useSelector(
        (state: RootState) => state.property.propertyModal.homeFilterOpen
    );

    const handleModalToggler = () => {
        setIsModalOpen(true);
    };

    if (hidden || !isScrolling || (isMobile && isHomeFilterOpen)) {
        return null;
    }

    return (
        <motion.section
            className="py-[10px] shadow-2xl w-full bg-[rgba(255,255,255,0.9)]"
            id="help-section"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
        >
            <div className="container px-5 lg:px-0 mx-auto flex flex-col md:flex-row items-start  justify-center gap-x-10">
                <div className="text-left">
                    <h2 className="text-lg font-normal text-gray-900">
                        Rent with OPENDOOR -{" "}
                        <span className="font-normal">It&apos;s free!</span>
                    </h2>
                </div>
                <div className="w-full md:w-auto">
                    <Button
                        variant="link"
                        onClick={handleModalToggler}
                        className="text-primary p-0 h-fit w-fit text-lg font-normal underline"
                        size="lg"
                    >
                        Make a Request
                    </Button>

                    <RequestModal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
            <Button
                className="absolute top-[50%] translate-y-[-50%] lg:right-[40px] right-[20px] bg-transparent border-black rounded-full p-0 w-fit h-fit"
                variant="outline"
                size="icon"
                onClick={() => setHidden(true)}
            >
                <XIcon className="size-5" />
            </Button>
        </motion.section>
    );
}
