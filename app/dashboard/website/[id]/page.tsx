"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Edit,
  MoreVertical,
  Eye,
  Calendar,
  BarChart3,
  Users,
  Share2,
  Settings,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function WebsiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = params.id as string;

  // Mock data - replace with actual data fetching
  const website = {
    id: websiteId,
    name: "Portfolio - John Doe",
    url: "johndoe.website.ai",
    status: "published",
    views: 1245,
    uniqueVisitors: 892,
    lastEdited: "2h ago",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    thumbnail: null,
    description: "Professional portfolio showcasing my work and experience in software development and design.",
    domain: "johndoe.website.ai",
    customDomain: null,
  };

  const stats = [
    { label: "Total Views", value: website.views.toLocaleString(), icon: Eye, color: "text-blue-500" },
    { label: "Unique Visitors", value: website.uniqueVisitors.toLocaleString(), icon: Users, color: "text-green-500" },
    { label: "Last Edited", value: website.lastEdited, icon: Clock, color: "text-amber-500" },
    { label: "Created", value: new Date(website.createdAt).toLocaleDateString(), icon: Calendar, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/website")}
                className="rounded-full"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                  <Globe className="size-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{website.title}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Globe className="size-3" />
                    {website.url}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`https://${website.url}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="size-4" />
                  Preview
                </Button>
              </Link>
              <Link href={`/editor/${website.id}`}>
                <Button size="sm" className="gap-2">
                  <Edit className="size-4" />
                  Edit Website
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="mr-2 size-4" />
                    Duplicate Website
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 size-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Status Banner */}
          <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
            <div className="bg-background rounded-[22px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {website.status === "published" ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                      <CheckCircle2 className="size-4" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <Clock className="size-4" />
                      Draft
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Last edited {website.lastEdited}
                  </p>
                </div>
                <Link href={`https://${website.url}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="size-4" />
                    Visit Website
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl shadow-lg border border-border/50 p-1 backdrop-blur-sm"
              >
                <div className="bg-background rounded-[18px] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-muted/30 ${stat.color}`}>
                      <stat.icon className="size-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Website Preview */}
          <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
            <div className="bg-background rounded-[22px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Website Preview</h2>
                <Link href={`https://${website.url}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="size-4" />
                    Open in New Tab
                  </Button>
                </Link>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                {website.thumbnail ? (
                  <Image
                    src={website.thumbnail}
                    alt={website.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Globe className="size-16 text-primary/30 mb-4" />
                    <p className="text-sm text-muted-foreground">No preview available</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Website Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {website.description}
                </p>
              </div>
            </div>

            {/* Website Info */}
            <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
              <div className="bg-background rounded-[22px] p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Website Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Domain</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Globe className="size-4" />
                      {website.domain}
                    </p>
                  </div>
                  {website.customDomain && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Custom Domain</p>
                      <p className="text-sm font-semibold text-foreground">{website.customDomain}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(website.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(website.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm">
            <div className="bg-background rounded-[22px] p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/editor/${website.id}`}>
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors">
                    <Edit className="size-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Edit Website</p>
                      <p className="text-xs text-muted-foreground">Modify content and design</p>
                    </div>
                  </Button>
                </Link>
                <Link href={`https://${website.url}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors">
                    <Eye className="size-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">View Live</p>
                      <p className="text-xs text-muted-foreground">See your website live</p>
                    </div>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors">
                  <BarChart3 className="size-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Analytics</p>
                    <p className="text-xs text-muted-foreground">View detailed statistics</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


