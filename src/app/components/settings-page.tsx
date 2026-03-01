import { useState } from "react";
import { ArrowLeft, User, Lock, Eye, Bell, Shield, BarChart3, HelpCircle, FileText, Database, ChevronRight, FileUser, Activity, LogOut } from "lucide-react";
import type { Screen, PersonalInfo } from "./types";
import { DatabaseTest } from "./database-test";
import { supabase } from "../../utils/supabase/client";

interface SettingsPageProps {
  setActiveScreen: (s: Screen) => void;
  profilePhoto: string;
  personalInfo: PersonalInfo;
  mode: "professional" | "market";
  isAdmin?: boolean;
}

type SettingSection = "main" | "account" | "security" | "visibility" | "privacy" | "advertising" | "notifications";

export function SettingsPage({ setActiveScreen, profilePhoto, personalInfo, mode, isAdmin }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("main");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    gigAlerts: true,
    connectionRequests: true,
    postEngagement: true,
    messages: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    emailVisibility: "connections",
    phoneVisibility: "private",
    activityStatus: true,
    readReceipts: true,
    allowSearchEngines: true,
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    whoCanSeeProfile: "everyone",
    whoCanSeeConnections: "connections",
    whoCanSeeActivity: "connections",
    whoCanContactYou: "everyone",
  });

  const handleBack = () => {
    if (activeSection === "main") {
      setActiveScreen(mode === "professional" ? "dashboard" : "marketplace");
    } else {
      setActiveSection("main");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              {activeSection === "main" && (
                <img src={profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
              )}
              <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900">
                {activeSection === "main" ? "Settings" : getSectionTitle(activeSection)}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {activeSection === "main" && (
          <div className="space-y-3">
            {/* Main Settings Options */}
            <SettingsSection
              icon={<User className="w-5 h-5" />}
              title="Account preferences"
              onClick={() => setActiveSection("account")}
            />
            <SettingsSection
              icon={<Lock className="w-5 h-5" />}
              title="Sign in & security"
              onClick={() => setActiveSection("security")}
            />
            <SettingsSection
              icon={<Eye className="w-5 h-5" />}
              title="Visibility"
              onClick={() => setActiveSection("visibility")}
            />
            <SettingsSection
              icon={<Shield className="w-5 h-5" />}
              title="Data privacy"
              onClick={() => setActiveSection("privacy")}
            />
            <SettingsSection
              icon={<BarChart3 className="w-5 h-5" />}
              title="Advertising data"
              onClick={() => setActiveSection("advertising")}
            />
            <SettingsSection
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              onClick={() => setActiveSection("notifications")}
            />

            {/* Bottom Links */}
            <div className="pt-6 space-y-3">
              {/* Resume Maker - Professional Mode Only */}
              {mode === "professional" && (
                <button
                  onClick={() => setActiveScreen("resume")}
                  className="w-full flex items-center gap-3 px-2 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                >
                  <FileUser className="w-5 h-5 text-green-600" />
                  <span className="text-[14px] text-green-700" style={{ fontWeight: 600 }}>
                    Resume Maker (Create Resume)
                  </span>
                </button>
              )}

              <LinkItem icon={<HelpCircle className="w-5 h-5" />} title="Help Center" />
              <LinkItem
                icon={<FileText className="w-5 h-5" />}
                title={mode === "professional" ? "Professional Community Policies" : "Market Community Guidelines"}
              />
              <LinkItem icon={<FileText className="w-5 h-5" />} title="Privacy Policy" />
              
              {/* Admin Control Panel Link */}
              {isAdmin && (
                <button
                  onClick={() => setActiveScreen("admin-control")}
                  className="w-full flex items-center gap-3 px-2 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
                >
                  <Activity className="w-5 h-5 text-red-600" />
                  <span className="text-[14px] text-red-700" style={{ fontWeight: 600 }}>
                    Admin Control Panel (Database Management)
                  </span>
                </button>
              )}

              {/* Admin Dashboard Link */}
              {isAdmin && (
                <button
                  onClick={() => setActiveScreen("admin")}
                  className="w-full flex items-center gap-3 px-2 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                >
                  <Database className="w-5 h-5 text-purple-600" />
                  <span className="text-[14px] text-purple-700" style={{ fontWeight: 600 }}>
                    Admin Dashboard (View Database)
                  </span>
                </button>
              )}

              {/* Logout Link */}
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full flex items-center gap-3 px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-[14px] text-gray-700" style={{ fontWeight: 600 }}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        )}

        {activeSection === "account" && (
          <div className="space-y-4">
            <SettingCard title="Language">
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>English (US)</option>
                <option>हिन्दी (Hindi)</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </SettingCard>

            <SettingCard title="Content Language">
              <p className="text-[13px] text-gray-600 mb-3">Select languages for your feed</p>
              <div className="space-y-2">
                <ToggleOption label="English" checked={true} onChange={() => {}} />
                <ToggleOption label="Hindi" checked={true} onChange={() => {}} />
                <ToggleOption label="Spanish" checked={false} onChange={() => {}} />
              </div>
            </SettingCard>

            <SettingCard title="Autoplay Videos">
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>On</option>
                <option>Off</option>
                <option>Wi-Fi only</option>
              </select>
            </SettingCard>

            <SettingCard title="Download Quality">
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Standard</option>
                <option>High</option>
                <option>Data saver</option>
              </select>
            </SettingCard>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-4">
            <SettingCard title="Password">
              <button className="text-purple-600 text-[14px] hover:text-purple-700">Change password</button>
            </SettingCard>

            <SettingCard title="Two-factor authentication">
              <p className="text-[13px] text-gray-600 mb-3">Add an extra layer of security to your account</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-[14px] hover:bg-purple-700 transition-colors">
                Enable 2FA
              </button>
            </SettingCard>

            <SettingCard title="Login Activity">
              <p className="text-[13px] text-gray-600 mb-3">Review devices and locations where you're logged in</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-[14px] text-gray-900" style={{ fontWeight: 600 }}>
                      Current Device
                    </p>
                    <p className="text-[12px] text-gray-500">Mumbai, India • Just now</p>
                  </div>
                  <span className="text-[12px] text-green-600">Active</span>
                </div>
              </div>
            </SettingCard>

            <SettingCard title="Connected Apps">
              <p className="text-[13px] text-gray-600">No apps connected</p>
            </SettingCard>
          </div>
        )}

        {activeSection === "visibility" && (
          <div className="space-y-4">
            <SettingCard title="Who can see your profile">
              <select
                value={visibilitySettings.whoCanSeeProfile}
                onChange={(e) =>
                  setVisibilitySettings({ ...visibilitySettings, whoCanSeeProfile: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections only</option>
                <option value="private">Only me</option>
              </select>
            </SettingCard>

            <SettingCard title="Who can see your connections">
              <select
                value={visibilitySettings.whoCanSeeConnections}
                onChange={(e) =>
                  setVisibilitySettings({ ...visibilitySettings, whoCanSeeConnections: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections only</option>
                <option value="private">Only me</option>
              </select>
            </SettingCard>

            <SettingCard title="Who can see your activity">
              <select
                value={visibilitySettings.whoCanSeeActivity}
                onChange={(e) =>
                  setVisibilitySettings({ ...visibilitySettings, whoCanSeeActivity: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections only</option>
                <option value="private">Only me</option>
              </select>
            </SettingCard>

            <SettingCard title="Who can contact you">
              <select
                value={visibilitySettings.whoCanContactYou}
                onChange={(e) =>
                  setVisibilitySettings({ ...visibilitySettings, whoCanContactYou: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections only</option>
              </select>
            </SettingCard>
          </div>
        )}

        {activeSection === "privacy" && (
          <div className="space-y-4">
            <SettingCard title="Profile Visibility">
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="connections">Connections only</option>
                <option value="private">Private</option>
              </select>
            </SettingCard>

            <SettingCard title="Email Visibility">
              <select
                value={privacySettings.emailVisibility}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, emailVisibility: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="connections">Connections only</option>
                <option value="private">Private</option>
              </select>
            </SettingCard>

            <SettingCard title="Phone Visibility">
              <select
                value={privacySettings.phoneVisibility}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, phoneVisibility: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="connections">Connections only</option>
                <option value="private">Private</option>
              </select>
            </SettingCard>

            <SettingCard title="Activity Status">
              <ToggleOption
                label="Show when you're active"
                checked={privacySettings.activityStatus}
                onChange={(checked) => setPrivacySettings({ ...privacySettings, activityStatus: checked })}
              />
            </SettingCard>

            <SettingCard title="Read Receipts">
              <ToggleOption
                label="Let others know when you've read their messages"
                checked={privacySettings.readReceipts}
                onChange={(checked) => setPrivacySettings({ ...privacySettings, readReceipts: checked })}
              />
            </SettingCard>

            <SettingCard title="Search Engines">
              <ToggleOption
                label="Allow search engines to index your profile"
                checked={privacySettings.allowSearchEngines}
                onChange={(checked) => setPrivacySettings({ ...privacySettings, allowSearchEngines: checked })}
              />
            </SettingCard>

            <SettingCard title="Download Your Data">
              <p className="text-[13px] text-gray-600 mb-3">Get a copy of your In-Folio data</p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-[14px] hover:bg-gray-200 transition-colors">
                Request Archive
              </button>
            </SettingCard>

            <SettingCard title="Delete Account">
              <p className="text-[13px] text-gray-600 mb-3">
                Permanently delete your account and all your data
              </p>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[14px] hover:bg-red-100 transition-colors">
                Delete Account
              </button>
            </SettingCard>
          </div>
        )}

        {activeSection === "advertising" && (
          <div className="space-y-4">
            <SettingCard title="Personalized Ads">
              <p className="text-[13px] text-gray-600 mb-3">
                We use your activity to show you more relevant ads
              </p>
              <ToggleOption label="Allow personalized ads" checked={true} onChange={() => {}} />
            </SettingCard>

            <SettingCard title="Ad Topics">
              <p className="text-[13px] text-gray-600 mb-3">Control what types of ads you see</p>
              <div className="space-y-2">
                <ToggleOption label="Technology" checked={true} onChange={() => {}} />
                <ToggleOption label="Education" checked={true} onChange={() => {}} />
                <ToggleOption label="Career Development" checked={true} onChange={() => {}} />
                <ToggleOption label="Local Services" checked={mode === "market"} onChange={() => {}} />
              </div>
            </SettingCard>

            <SettingCard title="Data for Ads">
              <p className="text-[13px] text-gray-600 mb-3">
                Information we use to personalize your ad experience
              </p>
              <ToggleOption label="Profile information" checked={true} onChange={() => {}} />
              <ToggleOption label="Activity on In-Folio" checked={true} onChange={() => {}} />
              <ToggleOption label="Interaction with ads" checked={true} onChange={() => {}} />
            </SettingCard>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="space-y-4">
            <SettingCard title="Notification Channels">
              <div className="space-y-3">
                <ToggleOption
                  label="Email notifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
                <ToggleOption
                  label="Push notifications"
                  checked={notificationSettings.pushNotifications}
                  onChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
                <ToggleOption
                  label="SMS notifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                  }
                />
              </div>
            </SettingCard>

            <SettingCard title={mode === "professional" ? "Professional Notifications" : "Market Notifications"}>
              <div className="space-y-3">
                {mode === "professional" ? (
                  <>
                    <ToggleOption
                      label="Job recommendations"
                      checked={notificationSettings.jobAlerts}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, jobAlerts: checked })
                      }
                    />
                    <ToggleOption
                      label="Connection requests"
                      checked={notificationSettings.connectionRequests}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, connectionRequests: checked })
                      }
                    />
                  </>
                ) : (
                  <>
                    <ToggleOption
                      label="New gigs nearby"
                      checked={notificationSettings.gigAlerts}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, gigAlerts: checked })
                      }
                    />
                  </>
                )}
                <ToggleOption
                  label="Post engagement (likes, comments)"
                  checked={notificationSettings.postEngagement}
                  onChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, postEngagement: checked })
                  }
                />
                <ToggleOption
                  label="Messages"
                  checked={notificationSettings.messages}
                  onChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, messages: checked })
                  }
                />
              </div>
            </SettingCard>

            <SettingCard title="Notification Sound">
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Default</option>
                <option>Chime</option>
                <option>Bell</option>
                <option>None</option>
              </select>
            </SettingCard>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="text-gray-600">{icon}</div>
      <span style={{ fontSize: 15, fontWeight: 500 }} className="flex-1 text-gray-900">
        {title}
      </span>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </button>
  );
}

function LinkItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
      <div className="text-gray-500">{icon}</div>
      <span className="text-[14px] text-gray-600">{title}</span>
    </button>
  );
}

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 style={{ fontSize: 15, fontWeight: 600 }} className="text-gray-900 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ToggleOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-[14px] text-gray-700">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function getSectionTitle(section: SettingSection): string {
  const titles: Record<SettingSection, string> = {
    main: "Settings",
    account: "Account preferences",
    security: "Sign in & security",
    visibility: "Visibility",
    privacy: "Data privacy",
    advertising: "Advertising data",
    notifications: "Notifications",
  };
  return titles[section];
}