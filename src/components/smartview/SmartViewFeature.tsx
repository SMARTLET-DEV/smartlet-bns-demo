import React from "react";
import Image from "next/image";

interface FeatureCardProps {
  src: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function FeatureCard({ src, title, children, className = "" }: FeatureCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_32px_rgba(44,48,71,0.10)] px-6 py-4 flex flex-col items-start gap-3 h-full ${className}`}
    >
      {/* Illustration */}
      <div className="flex items-center justify-center w-20 h-20">
        <Image
          src={src}
          alt={title}
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      <h4 className="font-light text-xl text-[#252525] mb-1">{title}</h4>

      <div className="text-[#767676] text-[1rem] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function SmartViewFeature() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-5">
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12"
          style={{ minHeight: 600 }}
        >
          {/* Left Column */}
          <div className="flex flex-col items-start min-w-[350px] max-w-[420px] flex-shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#191919] leading-snug tracking-tight mb-0">
                  smartVIEW
                </div>
                <div className="text-base text-[#767676] font-light mt-1">
                  See Before You Step In
                </div>
              </div>
            </div>

            <div className="mt-7 text-[#767676] text-[1rem] leading-relaxed">
              <span className="font-normal">
                Visualize your future home like never before with smartVIEW,
              </span>{" "}
              our proprietary property showcase feature designed to transform
              how you explore rental spaces. By combining high-definition
              visuals with cutting-edge technology, smartVIEW offers a truly
              immersive experience that goes beyond photos—bringing each
              property to life in stunning detail.
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch flex-1 min-w-[340px] max-w-[720px] w-full">
            <div className="md:col-span-2">
              <FeatureCard src="/smartview/360 Virtual Tours.png" title="360° Virtual Tours">
                Move through each room as if you’re physically there. Explore
                kitchens, balconies, living rooms, and even bathrooms from your
                mobile or laptop.
              </FeatureCard>
            </div>

            <div className="h-full">
              <FeatureCard src="/smartview/High-Quality Images.png" title="High-Quality Images">
                Each listing is photographed professionally, capturing the
                lighting, space, and ambience so you know exactly what to
                expect.
              </FeatureCard>
            </div>

            <div className="h-full">
              <FeatureCard src="/smartview/Immersive Exp.png" title="Immersive Experience">
                No surprises. No guesswork. With smartVIEW, renters gain a
                complete, realistic perspective of their future home—enabling
                smarter and more confident rental decisions, especially when
                you’re unable to physically visit a property.
              </FeatureCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
