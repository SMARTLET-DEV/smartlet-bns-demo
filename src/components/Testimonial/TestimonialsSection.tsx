"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
    {
        name: "Dr. Md. Mamun-Or-Rashid",
        designation: "Professor, University Of Dhaka",
        rate: 5,
        dp: "https://res.cloudinary.com/dk6zyje9t/image/upload/v1756124559/509423577_4829338033958541_8381933457894741807_n_j1cbjc.jpg",
        text: "OPENDOOR is using technology in a smart and meaningful way. The platform is well-designed and clearly ahead of what’s commonly seen in our rental market. I truly believe it can make renting easier and better for everyone in the long run.",
    },
    {
        name: "Farhat Khandaker",
        designation: "Architect, Kaleek Consultants Ltd.",
        rate: 4,
        dp: "https://res.cloudinary.com/dk6zyje9t/image/upload/v1756125838/WhatsApp_Image_2025-08-25_at_18.41.12_q4dubr.jpg",
        text: "There’s a huge gap between property owners, renters, and agents — especially in how things are communicated and managed. I’ve seen how unstructured this space can be. OPENDOOR brings much-needed professionalism and bridges that gap with a clear, user-friendly system. This could change how people experience renting in Dhaka.",
    },
    {
        name: "Kazi AR Rafiur Rahman",
        designation: "Managing Director, Kaleek Consultants Ltd.",
        rate: 4,
        dp: "https://res.cloudinary.com/dk6zyje9t/image/upload/v1756125836/1697052383986_vuny7p.jpg",
        text: "OPENDOOR is a breath of fresh air for Dhaka's property market. The conventional rental process remains chaotic and stressful, but this platform has finally introduced a level of professionalism and efficiency that is long overdue. Having spent the last 12 years building a career around creating beautiful and functional spaces, I'm genuinely impressed that OPENDOOR has developed a system that finally complements the quality of our city's properties."},
    {
        name: "Golam Rabbany",
        designation: "Senior Lecturer, Daffodil International University",
        rate: 4.5,
        dp: "https://res.cloudinary.com/dk6zyje9t/image/upload/v1756126056/WhatsApp_Image_2025-08-25_at_18.40.46_am4r0f.jpg",
        text: "OPENDOOR is solving a very real problem with an approach that's both technically thoughtful and socially relevant. It’s rare to see such clarity in both execution and vision at this early stage.",
    },
];

export const TestimonialsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const updateCardsPerPage = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setCardsPerPage(1);
                setIsMobile(true);
            } else {
                setCardsPerPage(2);
                setIsMobile(false);
            }
        };

        updateCardsPerPage();
        window.addEventListener("resize", updateCardsPerPage);
        return () => window.removeEventListener("resize", updateCardsPerPage);
    }, []);

    const maxSlide = Math.max(testimonials.length - cardsPerPage, 0);
    const pageCount = Math.ceil(testimonials.length / cardsPerPage);

    const handlePrev = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const threshold = 50;
        if (touchStartX.current - touchEndX.current > threshold) handleNext();
        if (touchEndX.current - touchStartX.current > threshold) handlePrev();
    };

    return (
        <section className="py-20 w-full bg-white">
            {/* Header */}
            <div className="container mx-auto px-5 flex items-center justify-between mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light">From people like you</h2>

                {!isMobile && (
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            className="rounded-sm border shadow p-0"
                            onClick={handlePrev}
                            disabled={currentSlide === 0}
                            size={"icon"}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-sm border shadow p-0"
                            onClick={handleNext}
                            disabled={currentSlide === maxSlide - 1}
                            size={"icon"}
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Slider */}
            <div
                className="container mx-auto px-5 flex flex-col items-center gap-8"
                onTouchStart={isMobile ? handleTouchStart : undefined}
                onTouchMove={isMobile ? handleTouchMove : undefined}
                onTouchEnd={isMobile ? handleTouchEnd : undefined}
            >
                <div className="overflow-hidden w-full">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${
                                (100 / pageCount) * currentSlide
                            }%)`,
                            width: `${
                                (100 / cardsPerPage) * testimonials.length
                            }%`,
                        }}
                    >
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={idx}
                                //className="pe-3 ps-3 md:ps-0 -ml-1 sm:ml-1 sm:p-3"
                                className="px-0 sm:px-3"
                                style={{
                                    width: `${100 / testimonials.length}%`,
                                    flexShrink: 0,
                                }}
                            >
                                <TestimonialCard {...testimonial} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex gap-2 mt-4">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={cn(
                                "h-2 rounded-full transition-all focus:outline-none",
                                i === currentSlide
                                    ? "bg-primary w-5"
                                    : "bg-background border border-muted w-2"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};