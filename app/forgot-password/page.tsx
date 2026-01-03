"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Globe } from "lucide-react";
import { resetPassword } from "@/lib/supabase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { data, error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message || "Failed to send reset email. Please try again.");
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

  const handleResendEmail = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);
    
    try {
      const { error: resendError } = await resetPassword(email);
      
      if (resendError) {
        setError(resendError.message || "Failed to resend email. Please try again.");
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Success state (email sent)
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
              <Link href="/register" className="text-sm text-foreground hover:text-primary transition-colors">
                Sign up
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
                  To verify your identity, you'll receive an email shortly at <strong className="text-foreground font-semibold">{email}</strong> to reset your password.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Resend Email'
                  )}
                </Button>

                {resendSuccess && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary text-center">Email sent successfully!</p>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive text-center">{error}</p>
                  </div>
                )}

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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Forgot Password Card */}
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Forgot password?</h1>
              <p className="text-sm text-muted-foreground">
                No worries, we'll send you reset instructions
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

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
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Send Reset Link Button */}
              <Button 
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>

            {/* Back to Sign In Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
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
    </div>
  );
}
