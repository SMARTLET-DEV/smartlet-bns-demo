"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function MissionFrame() {
    return (
        <section className="bg-white w-full">
            <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Mission */}
                <Card className="relative overflow-hidden rounded-none border border-[#E9E9E9] shadow-none aspect-square md:aspect-auto md:h-[550px]">
                    <div className="absolute inset-0">
                        <Image
                            src="/about/mission_vision/mission.png"
                            alt="Mission background"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Light overlay for balance */}
                    <div className="absolute inset-0 bg-black/40 md:bg-black/30" />

                    <CardContent className="relative z-10 flex flex-col justify-start h-full px-6 md:px-8 lg:px-10 py-5">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3 text-white">
              Our Mission
                        </h2>
                        <p className="text-white text-base sm:text-lg leading-relaxed max-w-xl font-light">
              To simplify the property rental and relocation journey in
              Bangladesh by creating systems and services that offer real value,
              unmatched convenience, and fairness to all parties involved.
                        </p>
                    </CardContent>
                </Card>

                {/* Vision */}
                <Card className="relative overflow-hidden rounded-none border border-[#E9E9E9] shadow-none aspect-square md:aspect-auto md:h-[550px]">
                    <div className="absolute inset-0">
                        <Image
                            src="/about/mission_vision/vision.png"
                            alt="Vision background"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Light overlay for readability */}
                    <div className="absolute inset-0 bg-black/20 md:bg-black/10" />

                    <CardContent className="relative z-10 flex flex-col justify-end h-full px-6 md:px-8 lg:px-10 py-5">
                        <p className="text-white text-base sm:text-lg leading-relaxed max-w-xl text-right mb-3 ml-auto font-light">
              To be the platform that transforms urban living in Bangladesh —
              where every rental experience is effortless, secure, and dignified.
                        </p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-right text-white">
              Our Vision
                        </h2>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
