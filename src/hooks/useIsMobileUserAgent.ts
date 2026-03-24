import { useEffect, useState } from "react";

export function useIsMobileUserAgent(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof navigator !== "undefined") {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        setIsMobile(isMobileDevice);
      }
    };

    checkIsMobile();
  }, []);

  return isMobile;
}
