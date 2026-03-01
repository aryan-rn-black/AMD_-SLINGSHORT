import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import type { Post } from "./types";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
  authorName: string;
  authorAvatar: string;
  placeholder?: string;
}

export function CreatePostDialog({
  isOpen,
  onClose,
  onSubmit,
  authorName,
  authorAvatar,
  placeholder = "What's on your mind?",
}: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: authorName,
      authorAvatar: authorAvatar,
      tag: "#NewPost",
      content: content.trim(),
      image: imageUrl || undefined,
      timestamp: "Just now",
      replies: 0,
      bookmarks: 0,
      likes: 0,
      isLiked: false,
      comments: [],
    };
    onSubmit(newPost);
    setContent("");
    setImageUrl("");
    setImageFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Create Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <img src={authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-900">{authorName}</p>
              <p className="text-[12px] text-gray-400">Posting publicly</p>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full bg-gray-50 rounded-xl p-4 text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200"
          />
          {imageUrl && (
            <div className="mt-3 relative">
              <img src={imageUrl} alt="Preview" className="w-full rounded-lg max-h-48 object-cover" />
              <button
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label htmlFor="image-upload" className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-[13px] transition-colors cursor-pointer">
              <ImagePlus className="w-5 h-5" />
              Add Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-full text-[14px] hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}