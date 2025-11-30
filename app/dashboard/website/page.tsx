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
  Search,
  Plus,
  Upload,
  Globe,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Filter,
  X,
  Grid3x3,
  List,
  ChevronDown,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getUserWebsites } from "@/lib/supabase/websites";
import { getCurrentUserId } from "@/lib/supabase/auth";
import { Website } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";

export default function WebsitesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsites() {
      const userId = await getCurrentUserId();
      if (userId) {
        const userWebsites = await getUserWebsites(userId);
        setWebsites(userWebsites);
      }
      setLoading(false);
    }
    loadWebsites();
  }, []);

  // Mock data fallback - remove when Supabase is fully set up
  const mockWebsites = [
    {
      id: "1",
      name: "Portfolio - John Doe",
      url: "johndoe.website.ai",
      status: "published",
      views: 1245,
      lastEdited: "2h ago",
      createdAt: "2024-01-15",
      thumbnail: null,
      description: "Professional portfolio showcasing my work and experience",
    },
    {
      id: "2",
      name: "Creative Studio",
      url: "creativestudio.website.ai",
      status: "published",
      views: 892,
      lastEdited: "1d ago",
      createdAt: "2024-01-10",
      thumbnail: null,
      description: "Showcasing creative projects and design work",
    },
    {
      id: "3",
      name: "Tech Blog",
      url: "techblog.website.ai",
      status: "draft",
      views: 0,
      lastEdited: "3h ago",
      createdAt: "2024-01-20",
      thumbnail: null,
      description: "Personal tech blog and articles",
    },
    {
      id: "4",
      name: "Business Portfolio",
      url: "business.website.ai",
      status: "published",
      views: 2156,
      lastEdited: "5h ago",
      createdAt: "2024-01-05",
      thumbnail: null,
      description: "Business portfolio and services",
    },
    {
      id: "5",
      name: "Photography Showcase",
      url: "photography.website.ai",
      status: "published",
      views: 3421,
      lastEdited: "1d ago",
      createdAt: "2024-01-08",
      thumbnail: null,
      description: "Photography portfolio and gallery",
    },
    {
      id: "6",
      name: "Personal Blog",
      url: "blog.website.ai",
      status: "published",
      views: 567,
      lastEdited: "2d ago",
      createdAt: "2024-01-12",
      thumbnail: null,
      description: "Personal thoughts and experiences",
    },
  ];

  const displayWebsites = websites.length > 0 ? websites.map(w => ({
    ...w,
    url: w.domain || (w as any).url,
    lastEdited: w.updated_at ? new Date(w.updated_at).toLocaleDateString() : 'Unknown',
    createdAt: w.created_at || new Date().toISOString(),
  })) : mockWebsites;

  const filteredWebsites = displayWebsites.filter((website) =>
    website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (website.url || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
          <CheckCircle2 className="size-3" />
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
        <Clock className="size-3" />
        Draft
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                <Globe className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Websites</h1>
                <p className="text-sm text-muted-foreground">{filteredWebsites.length} websites</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="size-4" />
                Upload
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                New Website
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap items-center gap-3">
            {activeFilter && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                <span>{activeFilter}</span>
                <button
                  onClick={() => setActiveFilter(null)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            {!activeFilter && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setActiveFilter("Status: Published")}
                >
                  Reset
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Filter className="size-3" />
                  Add Filter
                </Button>
              </>
            )}

            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 rounded-full border-border/50 bg-muted/30 focus:bg-background text-sm"
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Calendar className="size-3" />
                  Date Created
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Date Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views")}>
                  Views
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 border border-border/50 rounded-lg p-0.5">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <main className="w-full px-6 py-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website) => (
              <div
                key={website.id}
                className="group bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl shadow-xl border border-border/50 p-1 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-background rounded-[22px] p-6 h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    {website.thumbnail ? (
                      <Image
                        src={website.thumbnail}
                        alt={website.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="size-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(website.status)}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a href={`/${website.domain}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="secondary" className="gap-2">
                          <Eye className="size-4" />
                          Preview
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <Link href={`/dashboard/website/${website.id}`}>
                      <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors line-clamp-1">
                        {website.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {website.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Globe className="size-3" />
                      <span className="truncate">{website.url}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <Eye className="size-3" />
                        <span>{website.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3" />
                        <span>Edited {website.lastEdited}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => router.push(`/editor?id=${website.id}`)}
                      >
                        <Edit className="size-3" />
                        Edit
                      </Button>
                      <a href={`/${website.domain || website.url}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="size-3" />
                        </Button>
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MoreVertical className="size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="mr-2 size-4" />
                            Duplicate
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
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWebsites.map((website) => (
              <div
                key={website.id}
                className="group bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl shadow-lg border border-border/50 p-1 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-background rounded-[18px] p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shrink-0">
                      {website.thumbnail ? (
                        <Image
                          src={website.thumbnail}
                          alt={website.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Globe className="size-8 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-1.5 right-1.5">
                        {getStatusBadge(website.status)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/website/${website.id}`}>
                        <h3 className="text-base font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                          {website.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {website.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Globe className="size-3" />
                          <span>{website.url}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="size-3" />
                          <span>{website.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          <span>Edited {website.lastEdited}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/editor?website=${website.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="size-3" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`https://${website.url}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="size-3" />
                          Preview
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MoreVertical className="size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="mr-2 size-4" />
                            Duplicate
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
            ))}
          </div>
        )}

        {filteredWebsites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-4">
              <Globe className="size-10 text-primary/30" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No websites found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search" : "Create your first website to get started"}
            </p>
            <Button className="gap-2">
              <Plus className="size-4" />
              New Website
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}


