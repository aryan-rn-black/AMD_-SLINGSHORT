import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Briefcase, ShoppingBag, AlertCircle } from "lucide-react";
import type { Screen } from "./types";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { supabase } from "../../utils/supabase/client";

interface AuthScreenProps {
  setActiveScreen: (screen: Screen) => void;
  onAuthSuccess: (user: any, accessToken: string) => void;
}

export function AuthScreen({ setActiveScreen, onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMode, setSelectedMode] = useState("professional");

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  // Clear any stale sessions on mount
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Found existing session on auth screen mount:", session.user.email);
      }
    });
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !email.trim() || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log("Attempting signup with email:", normalizedEmail);

    try {
      // Try calling backend first
      console.log("Making signup request to:", `${API_BASE}/auth/signup`);
      
      let backendSuccess = false;
      
      try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
          body: JSON.stringify({ 
            email: normalizedEmail, 
            password, 
            name: name.trim(), 
            mode: selectedMode 
          }),
        });

        console.log("Signup response status:", response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log("Signup response:", data);

          if (data.success) {
            backendSuccess = true;
          } else {
            // Handle duplicate user case
            if (data.error?.includes("already been registered") || data.error?.includes("already exists")) {
              setError("An account with this email already exists. Please sign in instead.");
              setLoading(false);
              setTimeout(() => {
                setIsLogin(true);
                setEmail(normalizedEmail);
                setPassword("");
              }, 2000);
              return;
            } else {
              throw new Error(data.error || "Signup failed");
            }
          }
        } else {
          const errorText = await response.text();
          console.error("Signup HTTP error:", response.status, errorText);
          throw new Error(`Backend error: ${response.status}`);
        }
      } catch (fetchError) {
        console.warn("Backend signup failed, will try direct Supabase signup:", fetchError);
        // Fall through to direct signup
      }

      // If backend didn't succeed, create user directly via Supabase
      if (!backendSuccess) {
        console.log("Creating user directly via Supabase Auth...");
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
              preferred_mode: selectedMode,
            }
          }
        });

        if (signupError) {
          console.error("Direct signup error:", signupError);
          if (signupError.message.includes("already registered")) {
            setError("An account with this email already exists. Please sign in instead.");
            setLoading(false);
            setTimeout(() => {
              setIsLogin(true);
              setEmail(normalizedEmail);
              setPassword("");
            }, 2000);
            return;
          }
          throw signupError;
        }

        // Create profile in database
        if (signupData.user) {
          console.log("User created, now creating profile...");
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: signupData.user.id,
                email: normalizedEmail,
                full_name: name.trim(),
                preferred_mode: selectedMode,
                created_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error("Profile creation error:", profileError);
              // Continue anyway - profile might already exist
            }
          } catch (profileErr) {
            console.error("Profile creation failed:", profileErr);
            // Continue anyway
          }
        }

        backendSuccess = true;
      }

      console.log("User created successfully, attempting auto sign-in...");

      // Wait a bit to ensure user is fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now sign in the user client-side
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        console.error("Post-signup sign-in error:", signInError.message);
        // Show a friendly message and switch to login mode
        setError("Account created successfully! Please sign in with your credentials.");
        setLoading(false);
        // Auto-switch to login mode after showing success message
        setTimeout(() => {
          setIsLogin(true);
          setEmail(normalizedEmail);
          setPassword("");
          setError("");
        }, 2000);
        return;
      }

      if (authData.session) {
        console.log("Sign-in successful after signup!");
        onAuthSuccess(authData.user, authData.session.access_token);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error during signup. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        console.error("Sign-in error:", signInError);
        if (signInError.message === "Invalid login credentials") {
          setError(
            "Invalid email or password. If you don't have an account yet, please click 'Sign Up' to create one first."
          );
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        onAuthSuccess(data.user, data.session.access_token);
      }
    } catch (err: any) {
      console.error("Sign-in catch error:", err);
      setError("Network error during sign in. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white">IF</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700 }} className="text-gray-900 mb-2">
            Welcome to In-Folio
          </h1>
          <p className="text-[15px] text-gray-600">
            {isLogin ? "Sign in to your account" : "Create your professional network"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[14px] transition-all ${
                isLogin
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ fontWeight: isLogin ? 600 : 400 }}
            >
              <Lock className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-[14px] transition-all ${
                !isLogin
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ fontWeight: !isLogin ? 600 : 400 }}
            >
              <Briefcase className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isLogin ? handleSignIn : handleSignup} className="space-y-4">
            {/* Name Field (Sign Up only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-[12px] text-gray-500">Must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-[15px] hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </span>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-purple-600 hover:text-purple-700"
                style={{ fontWeight: 600 }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-[12px] text-blue-800" style={{ fontWeight: 600 }}>
            💡 Demo Tip
          </p>
          <p className="text-[12px] text-blue-700 mt-1">
            Create a new account with any email (e.g., test@example.com) and password (min 6 chars)
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-[12px] text-gray-700" style={{ fontWeight: 600 }}>
            🔧 Having issues signing in?
          </p>
          <ul className="text-[11px] text-gray-600 mt-2 space-y-1 ml-4 list-disc">
            <li>Make sure you're using the same email and password you signed up with</li>
            <li>Emails are case-insensitive (test@example.com = TEST@example.com)</li>
            <li>Check the browser console (F12) for detailed error logs</li>
            <li>If signup succeeded but login fails, wait a few seconds and try again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}