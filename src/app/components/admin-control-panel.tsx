import { useState, useEffect } from "react";
import { ArrowLeft, Plus, RefreshCw, Database, AlertTriangle, CheckCircle, Briefcase, MessageSquare, Users, X } from "lucide-react";
import type { Screen } from "./types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface AdminControlPanelProps {
  setActiveScreen: (screen: Screen) => void;
}

type FormType = "professional-post" | "market-post" | "job" | "gig" | null;

export function AdminControlPanel({ setActiveScreen }: AdminControlPanelProps) {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<any>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const showMessage = (msg: string, type: "success" | "warning" | "error" = "success") => {
    const prefix = type === "success" ? "✓" : type === "warning" ? "⚠" : "✗";
    setMessage(`${prefix} ${msg}`);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen("settings")}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-white">
                  Admin Control Panel
                </h1>
                <p className="text-[13px] text-purple-100">Create and manage content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Warning Banner */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[14px] text-yellow-900" style={{ fontWeight: 600 }}>
              Administrator Access
            </p>
            <p className="text-[13px] text-yellow-700 mt-1">
              You have full control over the database. Use these tools to create and manage content.
            </p>
          </div>
        </div>

        {/* Database Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Users" value={stats.users || 0} color="indigo" />
            <StatCard title="Professional Posts" value={stats.professionalPosts || 0} color="purple" />
            <StatCard title="Market Posts" value={stats.marketPosts || 0} color="pink" />
            <StatCard title="Job Listings" value={stats.jobs || 0} color="blue" />
            <StatCard title="Gig Listings" value={stats.gigs || 0} color="green" />
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            message.startsWith("✓")
              ? "bg-green-50 border-green-200"
              : message.startsWith("⚠")
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
          }`}>
            {message.startsWith("✓") ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                message.startsWith("⚠") ? "text-yellow-600" : "text-red-600"
              }`} />
            )}
            <p className={`text-[14px] ${
              message.startsWith("✓")
                ? "text-green-700"
                : message.startsWith("⚠")
                ? "text-yellow-700"
                : "text-red-700"
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Create Content Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-4">
            Create New Content
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CreateButton
              title="Professional Post"
              icon={<MessageSquare className="w-5 h-5" />}
              color="purple"
              onClick={() => setActiveForm("professional-post")}
            />
            <CreateButton
              title="Market Post"
              icon={<MessageSquare className="w-5 h-5" />}
              color="pink"
              onClick={() => setActiveForm("market-post")}
            />
            <CreateButton
              title="Job Listing"
              icon={<Briefcase className="w-5 h-5" />}
              color="blue"
              onClick={() => setActiveForm("job")}
            />
            <CreateButton
              title="Gig Listing"
              icon={<Users className="w-5 h-5" />}
              color="green"
              onClick={() => setActiveForm("gig")}
            />
          </div>
        </div>

        {/* System Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-4">
            System Controls
          </h2>
          
          <div className="space-y-3">
            <ControlItem
              title="Refresh Statistics"
              description="Reload all database statistics"
              actions={
                <button
                  onClick={fetchStats}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-[13px] disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              }
            />

            <ControlItem
              title="View Admin Dashboard"
              description="See all data and analytics"
              actions={
                <button
                  onClick={() => setActiveScreen("admin")}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  Open Dashboard
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Forms Modal */}
      {activeForm && (
        <FormModal
          type={activeForm}
          onClose={() => setActiveForm(null)}
          onSuccess={(msg) => {
            showMessage(msg, "success");
            fetchStats();
            setActiveForm(null);
          }}
          onError={(msg) => showMessage(msg, "error")}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className={`border rounded-xl p-4 ${colors[color as keyof typeof colors]}`}>
      <p className="text-[13px] mb-1" style={{ fontWeight: 500 }}>
        {title}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function CreateButton({
  title,
  icon,
  color,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  const colors = {
    purple: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
    pink: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700",
    blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
    green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 border rounded-xl transition-colors ${colors[color as keyof typeof colors]}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[14px]" style={{ fontWeight: 600 }}>
          {title}
        </span>
      </div>
    </button>
  );
}

function ControlItem({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 mr-4">
        <p className="text-[14px] text-gray-900" style={{ fontWeight: 600 }}>
          {title}
        </p>
        <p className="text-[12px] text-gray-600 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

function FormModal({
  type,
  onClose,
  onSuccess,
  onError,
}: {
  type: FormType;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  if (type === "professional-post" || type === "market-post") {
    return (
      <PostForm
        type={type}
        API_BASE={API_BASE}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />
    );
  } else if (type === "job") {
    return (
      <JobForm
        API_BASE={API_BASE}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />
    );
  } else if (type === "gig") {
    return (
      <GigForm
        API_BASE={API_BASE}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />
    );
  }

  return null;
}

function PostForm({
  type,
  API_BASE,
  onClose,
  onSuccess,
  onError,
}: {
  type: "professional-post" | "market-post";
  API_BASE: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    tag: "",
    content: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.content) {
      onError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = type === "professional-post" ? "/posts/professional" : "/posts/market";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          id: `admin-${type}-${Date.now()}`,
          author: formData.author,
          authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
          tag: formData.tag || (type === "professional-post" ? "#Announcement" : "#Update"),
          content: formData.content,
          timestamp: "Just now",
          image: formData.image || undefined,
          replies: 0,
          bookmarks: 0,
          likes: 0,
          isLiked: false,
          comments: [],
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess(`${type === "professional-post" ? "Professional" : "Market"} post created successfully!`);
      } else {
        onError(data.error || "Failed to create post");
      }
    } catch (error) {
      onError(`Error: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900">
            Create {type === "professional-post" ? "Professional" : "Market"} Post
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Author Name *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Tag
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="#Announcement"
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your post content here..."
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-[14px]"
              style={{ fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-[14px] disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              {submitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JobForm({
  API_BASE,
  onClose,
  onSuccess,
  onError,
}: {
  API_BASE: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      onError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          id: `admin-job-${Date.now()}`,
          title: formData.title,
          company: formData.company,
          companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
          location: formData.location,
          salary: formData.salary,
          type: formData.type,
          description: formData.description,
          postedDate: "Just now",
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess("Job listing created successfully!");
      } else {
        onError(data.error || "Failed to create job");
      }
    } catch (error) {
      onError(`Error: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900">
            Create Job Listing
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Senior Software Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tech Corp Inc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Salary Range
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="$100,000 - $150,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Freelance</option>
              <option>Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the job role, responsibilities, and requirements..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-[14px]"
              style={{ fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-[14px] disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              {submitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GigForm({
  API_BASE,
  onClose,
  onSuccess,
  onError,
}: {
  API_BASE: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    employer: "",
    location: "",
    salary: "",
    type: "One-time",
    description: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.employer || !formData.description) {
      onError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/gigs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          id: `admin-gig-${Date.now()}`,
          title: formData.title,
          employer: formData.employer,
          employerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
          location: formData.location,
          salary: formData.salary,
          type: formData.type,
          description: formData.description,
          postedTime: "Just now",
          tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
          applicants: 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess("Gig listing created successfully!");
      } else {
        onError(data.error || "Failed to create gig");
      }
    } catch (error) {
      onError(`Error: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900">
            Create Gig Listing
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Gig Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Website Design Project"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Employer Name *
            </label>
            <input
              type="text"
              value={formData.employer}
              onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Remote / Local"
              />
            </div>

            <div>
              <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Payment
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="$500/project or $50/hour"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Gig Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>One-time</option>
              <option>Recurring</option>
              <option>Project-based</option>
              <option>Hourly</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Gig Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the gig, requirements, and expectations..."
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="design, web, urgent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-[14px]"
              style={{ fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-[14px] disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              {submitting ? "Creating..." : "Create Gig"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
