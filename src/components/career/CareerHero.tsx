import Image from "next/image";

export function CareerHero() {
    return (
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#fff6f6] pt-16 sm:pt-20 pb-0">
            <div className="container mx-auto px-5 text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-wide text-gray-900 mb-4">
          JOIN US
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4">
          as We Build the Future of Renting
                </h2>
                <p className="text-gray-700 max-w-xl mx-auto text-base sm:text-lg font-light">
          OPENDOOR is built upon two core principles: Quality and Fairness
                </p>
            </div>

            {/* Hero Image - Full Width */}
            <div className="relative w-full mt-12">
                <Image
                    src="/careers/Careers Hero Final.png"
                    alt="Careers at OPENDOOR"
                    width={1920}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority
                />
            </div>
        </section>
    );
}
