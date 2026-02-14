import { Outlet, useLocation } from "react-router";
import { BottomNavigation } from "./BottomNavigation";

export function RootLayout() {
  const location = useLocation();
  
  // Show bottom navigation only for logged-in screens
  // Include event detail and payment in the logged-in area
  const showBottomNav = [
    "/home",
    "/reservations",
    "/mypage",
  ].includes(location.pathname) || 
  location.pathname.startsWith("/event/");
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? "pb-[calc(56px+env(safe-area-inset-bottom))]" : ""}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}