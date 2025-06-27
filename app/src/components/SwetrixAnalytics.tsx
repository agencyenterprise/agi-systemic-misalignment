import { useEffect } from "react";
import * as Swetrix from "swetrix";

const SWETRIX_PROJECT_ID = "OyJDDgyVvP66";

const SwetrixAnalytics = () => {
  useEffect(() => {
    // Initialize Swetrix with the project ID
    Swetrix.init(SWETRIX_PROJECT_ID, {
      devMode: process.env.NODE_ENV === "development",
    });

    // Track the initial page view
    Swetrix.trackViews();

    // Clean up function
    return () => {
      // Swetrix doesn't require explicit cleanup
    };
  }, []);

  // Track route changes for SPA navigation
  useEffect(() => {
    const handleLocationChange = () => {
      Swetrix.trackViews();
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", handleLocationChange);

    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleLocationChange, 0);
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleLocationChange, 0);
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default SwetrixAnalytics;
