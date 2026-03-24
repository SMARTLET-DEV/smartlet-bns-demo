"use client";

import { FaqOptions } from "./FaqOptions";

export function FaqHero() {
  return (
    <section className="w-full flex flex-col min-h-[250px] md:min-h-[500px] bg-white border-b border-black bg-[url(/faq/FAQ%20Hero%20Image%20%28New%29.png)] bg-no-repeat bg-[right_bottom] bg-[length:280px_auto] md:bg-[78%_bottom] md:bg-[length:600px_auto]">
      <div className="container mx-auto px-5 flex-1 flex flex-col pt-0 md:pt-0">
        <div className="flex-1 flex items-center pt-0 md:pt-0 md:items-center justify-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight text-left pl-0 md:pl-44">
            <span className="md:hidden">Frequently<br />Asked<br />Questions</span>
            <span className="hidden md:inline">Frequently Asked<br />Questions</span>
          </h1>
        </div>

        {/* Tabs positioned at the absolute bottom with no gaps */}
        <div className="flex justify-center mt-auto">
          <FaqOptions />
        </div>
      </div>
    </section>
  );
}
