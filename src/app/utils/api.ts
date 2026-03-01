import type { Post, Job, Gig, PersonalInfo } from "../components/types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

// Helper function for fetch with auth
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });
  return response.json();
}

// ==================== POSTS ====================

export async function fetchPosts(mode: "professional" | "market"): Promise<Post[]> {
  const data = await apiFetch(`/posts/${mode}`);
  return data.success ? data.posts : [];
}

export async function createPost(mode: "professional" | "market", post: Post): Promise<Post | null> {
  const data = await apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ mode, post }),
  });
  return data.success ? data.post : null;
}

export async function updatePost(mode: "professional" | "market", postId: string, updates: Partial<Post>): Promise<Post | null> {
  const data = await apiFetch(`/posts/${mode}/${postId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.success ? data.post : null;
}

export async function deletePost(mode: "professional" | "market", postId: string): Promise<boolean> {
  const data = await apiFetch(`/posts/${mode}/${postId}`, {
    method: "DELETE",
  });
  return data.success;
}

// ==================== JOBS ====================

export async function fetchJobs(): Promise<Job[]> {
  const data = await apiFetch("/jobs");
  return data.success ? data.jobs : [];
}

export async function createJob(job: Job): Promise<Job | null> {
  const data = await apiFetch("/jobs", {
    method: "POST",
    body: JSON.stringify(job),
  });
  return data.success ? data.job : null;
}

export async function updateJob(jobId: string, updates: Partial<Job>): Promise<Job | null> {
  const data = await apiFetch(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.success ? data.job : null;
}

export async function deleteJob(jobId: string): Promise<boolean> {
  const data = await apiFetch(`/jobs/${jobId}`, {
    method: "DELETE",
  });
  return data.success;
}

// ==================== GIGS ====================

export async function fetchGigs(): Promise<Gig[]> {
  const data = await apiFetch("/gigs");
  return data.success ? data.gigs : [];
}

export async function createGig(gig: Gig): Promise<Gig | null> {
  const data = await apiFetch("/gigs", {
    method: "POST",
    body: JSON.stringify(gig),
  });
  return data.success ? data.gig : null;
}

export async function updateGig(gigId: string, updates: Partial<Gig>): Promise<Gig | null> {
  const data = await apiFetch(`/gigs/${gigId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.success ? data.gig : null;
}

export async function deleteGig(gigId: string): Promise<boolean> {
  const data = await apiFetch(`/gigs/${gigId}`, {
    method: "DELETE",
  });
  return data.success;
}

// ==================== PROFILES ====================

export async function fetchProfile(mode: "professional" | "market"): Promise<PersonalInfo | null> {
  const data = await apiFetch(`/profile/${mode}`);
  return data.success ? data.profile : null;
}

export async function updateProfile(mode: "professional" | "market", profile: PersonalInfo): Promise<PersonalInfo | null> {
  const data = await apiFetch(`/profile/${mode}`, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
  return data.success ? data.profile : null;
}

// ==================== INITIALIZATION ====================

export async function initializeDatabase(data: {
  professionalPosts?: Post[];
  marketPosts?: Post[];
  jobs?: Job[];
  gigs?: Gig[];
  profiles?: {
    professional?: PersonalInfo;
    market?: PersonalInfo;
  };
}): Promise<boolean> {
  const result = await apiFetch("/initialize", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result.success;
}
