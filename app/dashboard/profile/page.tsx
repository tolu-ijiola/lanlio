"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Globe, 
  MapPin, 
  Briefcase, 
  Award,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  Edit,
  Plus,
  Upload,
  FileUp,
  Sparkles,
  Crown,
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Download,
  Trash2,
  FileText
} from "lucide-react";
import Image from "next/image";
import { getResumes, uploadResumeFile, deleteResume, createResume, type ResumeData } from "@/lib/supabase/resumes";
import { getCurrentUserId } from "@/lib/supabase/auth";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [openAICredits, setOpenAICredits] = useState<number | null>(null);
  
  // Mock data - replace with actual data
  const profileData = {
    name: "John Doe",
    role: "Premium User",
    avatar: null,
    jobTitle: "Senior Software Engineer",
    experience: "5+ years",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate software engineer with expertise in full-stack development. I specialize in building scalable web applications using modern technologies.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    availability: true,
  };

  // Fetch resumes on component mount
  useEffect(() => {
    loadResumes();
    loadOpenAICredits();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (error) {
      console.error("Error loading resumes:", error);
    }
  };

  const loadOpenAICredits = async () => {
    // Mock OpenAI credits - replace with actual API call
    // For now, we'll use a placeholder value
    setOpenAICredits(1000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setIsUploading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        alert('Please log in to upload a resume');
        return;
      }

      // Upload file to storage
      const fileUrl = await uploadResumeFile(file, userId);
      if (!fileUrl) {
        alert('Failed to upload resume file');
        return;
      }

      // Create resume record (simplified - just store file URL and name)
      // In a real app, you might want to parse the resume here
      const resumeData: Omit<ResumeData, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        name: file.name,
        full_name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        email: "",
        phone: "",
        job_title: "",
        experience: "",
        location: "",
        bio: "",
        skills: [],
        education: "",
        work_history: "",
        file_url: fileUrl,
      };

      // Create resume record
      const newResume = await createResume(resumeData);
      
      if (newResume) {
        await loadResumes();
        alert('Resume uploaded successfully!');
      } else {
        alert('Failed to save resume');
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert('Error uploading resume. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const success = await deleteResume(id);
      if (success) {
        await loadResumes();
      } else {
        alert('Failed to delete resume');
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert('Error deleting resume. Please try again.');
    }
  };

  const handleDownloadResume = (fileUrl: string, fileName: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 h-11 rounded-full border-border/50 bg-muted/30 focus:bg-background"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full hover:bg-muted/50"
              >
                <Bell className="size-5 text-foreground" />
              </Button>

              {/* Premium Badge */}
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full hover:bg-muted/50 relative"
              >
                <Crown className="size-5 text-amber-500" />
                <span className="absolute -top-1 -right-1 size-2.5 bg-amber-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 pl-3 border-l border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 flex items-center justify-center">
                          <User className="size-5 text-primary" />
                        </div>
                        {profileData.availability && (
                          <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-semibold text-foreground">{profileData.name}</p>
                        <p className="text-xs text-muted-foreground">{profileData.role}</p>
                      </div>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{profileData.name}</p>
                      <p className="text-xs text-muted-foreground">{profileData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Crown className="mr-2 size-4 text-amber-500" />
                    <span>Upgrade to Premium</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Profile</h2>
                    <p className="text-xs text-muted-foreground">View all your profile details here.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="size-4 text-muted-foreground" />
                  </Button>
                </div>

                {/* Profile Card */}
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6 border border-border/50">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="size-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-4 border-background shadow-lg flex items-center justify-center">
                        {profileData.avatar ? (
                          <Image
                            src={profileData.avatar}
                            alt={profileData.name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <User className="size-12 text-primary" />
                        )}
                      </div>
                      {profileData.availability && (
                        <div className="absolute bottom-2 right-2 size-4 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{profileData.name}</h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <Crown className="size-4 text-amber-500" />
                        <p className="text-sm font-medium text-amber-600">{profileData.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OpenAI Credits Section */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">OpenAI Credits</h2>
                    <p className="text-xs text-muted-foreground">Your available API credits</p>
                  </div>
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {openAICredits !== null ? openAICredits.toLocaleString() : '---'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Available Credits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Websites */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Other Details */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Bio & other details</h2>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">My Role</label>
                        <Input defaultValue={profileData.jobTitle} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">My Experience Level</label>
                        <Input defaultValue={profileData.experience} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                        <Textarea defaultValue={profileData.bio} rows={4} className="mt-1" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <Briefcase className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">My Role</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{profileData.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">My Experience Level</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{profileData.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">My City or Region</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{profileData.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Phone</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Availability</p>
                        <div className="flex items-center gap-2">
                          <div className="size-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-semibold text-foreground">Available for Projects</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Social Media</h2>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Globe className="size-6 text-red-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <Linkedin className="size-6 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Github className="size-6 text-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full hover:bg-sky-50 hover:border-sky-200 transition-colors"
                  >
                    <Twitter className="size-6 text-sky-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-dashed hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="size-6 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>

            {/* My Resumes Section */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">My Resumes</h2>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="resume-upload"
                    />
                    <Button
                      size="sm"
                      className="gap-2"
                      disabled={isUploading}
                      asChild
                    >
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="size-4" />
                        {isUploading ? "Uploading..." : "Upload Resume"}
                      </label>
                    </Button>
                  </div>
                </div>
                {resumes.length > 0 ? (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                            <FileText className="size-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{resume.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resume.file_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full"
                              onClick={() => handleDownloadResume(resume.file_url!, resume.name)}
                              title="Download Resume"
                            >
                              <Download className="size-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => resume.id && handleDeleteResume(resume.id)}
                            title="Delete Resume"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-2xl p-12 transition-all duration-300 hover:bg-primary/5 group">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                          <FileUp className="size-10 text-primary" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="text-xl font-semibold text-foreground">
                          No resumes yet
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Upload your resume to get started.
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="resume-upload-empty"
                        />
                        <Button
                          variant="outline"
                          size="lg"
                          className="gap-2 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2"
                          disabled={isUploading}
                          asChild
                        >
                          <label htmlFor="resume-upload-empty" className="cursor-pointer">
                            <Upload className="size-4" />
                            {isUploading ? "Uploading..." : "Upload Resume"}
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

