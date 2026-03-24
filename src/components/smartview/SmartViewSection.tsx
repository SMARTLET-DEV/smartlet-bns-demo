import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function SmartViewSection() {
    return (
        <section className="w-full bg-white py-16">
            <div className="container mx-auto px-5 flex flex-col-reverse lg:flex-row items-center gap-8">
                {/* Left Content */}
                <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-12">
                        Introducing smartVIEW
                    </h2>
                    <p className="text-base sm:text-lg text-muted font-light mb-8 max-w-xl">
                        smartVIEW is our proprietary property showcase feature
                        that provides an immersive and high-definition viewing
                        experience of rental properties.
                    </p>
                    <Button
                        variant="default"
                        className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-10 sm:py-6 text-base"
                        size="lg"
                        asChild
                    >
                        <Link href="/smartview">See More</Link>
                    </Button>
                </div>
                {/* Right: Larger Landscape Image */}
                <div className="flex-[1.3] flex justify-center items-center w-full max-w-4xl aspect-[3/2] md:aspect-[16/9]">
                    <Link href="/smartview" className="cursor-pointer hover:opacity-90 transition-opacity duration-200">
                        <Image
                            src="/smartview.png"
                            alt="smartVIEW feature"
                            className="object-contain rounded-xl w-full h-full"
                            width={900}
                            height={600}
                            priority
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
}
