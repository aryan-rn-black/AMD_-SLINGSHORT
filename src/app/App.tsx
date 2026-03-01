import { useState, useEffect } from "react";
import { NavHeader } from "./components/nav-header";
import { ProfileDrawer } from "./components/profile-drawer";
import { ProfessionalDashboard } from "./components/professional-dashboard";
import { LocalMarketplace } from "./components/local-marketplace";
import { JobsDashboard } from "./components/jobs-dashboard";
import { GigsMarketplace } from "./components/gigs-marketplace";
import { ProfilePage } from "./components/profile-page";
import { SettingsPage } from "./components/settings-page";
import { AdminDashboard } from "./components/admin-dashboard";
import { AuthScreen } from "./components/auth-screen";
import { ResumeMaker } from "./components/resume-maker";
import { AdminControlPanel } from "./components/admin-control-panel";
import type { Screen, Mode, Post, PersonalInfo } from "./components/types";
import { IMAGES } from "./components/types";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

// Initial professional posts
const initialProfPosts: Post[] = [
  {
    id: "p1",
    author: "Sarah Chen",
    authorAvatar: IMAGES.sarahPhoto,
    tag: "#Hiring",
    content: "We're looking for a Senior React Developer to join our team! Must have 5+ years experience with React, TypeScript, and Node.js. Remote-friendly position with competitive salary. DM me if interested! 🚀",
    image: IMAGES.coding,
    timestamp: "2h ago",
    replies: 12,
    bookmarks: 8,
    likes: 45,
    isLiked: false,
    comments: [
      { id: "c1", author: "Alex Kumar", authorAvatar: "", content: "This sounds like a great opportunity!", timestamp: "1h ago" },
    ],
  },
  {
    id: "p2",
    author: "Alex Kumar",
    authorAvatar: IMAGES.aryanPhoto,
    tag: "#TechUpdate",
    content: "Excited to announce our new design system! After months of work, we've created a comprehensive component library that will streamline our development process. Check it out!",
    image: IMAGES.uiDesign,
    timestamp: "5h ago",
    replies: 8,
    bookmarks: 15,
    likes: 72,
    isLiked: false,
    comments: [
      { id: "c2", author: "Maya Patel", authorAvatar: "", content: "This looks amazing! Great work 🎨", timestamp: "4h ago" },
    ],
  },
  {
    id: "p3",
    author: "Maya Patel",
    authorAvatar: IMAGES.sarahPhoto,
    tag: "#ProjectShowcase",
    content: "Just finished building this e-commerce platform with React and Next.js. Features include real-time inventory, AI-powered recommendations, and a smooth checkout flow. What do you think?",
    image: IMAGES.ecommerce,
    timestamp: "1d ago",
    replies: 24,
    bookmarks: 32,
    likes: 128,
    isLiked: false,
    comments: [],
  },
];

// Initial marketplace posts
const initialMarketPosts: Post[] = [
  {
    id: "m1",
    author: "Rajesh Kumar",
    authorAvatar: IMAGES.aryanPhoto,
    tag: "#Hiring",
    content: "Need a delivery partner for our cloud kitchen in Raipur Center. Must have own bike and smartphone. Flexible hours, daily payment. Contact us ASAP!",
    image: IMAGES.restaurant,
    timestamp: "1h ago",
    replies: 5,
    bookmarks: 3,
    likes: 18,
    isLiked: false,
    comments: [
      { id: "mc1", author: "Amit Singh", authorAvatar: "", content: "Interested! What are the timings?", timestamp: "30 min ago" },
    ],
  },
  {
    id: "m2",
    author: "Priya Sharma",
    authorAvatar: IMAGES.sarahPhoto,
    tag: "#LocalBusiness",
    content: "Just opened my new boutique in Sector 21! 🎉 We're hiring a sales assistant with experience in fashion retail. Great team, good pay, and employee discounts. Walk-in interviews this week!",
    image: IMAGES.boutique,
    timestamp: "3h ago",
    replies: 12,
    bookmarks: 7,
    likes: 34,
    isLiked: false,
    comments: [],
  },
  {
    id: "m3",
    author: "Amit Verma",
    authorAvatar: IMAGES.aryanPhoto,
    tag: "#QuickGig",
    content: "Urgent: Need 2 people for furniture loading/unloading tomorrow morning. Location: Marine Drive warehouse. Pay: ₹800 for 3 hours of work. WhatsApp me for details!",
    image: IMAGES.furniture,
    timestamp: "6h ago",
    replies: 8,
    bookmarks: 2,
    likes: 11,
    isLiked: false,
    comments: [
      { id: "mc2", author: "Vikram", authorAvatar: "", content: "I'm available tomorrow. Sending WhatsApp.", timestamp: "5h ago" },
    ],
  },
];

const initialProfInfo: PersonalInfo = {
  name: "Sarah Chen",
  dob: "1995-06-15",
  email: "sarah.chen@example.com",
  phone: "+1 (555) 123-4567",
  title: "Senior Full Stack Developer",
  location: "San Francisco, CA",
  bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. I love working with React, TypeScript, and cloud technologies. When I'm not coding, you can find me mentoring junior developers or contributing to open-source projects.",
};

const initialMarketInfo: PersonalInfo = {
  name: "Aryan Patidar",
  dob: "1998-03-22",
  email: "aryan.patidar@example.com",
  phone: "+91 98765 43210",
  title: "Freelance Developer & Local Entrepreneur",
  location: "Raipur, CG",
  bio: "Building digital solutions for local businesses. I help small shops and restaurants set up their online presence. Also available for freelance web development and event photography.",
};

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    
    // Listen for auth state changes (like signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        // User logged out
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken("");
        setIsAdmin(false);
        setActiveScreen("auth");
      } else if (session.user) {
        // User logged in
        setUser(session.user);
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        
        // Load user profile from database
        await loadUserProfile(session.user.id);
        
        if (session.user.email === "admin@infolio.com") {
          setIsAdmin(true);
        }
        
        //Load posts from database
        await loadPosts();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/user/${userId}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      
      if (data.success && data.profile) {
        const profile = data.profile;
        
        // Create PersonalInfo from profile data
        const userPersonalInfo: PersonalInfo = {
          name: profile.full_name || profile.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
          email: profile.email || user?.email || "",
          phone: profile.phone || "",
          dob: profile.dob || profile.date_of_birth || "",
          title: profile.title || profile.job_title || "Professional",
          location: profile.location || "",
          bio: profile.bio || profile.about || "",
        };
        
        console.log("Loaded user profile:", userPersonalInfo);
        
        // Update profile images
        if (profile.profile_photo || profile.profilePhoto) {
          const photoUrl = profile.profile_photo || profile.profilePhoto;
          setProfProfilePhoto(photoUrl);
          setMarketProfilePhoto(photoUrl);
        }
        
        if (profile.banner_image || profile.bannerImage) {
          const bannerUrl = profile.banner_image || profile.bannerImage;
          setProfBannerImage(bannerUrl);
          setMarketBannerImage(bannerUrl);
        }
        
        // Update personal info for both modes
        setProfPersonalInfo(userPersonalInfo);
        setMarketPersonalInfo(userPersonalInfo);
      } else {
        console.warn("No profile data found, creating default profile");
        // Create default profile from auth user data
        const defaultInfo: PersonalInfo = {
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
          email: user?.email || "",
          phone: "",
          dob: "",
          title: "Professional",
          location: "",
          bio: "",
        };
        setProfPersonalInfo(defaultInfo);
        setMarketPersonalInfo(defaultInfo);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Fallback to auth user data
      if (user) {
        const fallbackInfo: PersonalInfo = {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
          email: user.email || "",
          phone: "",
          dob: "",
          title: "Professional",
          location: "",
          bio: "",
        };
        setProfPersonalInfo(fallbackInfo);
        setMarketPersonalInfo(fallbackInfo);
      }
    }
  };

  const loadPosts = async () => {
    try {
      // Load professional posts
      const profResponse = await fetch(`${API_BASE}/posts/professional`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const profData = await profResponse.json();
      if (profData.success && profData.posts && profData.posts.length > 0) {
        setProfessionalPosts(profData.posts);
      }

      // Load market posts
      const marketResponse = await fetch(`${API_BASE}/posts/market`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const marketData = await marketResponse.json();
      if (marketData.success && marketData.posts && marketData.posts.length > 0) {
        setMarketplacePosts(marketData.posts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        
        // Load user profile from database
        await loadUserProfile(session.user.id);
        
        // Check if user is admin (you can customize this logic)
        if (session.user.email === "admin@infolio.com") {
          setIsAdmin(true);
        }
        
        // Load posts
        await loadPosts();
        
        // Navigate to dashboard if logged in
        setActiveScreen("dashboard");
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleAuthSuccess = async (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
    setIsAuthenticated(true);
    // Check if user is admin
    if (userData.email === "admin@infolio.com") {
      setIsAdmin(true);
    }
    
    // Load user profile
    await loadUserProfile(userData.id);
    
    // Load posts
    await loadPosts();
    
    setActiveScreen("dashboard");
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken("");
      setIsAdmin(false);
      setActiveScreen("auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Navigation
  const [activeScreen, setActiveScreen] = useState<Screen>("auth");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<Mode>("market");

  // Professional mode data
  const [professionalPosts, setProfessionalPosts] = useState<Post[]>(initialProfPosts);
  const [profProfilePhoto, setProfProfilePhoto] = useState(IMAGES.sarahPhoto);
  const [profBannerImage, setProfBannerImage] = useState(IMAGES.techBanner);
  const [profPersonalInfo, setProfPersonalInfo] = useState<PersonalInfo>(initialProfInfo);

  // Market mode data
  const [marketplacePosts, setMarketplacePosts] = useState<Post[]>(initialMarketPosts);
  const [marketProfilePhoto, setMarketProfilePhoto] = useState(IMAGES.aryanPhoto);
  const [marketBannerImage, setMarketBannerImage] = useState(IMAGES.colorfulBanner);
  const [marketPersonalInfo, setMarketPersonalInfo] = useState<PersonalInfo>(initialMarketInfo);

  // Derive current mode
  const currentMode: Mode =
    activeScreen === "marketplace" || activeScreen === "gigs"
      ? "market"
      : activeScreen === "profile"
      ? profileMode
      : "professional";

  const currentProfilePhoto = currentMode === "professional" ? profProfilePhoto : marketProfilePhoto;
  const currentPersonalInfo = currentMode === "professional" ? profPersonalInfo : marketPersonalInfo;

  const handleNavigateToProfile = () => {
    if (activeScreen === "marketplace" || activeScreen === "gigs") {
      setProfileMode("market");
    } else {
      setProfileMode("professional");
    }
    setActiveScreen("profile");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background - For Market, Gigs, Professional, and Jobs pages */}
      {(activeScreen === "marketplace" || activeScreen === "gigs" || activeScreen === "dashboard" || activeScreen === "jobs") && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(230, 230, 250, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(255, 182, 193, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(221, 160, 221, 0.2) 0%, transparent 50%), linear-gradient(135deg, #f8f0ff 0%, #fff0f5 50%, #f5e6ff 100%)',
            backgroundColor: '#faf5ff',
          }}
        />
      )}
      
      <div className="relative z-10">
        {/* Nav header - show on all screens except when gigs has its own gradient */}
        {activeScreen !== "gigs" && activeScreen !== "auth" && (
          <NavHeader
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            onToggleDrawer={() => setIsDrawerOpen(true)}
            onNavigateToProfile={handleNavigateToProfile}
            currentMode={currentMode}
            profilePhoto={currentProfilePhoto}
          />
        )}

        {/* For gigs screen, show header with gradient */}
        {activeScreen === "gigs" && (
          <NavHeader
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            onToggleDrawer={() => setIsDrawerOpen(true)}
            onNavigateToProfile={handleNavigateToProfile}
            currentMode={currentMode}
            profilePhoto={currentProfilePhoto}
          />
        )}

        {/* Profile Drawer */}
        <ProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          profilePhoto={currentProfilePhoto}
          personalInfo={currentPersonalInfo}
          setActiveScreen={(s) => {
            setActiveScreen(s);
            setIsDrawerOpen(false);
          }}
          onNavigateToProfile={handleNavigateToProfile}
        />

        {/* Screens */}
        {activeScreen === "dashboard" && (
          <ProfessionalDashboard
            posts={professionalPosts}
            setPosts={setProfessionalPosts}
            profilePhoto={profProfilePhoto}
            setActiveScreen={setActiveScreen}
            personalInfo={profPersonalInfo}
          />
        )}

        {activeScreen === "marketplace" && (
          <LocalMarketplace
            posts={marketplacePosts}
            setPosts={setMarketplacePosts}
            profilePhoto={marketProfilePhoto}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === "jobs" && (
          <JobsDashboard setActiveScreen={setActiveScreen} />
        )}

        {activeScreen === "gigs" && (
          <GigsMarketplace setActiveScreen={setActiveScreen} />
        )}

        {activeScreen === "profile" && profileMode === "professional" && (
          <ProfilePage
            mode="professional"
            profilePhoto={profProfilePhoto}
            bannerImage={profBannerImage}
            personalInfo={profPersonalInfo}
            setPersonalInfo={setProfPersonalInfo}
            posts={professionalPosts}
            setPosts={setProfessionalPosts}
            onProfilePhotoChange={setProfProfilePhoto}
            onBannerChange={setProfBannerImage}
          />
        )}

        {activeScreen === "profile" && profileMode === "market" && (
          <ProfilePage
            mode="market"
            profilePhoto={marketProfilePhoto}
            bannerImage={marketBannerImage}
            personalInfo={marketPersonalInfo}
            setPersonalInfo={setMarketPersonalInfo}
            posts={marketplacePosts}
            setPosts={setMarketplacePosts}
            onProfilePhotoChange={setMarketProfilePhoto}
            onBannerChange={setMarketBannerImage}
          />
        )}

        {activeScreen === "settings" && (
          <SettingsPage
            setActiveScreen={setActiveScreen}
            profilePhoto={currentProfilePhoto}
            personalInfo={currentPersonalInfo}
            mode={currentMode}
            isAdmin={isAdmin}
          />
        )}

        {activeScreen === "admin" && (
          <AdminDashboard setActiveScreen={setActiveScreen} />
        )}

        {activeScreen === "auth" && (
          <AuthScreen setActiveScreen={setActiveScreen} onAuthSuccess={handleAuthSuccess} />
        )}

        {activeScreen === "resume" && (
          <ResumeMaker setActiveScreen={setActiveScreen} userId="demo-user-001" />
        )}

        {activeScreen === "admin-control" && (
          <AdminControlPanel setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === "nav" && (
          <AdminControlPanel setActiveScreen={setActiveScreen} />
        )}
      </div>
    </div>
  );
}