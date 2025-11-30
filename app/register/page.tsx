"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeClosed } from "lucide-react";
import { signUpWithEmail, signInWithOAuth, resendEmailConfirmation } from "@/lib/supabase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error: signUpError } = await signUpWithEmail(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
      );
      
      if (signUpError) {
        setError(signUpError.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required
        setSuccess(true);
        setIsLoading(false);
      } else if (data?.user && data.session) {
        // Auto-confirmed, redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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

  const handleResendEmail = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);
    
    try {
      const { error: resendError } = await resendEmailConfirmation(formData.email);
      
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-none bg-background rounded-2xl">
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
                  To verify your identity, you'll receive an email shortly at <strong className="text-foreground font-semibold">{formData.email}</strong> to activate your account.
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
                  Nothing in sight? Check your <span className="text-primary hover:text-primary/80 underline">spam folder</span> or visit our{" "}
                  <Link href="/learn" className="text-primary hover:text-primary/80 underline">
                    Learn hub
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-card to-muted/20 p-4">
      <section className="flex w-full max-w-2xl flex-col justify-center px-8 py-8 sm:px-12 lg:px-16">
        

        {/* Authentication Tabs */}
        <Card className="border-none shadow-none bg-[#F7F5F3] rounded-md">
          <CardHeader className="p-0 px-8 mb-2">
            <CardTitle className="text-2xl text-center font-semibold">
              Create Account
            </CardTitle>
            <CardDescription className="mb-6 text-center text-muted-foreground">
              Get started with your free account.
            </CardDescription>
            
          </CardHeader>

          <CardContent className="p-0 px-8 ">
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                  <User className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <Label htmlFor="firstName" className="mb-1 block text-xs font-medium text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                  <User className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <Label htmlFor="lastName" className="mb-1 block text-xs font-medium text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="password" className="mb-1 block text-xs font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <Eye className="w-5 h-5 text-muted-foreground shrink-0"/> : <EyeClosed className="w-5 h-5 text-muted-foreground shrink-0"/>}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4 border border-border rounded-xl p-2 px-4 flex gap-2 items-center bg-card hover:border-primary/50 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                <Separator orientation="vertical" className="h-full w-1 bg-border" />
                <div className="flex-1">
                  <Label htmlFor="confirmPassword" className="mb-1 block text-xs font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    className="border-none shadow-none px-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5 text-muted-foreground shrink-0"/> : <EyeClosed className="w-5 h-5 text-muted-foreground shrink-0"/>}
                </button>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                  className="mt-1"
                  disabled={isLoading}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit"
                className="mb-4 w-full h-12"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? 'Creating account...' : 'Continue'}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
<div className="my-12 text-center text-sm"> Don't have an account? <Link href="/login" className="text-primary hover:text-primary/80 underline">Sign in</Link></div>
            <p className="text-xs max-w-sm mx-auto text-center text-muted-foreground">
              Join the hundreds of developers to create their portfolio. 
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
