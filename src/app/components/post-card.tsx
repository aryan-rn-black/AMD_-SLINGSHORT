import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import type { Post, Comment } from "./types";

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (postId: string, comment: Comment) => void;
  variant?: "professional" | "market";
}

export function PostCard({ post, onLike, onComment, variant = "professional" }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: variant === "professional" ? "Sarah Chen" : "Aryan Patidar",
      authorAvatar: "",
      content: commentText,
      timestamp: "Just now",
    };
    onComment(post.id, newComment);
    setCommentText("");
  };

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all ${
      variant === "market" 
        ? "bg-white/90 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:bg-white" 
        : "bg-white border-gray-200 hover:shadow-md"
    }`}>
      {/* Author header */}
      <div className="p-4 flex items-center gap-3">
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900">{post.author}</span>
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{post.tag}</span>
          </div>
          <span className="text-[12px] text-gray-400">{post.timestamp}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[14px] text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-lg object-cover max-h-72"
            loading="lazy"
          />
        </div>
      )}

      {/* Engagement bar */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 transition-all ${
            post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
          style={{ transform: post.isLiked ? "scale(1.1)" : "scale(1)" }}
        >
          <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
          <span className="text-[13px]">{post.likes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[13px]">{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition-colors">
          <Bookmark className="w-5 h-5" />
          <span className="text-[13px]">{post.bookmarks}</span>
        </button>

        {variant === "market" && (
          <a
            href="https://wa.me/919876543210?text=Hi%2C%20I%20saw%20your%20post%20on%20In-Folio"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white rounded-full text-[12px] hover:bg-green-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2 py-2">
              <div className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center text-[11px] text-purple-700 shrink-0">
                {c.author[0]}
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-800">{c.author}</span>
                <span className="text-[11px] text-gray-400 ml-2">{c.timestamp}</span>
                <p className="text-[13px] text-gray-600">{c.content}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmitComment}
              className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}