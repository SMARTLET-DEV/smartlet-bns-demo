"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/utils/scrollToTop";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-2 md:right-6 top-1/6 transform -translate-y-1/2 bg-red-100 text-red-500 px-2.5 py-2.5 rounded-lg hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer hidden sm:block"
    >
      <ArrowUp className="w-6 h-6 text-red-500" />
    </button>
  );
}