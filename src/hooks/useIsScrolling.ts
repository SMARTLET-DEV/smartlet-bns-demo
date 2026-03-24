import { useState, useEffect } from 'react';

const useIsScrolling = (): boolean => {
    const [isScrolling, setIsScrolling] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolling(true);
            } else {
                setIsScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isScrolling;
};

export default useIsScrolling;
