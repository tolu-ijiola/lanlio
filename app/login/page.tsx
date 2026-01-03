"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, Globe } from "lucide-react";
import { signInWithEmail, signInWithOAuth } from "@/lib/supabase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: oauthError } = await signInWithOAuth("google");
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with Google");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: oauthError } = await signInWithOAuth("linkedin");
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with LinkedIn");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="h-12 rounded-xl border-border hover:bg-muted flex items-center justify-center gap-2 hover:text-foreground w-full"
              >
                <Image src="/icon/google.png" alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLinkedInSignIn}
                disabled={loading}
                className="h-12 rounded-xl border-border hover:bg-muted flex items-center justify-center gap-2 hover:text-foreground w-full"
              >
                <Image src="/icon/linkedin.png" alt="LinkedIn" width={20} height={20} />
                <span className="text-sm font-medium">LinkedIn</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-foreground mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="lilareem@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    required
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">
                    Password
                  </Label>
                  <Link 
                    href="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    required
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground text-center">
                Need help? Explore our{" "}
                <Link href="/learn" className="text-primary hover:text-primary/80 underline">
                  Learn hub
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Copyright @wework 2022 | Privacy Policy
        </p>
      </footer>
    </div>
  );
}
