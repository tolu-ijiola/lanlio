"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { signInWithEmail, signInWithOAuth } from "@/lib/supabase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data, error: signInError } = await signInWithEmail(email, password);
      
      if (signInError) {
        setError(signInError.message || "Failed to sign in. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Redirect to dashboard on successful login
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const { error: oauthError } = await signInWithOAuth('google');
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with Google.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleLinkedInSignIn = async () => {
    setError(null);
    try {
      const { error: oauthError } = await signInWithOAuth('linkedin');
      if (oauthError) {
        setError(oauthError.message || "Failed to sign in with LinkedIn.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted/20 p-4">
      <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
        

        {/* Authentication Tabs */}
        <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
          <CardHeader className="p-0 px-8 mb-2">
            <CardTitle className="text-2xl text-center font-semibold">
              Welcome Back
            </CardTitle>
            <CardDescription className="mb-6 text-center text-muted-foreground">
              Please enter your details.
            </CardDescription>
            
          </CardHeader>

          <CardContent className="p-0 px-8 ">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSignIn}>
              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="signin-email" className="mb-1 block text-xs font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    placeholder="lilareem@gmail.com"
                    type="email"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="signin-password" className="mb-1 block text-xs font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    placeholder="********"
                    type="password"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>

              <Button 
                type="submit"
                className="mb-4 w-full h-12"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Continue'}
              </Button>
            </form>

            <div className="flex justify-center mx-auto items-center gap-2">
              <Separator className="w-[20px] h-1 bg-border" />
              <p className="text-xs text-muted-foreground uppercase">OR</p>
              <Separator className="w-[20px] h-1 bg-border" />
            </div>

            {/* Social Logins */}
            <div className="my-4 flex items-center justify-center space-x-6">
              <Button
                size={'icon'}
                variant={'outline'}
                className="bg-background rounded-full border-border h-12 w-12 hover:bg-muted transition-colors"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Image 
                  src="/icon/google.png" 
                  alt="Google Sign In" 
                  width={20} 
                  height={20}
                  priority 
                />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                className="bg-background rounded-full border-border h-12 w-12 hover:bg-muted transition-colors"
                onClick={handleLinkedInSignIn}
                disabled={loading}
              >
                <Image 
                  src="/icon/linkedin.png" 
                  alt="LinkedIn Sign In" 
                  width={24} 
                  height={24}
                  priority 
                />
              </Button>
            </div>
<div className="my-12 text-center text-sm"> Don't have an account? <Link href="/register" className="text-primary hover:text-primary/80 underline">Sign up</Link></div>
            <p className="text-xs max-w-sm mx-auto text-center text-muted-foreground">
              Join the hundreds of developers to create their portfolio. 
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
