"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Fingerprint } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const supabaseProjectRef =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "";
const supabaseUsersUrl = supabaseProjectRef
  ? `https://supabase.com/dashboard/project/${supabaseProjectRef}/auth/users`
  : "https://supabase.com/dashboard";

function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password. Sign in with the email address from your Supabase Auth user.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email not confirmed. Confirm your email in Supabase, or ask an admin to confirm your account.";
  }
  return message;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "auth_callback") {
      setError("Sign-in link expired or failed. Sign in with your email and password.");
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address (Supabase Auth uses email, not username).");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(formatAuthError(authError.message));
      return;
    }

    if (!data.session) {
      setError("Sign-in succeeded but no session was created. Try again.");
      return;
    }

    router.refresh();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">

      {/* ─── LEFT PANEL: Login Form ─────────────────────────────── */}
      <div className="flex flex-col items-center justify-center w-full max-w-[460px] min-h-screen bg-white px-12 py-10 border-r border-gray-100 z-10 relative">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logofaisal.jpg"
            alt="Nexora Invoices Logo"
            width={100}
            height={100}
            priority
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 text-center">
          Faisal Abdullah Muhammed Ramadan Est.
        </h1>
        <p className="text-sm text-gray-400 mb-2">Sign in with your Supabase Auth user</p>
        <p className="text-xs text-gray-400 mb-4 text-center leading-relaxed">
          Use the <strong>email</strong> and <strong>password</strong> from your Supabase Auth user
          {supabaseProjectRef ? ` (project ${supabaseProjectRef})` : ""}.
        </p>
        <p className="text-xs text-center mb-8">
          <a
            href={supabaseUsersUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open Supabase → Authentication → Users
          </a>
        </p>

        {/* Error */}
        {error && (
          <div className="w-full mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="w-full mb-4">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors placeholder-gray-400 bg-white"
          />
        </div>

        {/* Password */}
        <div className="w-full mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors placeholder-gray-400 pr-12 bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded text-gray-800 text-sm font-semibold tracking-wider border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <Fingerprint size={18} />
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Version */}
        <p className="mt-8 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
          Version: 1.0
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center text-xs text-gray-400">
          Engineered and developed by{" "}
          <a
            href="https://www.nexoratech.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:underline font-medium"
          >
            Nexora Tech
          </a>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Branding ──────────────────────────────── */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-gray-50">

        <div className="relative z-10 flex flex-col items-center text-center px-8">

          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/nexora-logo.png"
              alt="Nexora Invoices"
              width={300}
              height={300}
              priority
              
            />
          </div>

          {/* Tagline */}
          <p className="text-lg font-semibold text-gray-700 tracking-wide mb-2">
            Smart Invoicing for Modern Business
          </p>

          {/* Divider */}
          <div className="w-10 h-px bg-gray-200 mb-6" />

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              "✓ Saudi QR Reader Compatible",
              "Tax Invoices",
              "Customer Management",
              "Real-time Data",
              "Print & Export",
              "VAT 15% Auto Calc",
            ].map((f) => (
              <span
                key={f}
                className="text-[11px] px-3 py-1 rounded-full font-medium bg-white text-gray-500 border border-gray-200"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
