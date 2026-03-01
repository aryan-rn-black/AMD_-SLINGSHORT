import { useState } from "react";
import { Camera, Edit3, Save, X, MapPin, ExternalLink, Github, Figma, Globe, BookOpen, Send } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import type { Post, Comment, PersonalInfo, Mode } from "./types";
import { IMAGES } from "./types";
import { PostCard } from "./post-card";
import { supabase } from "../../utils/supabase/client";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

interface ProfilePageProps {
  mode: Mode;
  profilePhoto: string;
  bannerImage: string;
  personalInfo: PersonalInfo;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  onProfilePhotoChange: (url: string) => void;
  onBannerChange: (url: string) => void;
}

const profProjects = [
  { title: "E-Commerce Dashboard", platform: "GitHub", image: IMAGES.dashboard, icon: <Github className="w-4 h-4" /> },
  { title: "Mobile App Design System", platform: "Figma", image: IMAGES.mobileDesign, icon: <Figma className="w-4 h-4" /> },
  { title: "React Performance Tips", platform: "Blog", image: IMAGES.blog, icon: <BookOpen className="w-4 h-4" /> },
  { title: "Portfolio Website v3", platform: "Website", image: IMAGES.portfolio, icon: <Globe className="w-4 h-4" /> },
  { title: "Open Source React Library", platform: "GitHub", image: IMAGES.openSource, icon: <Github className="w-4 h-4" /> },
  { title: "SaaS Landing Page", platform: "Figma", image: IMAGES.saas, icon: <Figma className="w-4 h-4" /> },
];

const marketProjects = [
  { title: "Food Delivery App", platform: "GitHub", image: IMAGES.foodDelivery, icon: <Github className="w-4 h-4" /> },
  { title: "Local Store Website", platform: "Website", image: IMAGES.localStore, icon: <Globe className="w-4 h-4" /> },
  { title: "Event Photography Portfolio", platform: "Website", image: IMAGES.photography, icon: <Globe className="w-4 h-4" /> },
  { title: "Freelance Work Samples", platform: "Blog", image: IMAGES.blog, icon: <BookOpen className="w-4 h-4" /> },
];

const mockMessages = [
  { id: "1", name: "Alex Kumar", avatar: "", lastMessage: "Hey, are you available for the project?", time: "2 min ago", unread: true },
  { id: "2", name: "Maya Patel", avatar: "", lastMessage: "The designs look great!", time: "1 hour ago", unread: false },
  { id: "3", name: "David Lee", avatar: "", lastMessage: "Let's discuss the timeline", time: "3 hours ago", unread: true },
  { id: "4", name: "Priya Shah", avatar: "", lastMessage: "Thanks for your help!", time: "Yesterday", unread: false },
];

export function ProfilePage({
  mode,
  profilePhoto,
  bannerImage,
  personalInfo,
  setPersonalInfo,
  posts,
  setPosts,
  onProfilePhotoChange,
  onBannerChange,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "activity" | "chat">("about");
  const [isEditing, setIsEditing] = useState(false);
  const [editInfo, setEditInfo] = useState(personalInfo);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const projects = mode === "professional" ? profProjects : marketProjects;

  const handleSave = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      // Update profile in database
      const response = await fetch(`${API_BASE}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          full_name: editInfo.name,
          email: editInfo.email,
          phone: editInfo.phone,
          dob: editInfo.dob,
          title: editInfo.title,
          location: editInfo.location,
          bio: editInfo.bio,
          profile_photo: profilePhoto,
          banner_image: bannerImage,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("Profile updated successfully");
        setPersonalInfo(editInfo);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", data.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleComment = (postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  const tabs = [
    { key: "about" as const, label: "About" },
    { key: "projects" as const, label: "Projects" },
    { key: "activity" as const, label: "Activity" },
    { key: "chat" as const, label: "Chat" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <label
          htmlFor="banner-upload"
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </label>
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                onBannerChange(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      {/* Profile info */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="relative -mt-12 sm:-mt-16 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <img
                src={profilePhoto}
                alt={personalInfo.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onProfilePhotoChange(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="flex-1 pb-2">
              <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900">{personalInfo.name}</h1>
              <p className="text-[14px] text-gray-500">{personalInfo.title}</p>
              <div className="flex items-center gap-1 text-[13px] text-gray-400 mt-1">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-[14px] border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="pb-12">
          {activeTab === "about" && (
            <div className="max-w-2xl">
              {/* Personal Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: 16, fontWeight: 700 }} className="text-gray-900">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setEditInfo(personalInfo);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 text-purple-600 text-[13px] hover:text-purple-700"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-gray-400 text-[13px] hover:text-gray-600">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button onClick={handleSave} className="flex items-center gap-1 text-purple-600 text-[13px] hover:text-purple-700">
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <InfoField label="Name" value={isEditing ? editInfo.name : personalInfo.name} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, name: v })} />
                  <InfoField label="Working Profile/Title" value={isEditing ? editInfo.title : personalInfo.title} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, title: v })} />
                  <InfoField label="Date of Birth" value={isEditing ? editInfo.dob : personalInfo.dob} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, dob: v })} type="date" />
                  <InfoField label="Email" value={isEditing ? editInfo.email : personalInfo.email} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, email: v })} type="email" />
                  <InfoField label="Phone" value={isEditing ? editInfo.phone : personalInfo.phone} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, phone: v })} />
                  <InfoField label="Location" value={isEditing ? editInfo.location : personalInfo.location} editable={isEditing} onChange={(v) => setEditInfo({ ...editInfo, location: v })} />
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontSize: 16, fontWeight: 700 }} className="text-gray-900">Bio</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setEditInfo(personalInfo);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-1.5 text-purple-600 text-[13px] hover:text-purple-700"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-gray-400 text-[13px] hover:text-gray-600">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button onClick={handleSave} className="flex items-center gap-1 text-purple-600 text-[13px] hover:text-purple-700">
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={editInfo.bio}
                    onChange={(e) => setEditInfo({ ...editInfo, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                ) : (
                  <p className="text-[14px] text-gray-600 leading-relaxed">{personalInfo.bio}</p>
                )}
              </div>

              {/* Skills */}
              {mode === "professional" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 style={{ fontSize: 16, fontWeight: 700 }} className="text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL", "Figma", "TailwindCSS"].map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-[13px]">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3 }}>
              <Masonry gutter="16px">
                {projects.map((project, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900 mb-1">{project.title}</h4>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        {project.icon}
                        {project.platform}
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}

          {activeTab === "activity" && (
            <div className="max-w-2xl flex flex-col gap-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-[14px]">No activity yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} variant={mode} />
                ))
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {!selectedChat ? (
                  <div className="divide-y divide-gray-100">
                    {mockMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedChat(msg.id)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-[14px] text-purple-700 shrink-0" style={{ fontWeight: 600 }}>
                          {msg.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900">{msg.name}</span>
                            <span className="text-[11px] text-gray-400">{msg.time}</span>
                          </div>
                          <p className="text-[13px] text-gray-500 truncate">{msg.lastMessage}</p>
                        </div>
                        {msg.unread && <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ←
                      </button>
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-[12px] text-purple-700" style={{ fontWeight: 600 }}>
                        {mockMessages.find((m) => m.id === selectedChat)?.name[0]}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900">
                        {mockMessages.find((m) => m.id === selectedChat)?.name}
                      </span>
                    </div>
                    <div className="p-4 min-h-[300px] space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[70%]">
                          <p className="text-[14px] text-gray-700">Hey! How's it going?</p>
                          <span className="text-[10px] text-gray-400">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-purple-600 rounded-2xl rounded-br-sm px-4 py-2 max-w-[70%]">
                          <p className="text-[14px] text-white">Hi! I'm doing great, thanks!</p>
                          <span className="text-[10px] text-purple-200">10:32 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[70%]">
                          <p className="text-[14px] text-gray-700">{mockMessages.find((m) => m.id === selectedChat)?.lastMessage}</p>
                          <span className="text-[10px] text-gray-400">10:35 AM</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 p-4 border-t border-gray-100">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  editable,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[12px] text-gray-400 block mb-1">{label}</label>
      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      ) : (
        <p className="text-[14px] text-gray-700">{value}</p>
      )}
    </div>
  );
}