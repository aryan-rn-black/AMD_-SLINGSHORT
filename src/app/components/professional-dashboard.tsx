import { useState } from "react";
import { MapPin, GraduationCap, Eye, TrendingUp, Users, FolderOpen, BookmarkCheck, Settings, Plus, Clock } from "lucide-react";
import type { Post, Comment, Screen, PersonalInfo } from "./types";
import { IMAGES } from "./types";
import { PostCard } from "./post-card";
import { CreatePostDialog } from "./create-post-dialog";

interface ProfessionalDashboardProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  profilePhoto: string;
  setActiveScreen: (screen: Screen) => void;
  personalInfo?: PersonalInfo; // Add this
}

const sideQuests = [
  { title: "Need a React Dev for the weekend", desc: "Quick project: Build a landing page with animations", duration: "2 days", tags: ["React", "Framer Motion"] },
  { title: "UI/UX Review Session", desc: "Review our mobile app design and provide feedback", duration: "3 hours", tags: ["Figma", "UI/UX"] },
  { title: "API Integration Help", desc: "Need help integrating Stripe payment gateway", duration: "1 day", tags: ["Node.js", "Stripe"] },
  { title: "Code Review Partner", desc: "Looking for experienced dev to review our codebase", duration: "4 hours", tags: ["TypeScript", "React"] },
];

export function ProfessionalDashboard({ posts, setPosts, profilePhoto, setActiveScreen, personalInfo }: ProfessionalDashboardProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);

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

  const handleCreatePost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // Use real user data or fallback
  const displayName = personalInfo?.name || "User";
  const displayTitle = personalInfo?.title || "Professional";
  const displayLocation = personalInfo?.location || "Location";

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:w-64 xl:w-1/4 shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200 shadow-sm overflow-hidden sticky top-20">
              {/* Profile card */}
              <div className="p-5 text-center">
                <img
                  src={profilePhoto}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-purple-200 mb-3"
                />
                <h3 style={{ fontSize: 16, fontWeight: 700 }} className="text-gray-900">{displayName}</h3>
                <p className="text-[13px] text-gray-500 mt-1">{displayTitle}</p>
                <div className="flex items-center justify-center gap-1 mt-1 text-[12px] text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {displayLocation}
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span className="text-[12px] text-purple-700" style={{ fontWeight: 600 }}>MIT</span>
                </div>
              </div>

              {/* Stats */}
              <div className="px-5 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[13px] text-gray-500">Profile views this week</span>
                  <span className="text-[13px] text-purple-600" style={{ fontWeight: 600 }}>245</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[13px] text-gray-500">Post impressions</span>
                  <span className="text-[13px] text-purple-600" style={{ fontWeight: 600 }}>1,234</span>
                </div>
              </div>

              {/* Links */}
              <div className="px-3 py-3 border-t border-gray-100">
                {[
                  { icon: <Users className="w-4 h-4" />, label: "My Network" },
                  { icon: <FolderOpen className="w-4 h-4" />, label: "My Projects" },
                  { icon: <BookmarkCheck className="w-4 h-4" />, label: "Saved Jobs" },
                  { icon: <Settings className="w-4 h-4" />, label: "Settings" },
                ].map((link) => (
                  <button
                    key={link.label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors text-[13px]"
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <main className="flex-1 min-w-0">
            {/* Create post */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
              <div className="flex items-center gap-3">
                <img src={profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left bg-gray-100 rounded-full px-4 py-2.5 text-[14px] text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  What's on your mind?
                </button>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} variant="professional" />
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-1/4 shrink-0">
            {/* Jobs card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 text-white mb-5 shadow-lg">
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Jobs for You</h3>
              <p className="text-purple-200 text-[13px] mt-1">15 new jobs match your profile</p>
              <button
                onClick={() => setActiveScreen("jobs")}
                className="mt-4 w-full bg-white text-purple-700 py-2.5 rounded-lg text-[14px] hover:bg-purple-50 transition-colors"
                style={{ fontWeight: 600 }}
              >
                View All Jobs
              </button>
            </div>

            {/* Side Quests */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 style={{ fontSize: 15, fontWeight: 700 }} className="text-gray-900">Side Quests</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {sideQuests.map((quest, i) => (
                  <div key={i} className="p-4 hover:bg-purple-50 transition-colors cursor-pointer">
                    <h4 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900 mb-1">{quest.title}</h4>
                    <p className="text-[12px] text-gray-500 mb-2">{quest.desc}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {quest.duration}
                      </div>
                      <div className="flex gap-1">
                        {quest.tags.map((tag) => (
                          <span key={tag} className="text-[11px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreatePostDialog
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        authorName={displayName}
        authorAvatar={profilePhoto}
      />
    </div>
  );
}