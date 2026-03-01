import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Database, TrendingUp, Users, Briefcase, MessageSquare, Activity } from "lucide-react";
import type { Post, Job, Gig, PersonalInfo, Screen } from "./types";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { DatabaseTest } from "./database-test";

interface AdminDashboardProps {
  setActiveScreen: (s: Screen) => void;
}

interface Stats {
  users: number;
  professionalPosts: number;
  marketPosts: number;
  jobs: number;
  gigs: number;
  totalPosts: number;
}

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  mode: string;
  profilePhoto?: string;
  bannerImage?: string;
  personalInfo?: PersonalInfo;
  createdAt: string;
}

export function AdminDashboard({ setActiveScreen }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [professionalPosts, setProfessionalPosts] = useState<Post[]>([]);
  const [marketPosts, setMarketPosts] = useState<Post[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "pro-posts" | "market-posts" | "jobs" | "gigs">("stats");

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch users
      const usersRes = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users);
      }

      // Fetch professional posts
      const proPostsRes = await fetch(`${API_BASE}/posts/professional`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const proPostsData = await proPostsRes.json();
      if (proPostsData.success) {
        setProfessionalPosts(proPostsData.posts);
      }

      // Fetch market posts
      const marketPostsRes = await fetch(`${API_BASE}/posts/market`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const marketPostsData = await marketPostsRes.json();
      if (marketPostsData.success) {
        setMarketPosts(marketPostsData.posts);
      }

      // Fetch jobs
      const jobsRes = await fetch(`${API_BASE}/jobs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        setJobs(jobsData.jobs);
      }

      // Fetch gigs
      const gigsRes = await fetch(`${API_BASE}/gigs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const gigsData = await gigsRes.json();
      if (gigsData.success) {
        setGigs(gigsData.gigs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveScreen("dashboard")}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6 text-purple-600" />
                <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="text-[14px]" style={{ fontWeight: 600 }}>
                Refresh
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <TabButton
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
              icon={<TrendingUp className="w-4 h-4" />}
              label="Overview"
            />
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={<Users className="w-4 h-4" />}
              label={`Users (${users.length})`}
            />
            <TabButton
              active={activeTab === "pro-posts"}
              onClick={() => setActiveTab("pro-posts")}
              icon={<MessageSquare className="w-4 h-4" />}
              label={`Professional Posts (${professionalPosts.length})`}
            />
            <TabButton
              active={activeTab === "market-posts"}
              onClick={() => setActiveTab("market-posts")}
              icon={<MessageSquare className="w-4 h-4" />}
              label={`Market Posts (${marketPosts.length})`}
            />
            <TabButton
              active={activeTab === "jobs"}
              onClick={() => setActiveTab("jobs")}
              icon={<Briefcase className="w-4 h-4" />}
              label={`Jobs (${jobs.length})`}
            />
            <TabButton
              active={activeTab === "gigs"}
              onClick={() => setActiveTab("gigs")}
              icon={<Users className="w-4 h-4" />}
              label={`Gigs (${gigs.length})`}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Overview */}
            {activeTab === "stats" && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={<Users className="w-6 h-6" />}
                    color="bg-indigo-500"
                  />
                  <StatCard
                    title="Total Posts"
                    value={stats.totalPosts}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Professional Posts"
                    value={stats.professionalPosts}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Market Posts"
                    value={stats.marketPosts}
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="bg-pink-500"
                  />
                  <StatCard
                    title="Jobs"
                    value={stats.jobs}
                    icon={<Briefcase className="w-6 h-6" />}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Gigs"
                    value={stats.gigs}
                    icon={<Users className="w-6 h-6" />}
                    color="bg-orange-500"
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-4">
                    Database Information
                  </h2>
                  <div className="space-y-2 text-[14px]">
                    <p className="text-gray-600">
                      <span className="font-semibold">API Endpoint:</span>{" "}
                      <code className="bg-gray-100 px-2 py-1 rounded text-[12px]">{API_BASE}</code>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Database Type:</span> Supabase Key-Value Store
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Last Updated:</span> {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === "users" && (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <EmptyState message="No users found" />
                ) : (
                  users.map((user) => <UserDataCard key={user.userId} user={user} />)
                )}
              </div>
            )}

            {/* Professional Posts */}
            {activeTab === "pro-posts" && (
              <div className="space-y-4">
                {professionalPosts.length === 0 ? (
                  <EmptyState message="No professional posts found" />
                ) : (
                  professionalPosts.map((post) => <PostDataCard key={post.id} post={post} />)
                )}
              </div>
            )}

            {/* Market Posts */}
            {activeTab === "market-posts" && (
              <div className="space-y-4">
                {marketPosts.length === 0 ? (
                  <EmptyState message="No market posts found" />
                ) : (
                  marketPosts.map((post) => <PostDataCard key={post.id} post={post} />)
                )}
              </div>
            )}

            {/* Jobs */}
            {activeTab === "jobs" && (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <EmptyState message="No jobs found" />
                ) : (
                  jobs.map((job) => <JobDataCard key={job.id} job={job} />)
                )}
              </div>
            )}

            {/* Gigs */}
            {activeTab === "gigs" && (
              <div className="space-y-4">
                {gigs.length === 0 ? (
                  <EmptyState message="No gigs found" />
                ) : (
                  gigs.map((gig) => <GigDataCard key={gig.id} gig={gig} />)
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] whitespace-nowrap transition-colors ${
        active ? "bg-purple-100 text-purple-700" : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
      style={{ fontWeight: active ? 600 : 400 }}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`${color} text-white p-2.5 rounded-lg`}>{icon}</div>
      </div>
      <p className="text-[13px] text-gray-600 mb-1">{title}</p>
      <p style={{ fontSize: 28, fontWeight: 700 }} className="text-gray-900">
        {value}
      </p>
    </div>
  );
}

function PostDataCard({ post }: { post: Post }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 15, fontWeight: 600 }} className="text-gray-900">
              {post.author}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[11px]" style={{ fontWeight: 600 }}>
              {post.tag}
            </span>
          </div>
          <p className="text-[12px] text-gray-500">{post.timestamp}</p>
        </div>
        <code className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {post.id}</code>
      </div>
      <p className="text-[14px] text-gray-700 mb-3">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="" className="w-full h-48 object-cover rounded-lg mb-3" />
      )}
      <div className="flex items-center gap-4 text-[13px] text-gray-600">
        <span>👍 {post.likes} likes</span>
        <span>💬 {post.comments.length} comments</span>
        <span>🔖 {post.bookmarks} bookmarks</span>
      </div>
    </div>
  );
}

function JobDataCard({ job }: { job: Job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <img src={job.companyLogo} alt="" className="w-12 h-12 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">
            {job.title}
          </h3>
          <p className="text-[14px] text-gray-600">{job.company}</p>
        </div>
        <code className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {job.id}</code>
      </div>
      <div className="space-y-2 text-[13px] text-gray-600">
        <p>📍 {job.location}</p>
        <p>💰 {job.salary}</p>
        <p>🏷️ {job.type}</p>
        <p>📅 Posted {job.postedDate}</p>
      </div>
      <p className="text-[14px] text-gray-700 mt-3">{job.description}</p>
    </div>
  );
}

function GigDataCard({ gig }: { gig: Gig }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <img src={gig.employerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <h3 style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">
            {gig.title}
          </h3>
          <p className="text-[14px] text-gray-600">{gig.employer}</p>
        </div>
        <code className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded">ID: {gig.id}</code>
      </div>
      <div className="space-y-2 text-[13px] text-gray-600 mb-3">
        <p>📍 {gig.location}</p>
        <p>💰 {gig.salary}</p>
        <p>🏷️ {gig.type}</p>
        <p>👥 {gig.applicants} applicants</p>
        <p>⏰ Posted {gig.postedTime}</p>
      </div>
      <p className="text-[14px] text-gray-700 mb-3">{gig.description}</p>
      <div className="flex flex-wrap gap-2">
        {gig.tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[12px]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function UserDataCard({ user }: { user: UserProfile }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={user.profilePhoto || "https://via.placeholder.com/100"}
          alt=""
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">
              {user.name}
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[11px] ${
                user.mode === "professional"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-pink-100 text-pink-700"
              }`}
              style={{ fontWeight: 600 }}
            >
              {user.mode}
            </span>
          </div>
          <p className="text-[14px] text-gray-600 mb-1">{user.email}</p>
          {user.personalInfo?.title && (
            <p className="text-[13px] text-gray-500">{user.personalInfo.title}</p>
          )}
        </div>
        <code className="text-[11px] text-gray-400 bg-gray-100 px-2 py-1 rounded h-fit">
          {user.userId.substring(0, 8)}...
        </code>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[13px] text-gray-600 border-t border-gray-100 pt-3">
        <div>
          <p className="text-gray-500 mb-0.5">📅 Joined</p>
          <p className="font-medium">{formatDate(user.createdAt)}</p>
        </div>
        {user.personalInfo?.location && (
          <div>
            <p className="text-gray-500 mb-0.5">📍 Location</p>
            <p className="font-medium">{user.personalInfo.location}</p>
          </div>
        )}
        {user.personalInfo?.phone && (
          <div>
            <p className="text-gray-500 mb-0.5">📞 Phone</p>
            <p className="font-medium">{user.personalInfo.phone}</p>
          </div>
        )}
      </div>

      {user.personalInfo?.bio && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[13px] text-gray-600 line-clamp-2">{user.personalInfo.bio}</p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}