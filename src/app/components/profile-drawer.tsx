import { X, Home, Briefcase, LayoutDashboard, User, LogOut, BadgeCheck, Settings } from "lucide-react";
import type { Screen, PersonalInfo } from "./types";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profilePhoto: string;
  personalInfo: PersonalInfo;
  setActiveScreen: (s: Screen) => void;
  onNavigateToProfile: () => void;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  profilePhoto,
  personalInfo,
  setActiveScreen,
  onNavigateToProfile,
}: ProfileDrawerProps) {
  const navigate = (screen: Screen) => {
    setActiveScreen(screen);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile section */}
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() => {
              onNavigateToProfile();
              onClose();
            }}
            className="flex flex-col items-center text-center w-full"
          >
            <img
              src={profilePhoto}
              alt={personalInfo.name}
              className="w-20 h-20 rounded-full object-cover border-3 border-purple-200 mb-3"
            />
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">{personalInfo.name}</span>
              <BadgeCheck className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-[13px] text-gray-500 mt-0.5">{personalInfo.title}</span>
            <span className="text-[12px] text-gray-400 mt-0.5">{personalInfo.location}</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-4 flex flex-col gap-1">
          <DrawerLink icon={<LayoutDashboard className="w-5 h-5" />} label="Professional Dashboard" onClick={() => navigate("dashboard")} />
          <DrawerLink icon={<User className="w-5 h-5" />} label="Profile" onClick={() => { onNavigateToProfile(); onClose(); }} />
          <DrawerLink icon={<Settings className="w-5 h-5" />} label="Settings" onClick={() => navigate("settings")} />
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-0 w-full px-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-[14px]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

function DrawerLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors text-left"
    >
      {icon}
      <span className="text-[14px]">{label}</span>
    </button>
  );
}