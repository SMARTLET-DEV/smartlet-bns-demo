"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const principles = [
    {
        title: "Do the Right Thing",
        description:
      "We always prioritize what's right for our users with integrity and fairness.",
        bg: "/about/principles_illustrations/Do the Right Thing!.png",
    },
    {
        title: "OPENDOOR is People",
        description:
      "Great teams build great companies. We invest in people before process.",
        bg: "/about/principles_illustrations/OPENDOOR is People.png",
    },
    {
        title: "Be Curious",
        description:
      "We go out of our way to understand problems deeply before we solve them.",
        bg: "/about/principles_illustrations/Be curious.png",
    },
    {
        title: "Own It",
        description:
      "Responsibility is not optional. We take initiative and see things through.",
        bg: "/about/principles_illustrations/Own It.png",
    },
    {
        title: "Simplicity is Power",
        description:
      "We make complex systems feel effortless — for everyone.",
        bg: "/about/principles_illustrations/Simplicity is Power.png",
    },
    {
        title: "Never Settle",
        description:
      "There's always room to improve. And we chase that improvement relentlessly.",
        bg: "/about/principles_illustrations/Never Settle.png",
    },
    {
        title: "Be Bold",
        description:
      "We challenge norms, take risks, and believe in doing what hasn't been done.",
        bg: "/about/principles_illustrations/Be Bold.png",
    },
    {
        title: "Stay Human",
        description:
      "We listen, we empathize, and we value the contributions of others.",
        bg: "/about/principles_illustrations/Stay Human.png",
    },
];

export default function PrinciplesGrid() {
    return (
        <section className="w-full py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-14 text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#191919] leading-tight">
            The Principles We Live By
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {principles.map((p, i) => (
                        <Card
                            key={i}
                            className="relative h-72 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Background Image */}
                            <Image
                                src={p.bg}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Text */}
                            <div className={`relative z-10 h-full flex flex-col px-8 text-black ${
                                i < 4 
                                    ? (i % 2 === 0 ? 'justify-end' : 'justify-start')
                                    : (i % 2 === 0 ? 'justify-start' : 'justify-end')
                            }`}>
                                <h3 className="text-lg font-light mb-2 text-black">{p.title}</h3>
                                <p className="text-base leading-relaxed text-muted">
                                    {p.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
