"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Loader2, Globe } from "lucide-react";
import { signUpWithEmail, signInWithOAuth } from "@/lib/supabase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await signUpWithEmail(
        email,
        password,
        { firstName, lastName }
      );

      if (signUpError) {
        setError(signUpError.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success - show confirmation message
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { error: oauthError } = await signInWithOAuth("google");
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with Google");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { error: oauthError } = await signInWithOAuth("linkedin");
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with LinkedIn");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Success state (email confirmation sent)
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-20 w-64 h-64 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 100 Q50 50 100 100 T180 100" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
              <rect x="40" y="40" width="60" height="40" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground"/>
            </svg>
          </div>
        </div>

        <header className="relative z-10 w-full px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={120} height={32} priority />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Sales@Razor.uk</span>
              </Link>
              <Link href="/login" className="text-sm text-foreground hover:text-primary transition-colors">
                Sign in
              </Link>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Request Demo
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-3xl shadow-lg border border-border p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
                <p className="text-sm text-muted-foreground">
                  To verify your identity, you'll receive an email shortly at <strong className="text-foreground font-semibold">{email}</strong> to confirm your account.
                </p>
              </div>

              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                    Back to Sign In
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">
                  Nothing in sight? Check your{" "}
                  <span className="text-primary hover:text-primary/80 underline">spam folder</span> or visit our{" "}
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

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
     

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create an account</h1>
              <p className="text-sm text-muted-foreground">
                Sign up to get started with your portfolio
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
                disabled={isLoading}
                className="h-12 rounded-xl border-border hover:bg-muted flex items-center justify-center gap-2 hover:text-foreground w-full"
              >
                <Image src="/icon/google.png" alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleLinkedInSignIn}
                disabled={isLoading}
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-xs font-medium text-foreground mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs font-medium text-foreground mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="text-xs font-medium text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground mb-2 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button 
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
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
