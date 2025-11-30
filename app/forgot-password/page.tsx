"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { resetPassword } from "@/lib/supabase/auth";
import Image from "next/image";

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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-primary/10 to-accent/10 p-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-xl bg-background rounded-2xl">
            <CardHeader className="p-8 pb-6">
              <div className="flex justify-center mb-6">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="Resfolio Logo"
                    width={120}
                    height={32}
                    priority
                  />
                </Link>
              </div>
              <CardTitle className="text-3xl text-center font-semibold mb-2">
                Check Your Email
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <p className="text-center text-muted-foreground text-sm leading-relaxed">
                  To verify your identity, you'll receive an email shortly at <strong className="text-foreground font-semibold">{email}</strong> to reset your password.
                </p>
                
                <Button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full h-12"
                >
                  {resending ? 'Sending...' : 'Resend Email'}
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
            </CardContent>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-6">
            <Link href="/terms" className="text-primary hover:text-primary/80 underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link> apply.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-card to-muted/20 p-4">
      <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
        

        {/* Authentication Card */}
        <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
          <CardHeader className="p-0 px-8 mb-2">
            <CardTitle className="text-2xl text-center font-semibold">
              Forgot Password?
            </CardTitle>
            <CardDescription className="mb-6 text-center text-muted-foreground">
              No worries, we'll send you reset instructions.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 px-8 ">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="email" className="mb-1 block text-xs font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="lilareem@gmail.com"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="mb-4 w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                Need help? Explore our{" "}
                <Link href="/learn" className="text-primary hover:text-primary/80 underline">
                  Learn hub
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
