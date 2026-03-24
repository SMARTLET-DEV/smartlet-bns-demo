import { useEffect } from 'react';

const useTabReloadListener = () => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "triggerReload") {
        // Reload the page when the flag changes
        window.location.reload();
      }
    };

    // Listen for changes to localStorage across tabs
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
};

export default useTabReloadListener;
