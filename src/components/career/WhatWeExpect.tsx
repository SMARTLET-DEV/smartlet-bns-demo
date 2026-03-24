import Image from "next/image";

const coreValues = [
  {
    id: "builders-mindset",
    title: "Builder's Mindset",
    image: "/careers/Builder's Mindset.png",
    description:
      "Take ownership, solve problems others avoid. We admire people with their own individuality - something that makes them different from the crowd.",
  },
  {
    id: "self-drive",
    title: "Self-Drive",
    image: "/careers/Self Drive.png",
    description:
      "Be disciplined in your own unique way. You don't have to be good at everything, you can be great at just one thing, but be absolutely great at it.",
  },
  {
    id: "team-player",
    title: "Team Player",
    image: "/careers/Team Player.png",
    description:
      "Be a team player with an open mindset. Respect others, share your honest opinions, and take feedback as a tool to grow, not as criticism.",
  },
  {
    id: "curiosity",
    title: "Curiosity",
    image: "/careers/Curiosity.png",
    description:
      "Stay curious, keep learning, and never stop improving. We evolve fast, and we expect you to grow with us.",
  },
  {
    id: "integrity",
    title: "Integrity",
    image: "/careers/Integrity.png",
    description:
      "Composure, respect, and honesty define our culture. We value authenticity, people who are grounded yet confident enough to speak their truth.",
  },
];

export function WhatWeExpect() {
  return (
    <section className="w-full bg-[#fff6f6] pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10">
      <div className="container mx-auto px-5">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center text-gray-900 mb-6">
          What We Expect at OPENDOOR
        </h2>
        <p className="text-gray-700 text-center max-w-5xl mx-auto mb-16 text-sm sm:text-base font-light">
          We look for composed, grounded individuals who know how to carry themselves with individuality, purpose, and professionalism.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {coreValues.map((value) => (
            <div key={value.id} className="flex flex-col items-center text-center">
              {/* Pink box with icon only */}
              <div className="bg-[#ffeded] rounded-2xl p-2 sm:p-3 mb-6 w-4/5 aspect-square flex items-center justify-center">
                <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Title outside the box */}
              <h3 className="text-base sm:text-lg font-normal text-gray-900 mb-4">
                {value.title}
              </h3>
              {/* Description outside the box */}
              <p className="text-sm sm:text-base text-gray-700 font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
