export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  tag: string;
  content: string;
  image?: string;
  timestamp: string;
  replies: number;
  bookmarks: number;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedDate: string;
}

export interface Gig {
  id: string;
  title: string;
  employer: string;
  employerAvatar: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedTime: string;
  tags: string[];
  applicants: number;
}

export interface PersonalInfo {
  name: string;
  dob: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  bio: string;
}

export type Screen = 'dashboard' | 'marketplace' | 'profile' | 'jobs' | 'gigs' | 'settings' | 'admin' | 'resume' | 'auth' | 'admin-control';
export type Mode = 'professional' | 'market';

// Images
export const IMAGES = {
  logo: "https://images.unsplash.com/photo-1756999223287-3393ca77f81e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwcHVycGxlJTIwcG9ydGZvbGlvJTIwbG9nb3xlbnwxfHx8fDE3NzIxOTQxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  sarahPhoto: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMTU5NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  aryanPhoto: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjEwNzE4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  techBanner: "https://images.unsplash.com/photo-1646153114001-495dfb56506d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MjE2MTY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
  colorfulBanner: "https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHZpYnJhbnQlMjBhYnN0cmFjdCUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyMTg3Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  coding: "https://images.unsplash.com/photo-1607971422532-73f9d45d7a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBsYXB0b3AlMjBkZXZlbG9wZXIlMjBzY3JlZW58ZW58MXx8fHwxNzcyMTg3Mzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  uiDesign: "https://images.unsplash.com/photo-1760087959423-0e2645e4795e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBVSSUyMGRlc2lnbiUyMHN5c3RlbXxlbnwxfHx8fDE3NzIxODc0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ecommerce: "https://images.unsplash.com/photo-1768987439365-ffc51bf0f467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBtb2JpbGUlMjBhcHAlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NzIxODY2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  boutique: "https://images.unsplash.com/photo-1766934587163-186d20bf3d40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGNsb3RoaW5nJTIwc3RvcmUlMjByZXRhaWx8ZW58MXx8fHwxNzcyMTg3NDAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  furniture: "https://images.unsplash.com/photo-1694715669993-ea0022b470f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBtb3ZpbmclMjBsb2FkaW5nfGVufDF8fHx8MTc3MjE4NzQwMXww&ixlib=rb-4.1.0&q=80&w=1080",
  dashboard: "https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBzb2Z0d2FyZXxlbnwxfHx8fDE3NzIxODc0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  mobileDesign: "https://images.unsplash.com/photo-1748801583975-720cb5e4985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ24lMjBwcm90b3R5cGV8ZW58MXx8fHwxNzcyMTA3MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  blog: "https://images.unsplash.com/photo-1748209252552-30cf9cd32909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMGFydGljbGUlMjBsYXB0b3B8ZW58MXx8fHwxNzcyMTg3NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  portfolio: "https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlJTIwZGVzaWduJTIwbW9kZXJufGVufDF8fHx8MTc3MjEzMDk2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  openSource: "https://images.unsplash.com/photo-1650600538903-ec09f670c391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwc291cmNlJTIwY29kZSUyMHByb2dyYW1taW5nfGVufDF8fHx8MTc3MjE4NjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  saas: "https://images.unsplash.com/photo-1578398425527-e7c786c1e400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWFzJTIwbGFuZGluZyUyMHBhZ2UlMjBkZXNpZ258ZW58MXx8fHwxNzcyMTg3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  restaurant: "https://images.unsplash.com/photo-1771360963016-1408c2de12c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGZvb2QlMjBwcmVwYXJhdGlvbnxlbnwxfHx8fDE3NzIxODI3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  foodDelivery: "https://images.unsplash.com/photo-1564758913551-7212727c4b08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBhcHAlMjBsb2NhbCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzcyMTg3NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  photography: "https://images.unsplash.com/photo-1525101479959-c3e73fd498ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5JTIwY2FtZXJhJTIwcG9ydGZvbGlvfGVufDF8fHx8MTc3MjE4NzQwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  localStore: "https://images.unsplash.com/photo-1771570947187-c1856abbe280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGdyb2NlcnklMjBzdG9yZSUyMG1hcmtldHxlbnwxfHx8fDE3NzIxODc0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
};