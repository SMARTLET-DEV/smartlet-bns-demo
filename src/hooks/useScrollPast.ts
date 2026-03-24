import { RefObject, useEffect, useState } from "react";

/**
 * Detects if an element has been scrolled past a given percentage of its height.
 * @param targetRef Ref to the target element
 * @param percent Number (0-100) indicating how much should be scrolled past
 */
const useScrollPast = (
    targetRef: RefObject<HTMLElement | null>,
    percent: number,
    immediateDisconnect: boolean = false
): boolean => {
    const [scrolledPast, setScrolledPast] = useState(false);

    useEffect(() => {
        if (!targetRef.current || percent < 0 || percent > 100) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const ratio = entry.intersectionRatio;
                // If visible ratio is less than what's expected, it has been scrolled past
                const isPast = ratio < 1 - percent / 100;
                setScrolledPast(isPast);
                if (isPast && immediateDisconnect) {
                    observer.disconnect();
                }
            },
            {
                threshold: Array.from({ length: 101 }, (_, i) => i / 100), // from 0 to 1
            }
        );

        observer.observe(targetRef.current);

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current);
        };
    }, [targetRef, percent]);

    return scrolledPast;
};

export default useScrollPast;
