import { useState, useEffect } from "react";
import { HomeAfterLogin01 } from "./01_01_Home_afterlogin_01";
import { HomeAfterLogin02 } from "./01_01_Home_afterlogin_02";

// This component decides which home screen to show based on booking status
export function HomeAfterLogin() {
  const [hasBooking, setHasBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a booking
    const savedBooking = localStorage.getItem("sakuraco_current_booking");
    setHasBooking(!!savedBooking);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Show post-booking home if user has a booking, otherwise show event browsing
  return hasBooking ? <HomeAfterLogin02 /> : <HomeAfterLogin01 />;
}
