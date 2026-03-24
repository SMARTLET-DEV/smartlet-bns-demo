import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateSize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        updateSize(); // initial run
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [breakpoint]);

    return isMobile;
}
