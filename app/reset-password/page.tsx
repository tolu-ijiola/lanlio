"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session/token from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidToken(true);
      } else {
        // Check if there's a hash in the URL (Supabase redirects with hash)
        const hash = window.location.hash;
        if (hash) {
          // Try to get session from hash
          const { data, error } = await supabase.auth.getSession();
          if (data.session) {
            setIsValidToken(true);
          } else {
            setIsValidToken(false);
            setError("Invalid or expired reset link. Please request a new one.");
          }
        } else {
          setIsValidToken(false);
          setError("No reset token found. Please request a new password reset.");
        }
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted/20 p-4">
        <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
          <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
            <CardContent className="p-0 px-8 py-8">
              <div className="text-center">
                <p className="text-muted-foreground">Verifying reset link...</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted/20 p-4">
        <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
          <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
            <CardHeader className="p-0 px-8 mb-2">
              <CardTitle className="text-2xl text-center font-semibold">
                Invalid Reset Link
              </CardTitle>
              <CardDescription className="mb-6 text-center text-muted-foreground">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-8 ">
              <div className="text-center space-y-4">
                <Link href="/forgot-password">
                  <Button className="w-full mb-4">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link 
                  href="/login"
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted/20 p-4">
        <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
          <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
            <CardHeader className="p-0 px-8 mb-2">
              <CardTitle className="text-2xl text-center font-semibold">
                Password Updated
              </CardTitle>
              <CardDescription className="mb-6 text-center text-muted-foreground">
                Your password has been successfully updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-8 ">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to login page...
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
        <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
          <CardHeader className="p-0 px-8 mb-2">
            <CardTitle className="text-2xl text-center font-semibold">
              Reset Password
            </CardTitle>
            <CardDescription className="mb-6 text-center text-muted-foreground">
              Enter your new password below.
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
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="password" className="mb-1 block text-xs font-medium text-foreground">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="confirmPassword" className="mb-1 block text-xs font-medium text-foreground">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Updating password...' : 'Update Password'}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}





























