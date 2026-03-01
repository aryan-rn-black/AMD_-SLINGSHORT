import { useState } from "react";
import { Plus } from "lucide-react";
import type { Post, Comment, Screen } from "./types";
import { PostCard } from "./post-card";
import { CreatePostDialog } from "./create-post-dialog";

interface LocalMarketplaceProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  profilePhoto: string;
  setActiveScreen: (s: Screen) => void;
}

export function LocalMarketplace({ posts, setPosts, profilePhoto, setActiveScreen }: LocalMarketplaceProps) {
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

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Create post */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
              <div className="flex items-center gap-3">
                <img src={profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left bg-gray-100 rounded-full px-4 py-2.5 text-[14px] text-gray-400 hover:bg-gray-200 transition-colors"
                >
                  Share something with your community...
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
                <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} variant="market" />
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            {/* Quick Gigs */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-5 text-white shadow-lg sticky top-20">
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Quick Gigs Nearby</h3>
              <p className="text-purple-100 text-[13px] mt-1">28 new gigs in your area</p>
              <button
                onClick={() => setActiveScreen("gigs")}
                className="mt-4 w-full bg-white text-purple-700 py-2.5 rounded-lg text-[14px] hover:bg-purple-50 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Explore Gigs
              </button>
            </div>
          </aside>
        </div>
      </div>

      <CreatePostDialog
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        authorName="Aryan Patidar"
        authorAvatar={profilePhoto}
        placeholder="Share something with your community..."
      />
    </div>
  );
}