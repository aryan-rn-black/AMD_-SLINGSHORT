import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Handle OPTIONS requests explicitly
app.options("/*", (c) => {
  return c.text("", 204);
});

// Health check endpoint
app.get("/make-server-cfc924af/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTHENTICATION ====================

// Sign up new user
app.post("/make-server-cfc924af/auth/signup", async (c) => {
  try {
    const { email, password, name, mode } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ success: false, error: "Email, password, and name are required" }, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Attempting to create user with email: ${normalizedEmail}, name: ${name}`);

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (existingUsers?.users) {
      const userExists = existingUsers.users.some(u => u.email?.toLowerCase() === normalizedEmail);
      if (userExists) {
        console.log(`User with email ${normalizedEmail} already exists`);
        return c.json({ success: false, error: "A user with this email already exists" }, 400);
      }
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      user_metadata: { name: name.trim() },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Signup error from Supabase Auth:", error.message, JSON.stringify(error));
      return c.json({ success: false, error: error.message }, 400);
    }

    if (!data?.user) {
      console.log("Signup error: No user returned from createUser");
      return c.json({ success: false, error: "User creation failed - no user returned" }, 500);
    }

    // Create user profile in database
    const userId = data.user.id;
    console.log(`User created successfully with ID: ${userId}, email: ${normalizedEmail}`);
    
    const userProfile = {
      userId,
      email: normalizedEmail,
      name: name.trim(),
      mode: mode || "professional",
      profilePhoto: mode === "market" 
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      bannerImage: mode === "market"
        ? "https://images.unsplash.com/photo-1557804506-669a67965ba0"
        : "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      personalInfo: {
        name: name.trim(),
        dob: "",
        email: normalizedEmail,
        phone: "",
        title: "",
        location: "",
        bio: "",
      },
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, userProfile);
    console.log(`User profile saved to KV store for user: ${userId}`);

    return c.json({ success: true, user: data.user, profile: userProfile });
  } catch (error) {
    console.log("Unexpected error during signup:", String(error));
    return c.json({ success: false, error: `Server error during signup: ${String(error)}` }, 500);
  }
});

// Sign in user
app.post("/make-server-cfc924af/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: "Email and password are required" }, 400);
    }

    // Note: Sign in happens on the client side using Supabase client
    // This endpoint is for server-side validation if needed
    return c.json({ success: true, message: "Use client-side auth for signin" });
  } catch (error) {
    console.log("Error during signin:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Verify user session
app.get("/make-server-cfc924af/auth/verify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ success: false, error: "Invalid or expired token" }, 401);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.log("Error verifying token:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== RESUMES ====================

// Generate resume content with Gemini AI
app.post("/make-server-cfc924af/resume/generate", async (c) => {
  try {
    const { prompt, userInfo } = await c.req.json();
    
    if (!prompt) {
      return c.json({ success: false, error: "Prompt is required" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.log("GEMINI_API_KEY not configured");
      return c.json({ success: false, error: "AI service not configured. Please add your Gemini API key." }, 500);
    }

    // Create a detailed prompt for resume generation
    const fullPrompt = `You are a professional resume writer. Generate a professional resume based on the following information:

${prompt}

${userInfo ? `
User Information:
- Name: ${userInfo.fullName || ""}
- Email: ${userInfo.email || ""}
- Phone: ${userInfo.phone || ""}
- Location: ${userInfo.location || ""}
` : ""}

Please provide the resume content in the following JSON format:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string (2-3 sentences professional summary)"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string (e.g., Jan 2020)",
      "endDate": "string (e.g., Dec 2022 or Present)",
      "current": boolean,
      "description": "string (detailed description of responsibilities and achievements)"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string (e.g., Bachelor of Science)",
      "field": "string (e.g., Computer Science)",
      "startDate": "string (e.g., 2016)",
      "endDate": "string (e.g., 2020)",
      "description": "string (optional achievements or GPA)"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string (e.g., Jan 2023)"
    }
  ]
}

Generate realistic and professional content. Include at least 2-3 work experiences, 1-2 education entries, 5-10 relevant skills, and 1-2 certifications if applicable.`;

    console.log("Generating resume with Gemini AI via REST API...");
    
    // Use Gemini REST API directly with v1beta endpoint (supports newer models)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini AI response received");
    
    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No text in Gemini response");
    }

    // Extract JSON from response (sometimes it comes wrapped in markdown)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const resumeData = JSON.parse(jsonText);
    
    // Add unique IDs to array items
    if (resumeData.experience) {
      resumeData.experience = resumeData.experience.map((exp: any, i: number) => ({
        id: `exp-${Date.now()}-${i}`,
        ...exp
      }));
    }
    if (resumeData.education) {
      resumeData.education = resumeData.education.map((edu: any, i: number) => ({
        id: `edu-${Date.now()}-${i}`,
        ...edu
      }));
    }
    if (resumeData.certifications) {
      resumeData.certifications = resumeData.certifications.map((cert: any, i: number) => ({
        id: `cert-${Date.now()}-${i}`,
        ...cert
      }));
    }

    return c.json({ success: true, resumeData });
  } catch (error) {
    console.log("Error generating resume with AI:", error);
    return c.json({ 
      success: false, 
      error: `Failed to generate resume: ${String(error)}` 
    }, 500);
  }
});

// Get user's resume
app.get("/make-server-cfc924af/resume/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const resume = await kv.get(`resume:${userId}`);
    
    if (!resume) {
      return c.json({ success: false, error: "Resume not found" }, 404);
    }
    
    return c.json({ success: true, resume });
  } catch (error) {
    console.log("Error fetching resume:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create or update user's resume
app.put("/make-server-cfc924af/resume/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const resume = await c.req.json();
    
    const key = `resume:${userId}`;
    await kv.set(key, resume);
    
    return c.json({ success: true, resume });
  } catch (error) {
    console.log("Error saving resume:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete user's resume
app.delete("/make-server-cfc924af/resume/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const key = `resume:${userId}`;
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting resume:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== POSTS ====================

// Get all professional posts
app.get("/make-server-cfc924af/posts/professional", async (c) => {
  try {
    const posts = await kv.getByPrefix("post:professional:");
    return c.json({ success: true, posts: posts || [] });
  } catch (error) {
    console.log("Error fetching professional posts:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all market posts
app.get("/make-server-cfc924af/posts/market", async (c) => {
  try {
    const posts = await kv.getByPrefix("post:market:");
    return c.json({ success: true, posts: posts || [] });
  } catch (error) {
    console.log("Error fetching market posts:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new post
app.post("/make-server-cfc924af/posts", async (c) => {
  try {
    const body = await c.req.json();
    const { mode, post } = body;
    
    if (!mode || !post) {
      return c.json({ success: false, error: "Missing required fields: mode, post" }, 400);
    }

    const key = `post:${mode}:${post.id}`;
    await kv.set(key, post);
    
    return c.json({ success: true, post });
  } catch (error) {
    console.log("Error creating post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a post (for likes, comments, etc.)
app.put("/make-server-cfc924af/posts/:mode/:id", async (c) => {
  try {
    const mode = c.req.param("mode");
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const key = `post:${mode}:${id}`;
    const existingPost = await kv.get(key);
    
    if (!existingPost) {
      return c.json({ success: false, error: "Post not found" }, 404);
    }

    const updatedPost = { ...existingPost, ...body };
    await kv.set(key, updatedPost);
    
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log("Error updating post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a post
app.delete("/make-server-cfc924af/posts/:mode/:id", async (c) => {
  try {
    const mode = c.req.param("mode");
    const id = c.req.param("id");
    
    const key = `post:${mode}:${id}`;
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting post:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== JOBS ====================

// Get all jobs
app.get("/make-server-cfc924af/jobs", async (c) => {
  try {
    const jobs = await kv.getByPrefix("job:");
    return c.json({ success: true, jobs: jobs || [] });
  } catch (error) {
    console.log("Error fetching jobs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new job
app.post("/make-server-cfc924af/jobs", async (c) => {
  try {
    const job = await c.req.json();
    
    if (!job.id) {
      return c.json({ success: false, error: "Job ID is required" }, 400);
    }

    const key = `job:${job.id}`;
    await kv.set(key, job);
    
    return c.json({ success: true, job });
  } catch (error) {
    console.log("Error creating job:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a job
app.put("/make-server-cfc924af/jobs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const key = `job:${id}`;
    const existingJob = await kv.get(key);
    
    if (!existingJob) {
      return c.json({ success: false, error: "Job not found" }, 404);
    }

    const updatedJob = { ...existingJob, ...body };
    await kv.set(key, updatedJob);
    
    return c.json({ success: true, job: updatedJob });
  } catch (error) {
    console.log("Error updating job:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a job
app.delete("/make-server-cfc924af/jobs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `job:${id}`;
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting job:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== GIGS ====================

// Get all gigs
app.get("/make-server-cfc924af/gigs", async (c) => {
  try {
    const gigs = await kv.getByPrefix("gig:");
    return c.json({ success: true, gigs: gigs || [] });
  } catch (error) {
    console.log("Error fetching gigs:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new gig
app.post("/make-server-cfc924af/gigs", async (c) => {
  try {
    const gig = await c.req.json();
    
    if (!gig.id) {
      return c.json({ success: false, error: "Gig ID is required" }, 400);
    }

    const key = `gig:${gig.id}`;
    await kv.set(key, gig);
    
    return c.json({ success: true, gig });
  } catch (error) {
    console.log("Error creating gig:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a gig
app.put("/make-server-cfc924af/gigs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const key = `gig:${id}`;
    const existingGig = await kv.get(key);
    
    if (!existingGig) {
      return c.json({ success: false, error: "Gig not found" }, 404);
    }

    const updatedGig = { ...existingGig, ...body };
    await kv.set(key, updatedGig);
    
    return c.json({ success: true, gig: updatedGig });
  } catch (error) {
    console.log("Error updating gig:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a gig
app.delete("/make-server-cfc924af/gigs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const key = `gig:${id}`;
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting gig:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== USER PROFILES ====================

// Get all users (for admin dashboard)
app.get("/make-server-cfc924af/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    
    // Sort by creation date (newest first)
    const sortedUsers = users?.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) || [];
    
    return c.json({ success: true, users: sortedUsers });
  } catch (error) {
    console.log("Error fetching users:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user profile by userId
app.get("/make-server-cfc924af/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ success: false, error: "User profile not found" }, 404);
    }
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user profile
app.put("/make-server-cfc924af/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    
    const key = `user:${userId}`;
    const existingProfile = await kv.get(key);
    
    if (!existingProfile) {
      return c.json({ success: false, error: "User profile not found" }, 404);
    }

    const updatedProfile = { ...existingProfile, ...body };
    await kv.set(key, updatedProfile);
    
    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log("Error updating user profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user profile by mode (legacy - keep for compatibility)
app.get("/make-server-cfc924af/profile/:mode", async (c) => {
  try {
    const mode = c.req.param("mode");
    const profile = await kv.get(`profile:${mode}`);
    
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" }, 404);
    }
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error fetching profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user profile
app.put("/make-server-cfc924af/profile/:mode", async (c) => {
  try {
    const mode = c.req.param("mode");
    const body = await c.req.json();
    
    const key = `profile:${mode}`;
    await kv.set(key, body);
    
    return c.json({ success: true, profile: body });
  } catch (error) {
    console.log("Error updating profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== ANALYTICS/STATS ====================

// Get all data summary (for admin dashboard)
app.get("/make-server-cfc924af/stats", async (c) => {
  try {
    const professionalPosts = await kv.getByPrefix("post:professional:");
    const marketPosts = await kv.getByPrefix("post:market:");
    const jobs = await kv.getByPrefix("job:");
    const gigs = await kv.getByPrefix("gig:");
    const users = await kv.getByPrefix("user:");
    
    return c.json({
      success: true,
      stats: {
        users: users?.length || 0,
        professionalPosts: professionalPosts?.length || 0,
        marketPosts: marketPosts?.length || 0,
        jobs: jobs?.length || 0,
        gigs: gigs?.length || 0,
        totalPosts: (professionalPosts?.length || 0) + (marketPosts?.length || 0),
      }
    });
  } catch (error) {
    console.log("Error fetching stats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize database with sample data
app.post("/make-server-cfc924af/initialize", async (c) => {
  try {
    // This will be called from the frontend to populate initial data
    const { professionalPosts, marketPosts, jobs, gigs, profiles } = await c.req.json();
    
    // Store professional posts
    if (professionalPosts) {
      for (const post of professionalPosts) {
        await kv.set(`post:professional:${post.id}`, post);
      }
    }
    
    // Store market posts
    if (marketPosts) {
      for (const post of marketPosts) {
        await kv.set(`post:market:${post.id}`, post);
      }
    }
    
    // Store jobs
    if (jobs) {
      for (const job of jobs) {
        await kv.set(`job:${job.id}`, job);
      }
    }
    
    // Store gigs
    if (gigs) {
      for (const gig of gigs) {
        await kv.set(`gig:${gig.id}`, gig);
      }
    }
    
    // Store profiles
    if (profiles) {
      if (profiles.professional) {
        await kv.set("profile:professional", profiles.professional);
      }
      if (profiles.market) {
        await kv.set("profile:market", profiles.market);
      }
    }
    
    return c.json({ success: true, message: "Database initialized successfully" });
  } catch (error) {
    console.log("Error initializing database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);