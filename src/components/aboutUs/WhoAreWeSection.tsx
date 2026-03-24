'use client'

import Image from 'next/image'

const WhoWeAreSection = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-5">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-10">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black dark:text-white leading-tight tracking-tight">
              Who We Are
            </h1>
            <p className="text-[#5A5A5A]">
OPENDOOR is here to make renting homes, and managing properties in Dhaka easier, smoother, and honestly way better than it’s ever been. The current rental experience is mostly chaotic and outdated, so we built something better: a platform that puts people first and takes the stress out of the rental process. We believe Dhaka deserves better. Better options, smoother processes, and the kind of support renters and property owners can actually rely on.             </p> 
            <p className="text-[#5A5A5A]">
Behind OPENDOOR is a team that’s value-driven and positively obsessed with doing what they do best creating real impact through thoughtful systems, honest service, and smart design. We care deeply about doing things right, not just fast, and we’re here to set a new standard in how renting should feel.            </p> 
            
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Image
              src="/about/about.gif"
              alt="About OPENDOOR"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoWeAreSection
