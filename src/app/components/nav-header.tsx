import { Home, Briefcase, Bell, Search, Menu } from "lucide-react";
import { IMAGES, type Screen } from "./types";
import { useState, useRef, useEffect } from "react";

interface NavHeaderProps {
  activeScreen: Screen;
  setActiveScreen: (s: Screen) => void;
  onToggleDrawer: () => void;
  onNavigateToProfile: () => void;
  currentMode: "professional" | "market";
  profilePhoto: string;
}

export function NavHeader({
  activeScreen,
  setActiveScreen,
  onToggleDrawer,
  onNavigateToProfile,
  currentMode,
  profilePhoto,
}: NavHeaderProps) {
  const isProfessional = currentMode === "professional";
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleModeToggle = () => {
    if (isProfessional) {
      setActiveScreen("marketplace");
    } else {
      setActiveScreen("dashboard");
    }
  };

  const professionalNotifications = [
    { id: "1", title: "New job match", message: "Google is hiring Senior React Developer", time: "2h ago", unread: true },
    { id: "2", title: "Connection request", message: "Alex Kumar wants to connect", time: "5h ago", unread: true },
    { id: "3", title: "Post engagement", message: "12 people liked your recent post", time: "1d ago", unread: false },
    { id: "4", title: "Profile view", message: "Your profile was viewed 24 times this week", time: "2d ago", unread: false },
  ];

  const marketNotifications = [
    { id: "1", title: "New gig nearby", message: "Delivery driver needed - ₹500/day", time: "1h ago", unread: true },
    { id: "2", title: "Application update", message: "Your application for Sales Associate was viewed", time: "3h ago", unread: true },
    { id: "3", title: "Gig reminder", message: "Your shift starts in 2 hours", time: "2h ago", unread: false },
    { id: "4", title: "Payment received", message: "₹800 credited to your account", time: "1d ago", unread: false },
  ];

  const notifications = isProfessional ? professionalNotifications : marketNotifications;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = () => {
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-4">
        {/* Hamburger */}
        {activeScreen !== "settings" && (
          <button
            onClick={onToggleDrawer}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Logo & Title */}
        <button onClick={() => setActiveScreen(isProfessional ? "dashboard" : "marketplace")} className="flex items-center gap-2 mr-auto">
          <img src={IMAGES.logo} alt="In-Folio" className="w-8 h-8" />
          <span style={{ fontSize: 20, fontWeight: 700 }} className="text-purple-700 hidden sm:block">
            In-Folio
          </span>
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={isProfessional ? "Search jobs, people, posts..." : "Search gigs, services..."}
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Mode toggle */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-full p-1">
          <button
            onClick={handleModeToggle}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] transition-all ${
              isProfessional ? "bg-purple-600 text-white" : "text-gray-600"
            }`}
            style={{ fontWeight: 600 }}
          >
            Professional
          </button>
          <button
            onClick={handleModeToggle}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] transition-all ${
              !isProfessional ? "bg-pink-500 text-white" : "text-gray-600"
            }`}
            style={{ fontWeight: 600 }}
          >
            Market
          </button>
        </div>

        {/* Nav Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavIcon
            icon={<Home className="w-5 h-5" />}
            active={activeScreen === "dashboard" || activeScreen === "marketplace"}
            onClick={() => setActiveScreen(isProfessional ? "dashboard" : "marketplace")}
            label="Home"
          />
          <NavIcon
            icon={<Briefcase className="w-5 h-5" />}
            active={activeScreen === "jobs" || activeScreen === "gigs"}
            onClick={() => setActiveScreen(isProfessional ? "jobs" : "gigs")}
            label={isProfessional ? "Jobs" : "Gigs"}
          />
          <NavIcon
            icon={<Bell className="w-5 h-5" />}
            active={showNotifications}
            onClick={handleNotificationClick}
            label="Notifications"
          />
        </div>

        {/* Profile pic */}
        <button
          onClick={onNavigateToProfile}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition-colors shrink-0"
        >
          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div
          ref={notificationRef}
          className="absolute right-16 top-14 bg-white border border-gray-200 shadow-lg rounded-lg w-80 z-50"
        >
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 flex items-center gap-3 ${
                  notification.unread ? "bg-gray-100" : "bg-white"
                }`}
              >
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <button className="text-sm font-medium text-gray-900" onClick={handleMarkAsRead}>Mark all as read</button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavIcon({
  icon,
  active,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
        active ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label={label}
    >
      {icon}
      <span className="text-[10px] mt-0.5">{label}</span>
    </button>
  );
}