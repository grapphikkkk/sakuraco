import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { BottomNavigation } from "./BottomNavigation";

export function RootLayout() {
  const location = useLocation();
  
  // Scroll to top and reset zoom on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Reset zoom level on mobile (iOS Safari)
    document.documentElement.style.zoom = '1';
  }, [location.pathname]);
  
  // Show bottom navigation only for logged-in screens
  // Include event detail and payment in the logged-in area
  const showBottomNav = [
    "/home",
    "/reservations",
    "/mypage",
  ].includes(location.pathname) || 
  location.pathname.startsWith("/event/");
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? "pb-[calc(56px+env(safe-area-inset-bottom))]" : ""}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}