"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Upload,
  Linkedin,
  Bot,
  Search,
  Grid3x3,
  List,
  Clock,
  Send,
  LayoutGrid,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebsites } from "@/hooks/use-websites";
import { WebsitePreview } from "@/components/dashboard/website-preview";
import { formatRelativeTime } from "@/lib/utils/preview";
import { Website } from "@/lib/supabase/types";

export default function DashboardPage() {
  const router = useRouter();
  const { websites, loading, error, refetch } = useWebsites();

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recently-viewed");
  const [sortBy, setSortBy] = useState("last-viewed");
  const [organization, setOrganization] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const actionCards = [
    {
      title: "New \n Website",
      icon: Plus,
      customIcon: null,
      onClick: () => router.push("/editor/new"),
    },
    {
      title: "Use \n LinkedIn",
      icon: null,
      customIcon: "/icon/linkedin.png",
      onClick: () => {
        // Handle LinkedIn import
        console.log("LinkedIn import");
      },
    },
    {
      title: "Upload \n Resume",
      icon: Upload,
      customIcon: null,
      onClick: () => {
        // Handle resume upload
        console.log("Upload resume");
      },
    },
    {
      title: "Browse \n Templates",
      icon: LayoutGrid,
      onClick: () => {
        router.push("/dashboard/templates");
      },
    },
  ];

  // Filter and sort websites
  const filteredAndSortedWebsites = useMemo(() => {
    let filtered = [...websites];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (website) =>
          website.title.toLowerCase().includes(query) ||
          website.domain.toLowerCase().includes(query) ||
          website.description?.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab === "recently-viewed") {
      // Show all, sorted by updated_at (handled in sort)
      filtered = filtered;
    } else if (activeTab === "shared-files") {
      // For now, show published websites (can be extended with sharing logic)
      filtered = filtered.filter((w) => w.status === "published");
    } else if (activeTab === "shared-projects") {
      // For now, show published websites (can be extended with sharing logic)
      filtered = filtered.filter((w) => w.status === "published");
    }

    // Organization filter (for now, just show all - can be extended)
    if (organization !== "all") {
      // Future: filter by organization/team
    }

    // Sort
    if (sortBy === "last-viewed") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateB - dateA; // Most recent first
      });
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Newest first
      });
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB; // Oldest first
      });
    }

    return filtered;
  }, [websites, searchQuery, activeTab, sortBy, organization]);


  return (
    <div className="w-full md:w-[calc(100vw-10.5rem)] mx-auto flex flex-col gap-4 md:gap-6 px-4 md:px-0">
      {/* Dashboard Content */}
      <div className="relative overflow-hidden bg-primary/5 flex flex-col justify-center rounded-2xl items-center">
          <div className="w-full px-4 md:px-24 py-4 md:py-8 border-t border-b border-border flex justify-center items-center gap-4 md:gap-6 relative z-10 min-h-[40vh] md:min-h-[60vh]">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              {Array.from({ length: 300 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.05)] outline-offset-[-0.25px]"
                  style={{
                    top: `${i * 16 - 120}px`,
                    left: "-100%",
                    width: "300%",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="w-full flex-1 px-4 md:px-6 py-4 md:py-6 overflow-hidden rounded-lg gap-4 md:gap-6 relative z-20">
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch text-center flex justify-center flex-col text-foreground text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight md:leading-tight font-sans tracking-tight">
                Build your portfolio in minutes
              </div>
              <div className="w-full bg-card flex gap-2 md:gap-4 items-center mx-auto my-2 md:my-4 rounded-lg p-2 border border-border/50">
                <Input
                  className="flex-1 border-border/50 bg-muted/30 focus:bg-background focus:ring-0 focus:border-0 focus:ring-offset-0 focus-within:ring-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none text-sm md:text-base"
                  placeholder="Ask AI What you want to create"
                />
                <Button size="icon" className="px-3 md:px-4 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full flex flex-wrap justify-center mx-auto gap-4 md:gap-8 items-center">
                {actionCards.map((card, index) => {
                  const IconComponent = card.icon;

                  return (
                    <div key={index} className="flex flex-col items-center min-w-[60px]">
                      <div className="h-10 w-10 md:h-12 md:w-12 mb-2 mx-auto rounded-full bg-card dark:bg-card/90 border border-border flex justify-center items-center shadow-sm">
                        {card.icon && IconComponent && (
                          <IconComponent className={`h-4 w-4 md:h-5 md:w-5 text-foreground`} />
                        )}
                        {card.customIcon && (
                          <Image
                            src={card.customIcon}
                            alt={card.title}
                            width={20}
                            height={20}
                            className="md:w-6 md:h-6"
                          />
                        )}
                      </div>
                      <p className="text-xs font-medium text-center whitespace-pre-line text-foreground">
                        {card.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Website Layout Section */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4 lg:space-y-6">
          {/* Search Bar */}
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
                All Projects ({filteredAndSortedWebsites.length})
              </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 w-full max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Header with Tabs and Filters */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              

              <div className="flex items-center gap-2 md:gap-3 flex-wrap w-full sm:w-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="h-8 md:h-9 w-full sm:w-auto">
                    <TabsTrigger
                      value="recently-viewed"
                      className="text-xs px-2 md:px-3 flex-1 sm:flex-initial"
                    >
                      Recently viewed
                    </TabsTrigger>
                  <TabsTrigger
                    value="shared-files"
                    className="text-xs px-2 md:px-3 flex-1 sm:flex-initial"
                  >
                    Shared files
                  </TabsTrigger>
                  <TabsTrigger
                    value="shared-projects"
                    className="text-xs px-2 md:px-3 flex-1 sm:flex-initial"
                  >
                    Shared projects
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={organization} onValueChange={setOrganization}>
                  <SelectTrigger className="h-8 md:h-9 text-xs w-full sm:w-[130px] md:w-[140px]">
                    <SelectValue placeholder="All organizations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All organizations</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 md:h-9 text-xs w-full sm:w-[110px] md:w-[120px]">
                    <SelectValue placeholder="Last viewed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-viewed">Last viewed</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 md:h-7 md:w-7 p-0 ${
                      viewMode === "grid"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 md:h-7 md:w-7 p-0 ${
                      viewMode === "list"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={refetch}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedWebsites.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 gap-4">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No projects found matching your search"
                  : "No projects yet. Create your first website!"}
              </p>
              {!searchQuery && (
                <Button size={"sm"} className="gap-2 text-xs" onClick={() => router.push("/editor/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Website
                </Button>
              )}
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && filteredAndSortedWebsites.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                  : "flex flex-col gap-3 md:gap-4"
              }
            >
              {filteredAndSortedWebsites.map((website) => (
                <Card
                  key={website.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-28 md:h-32 relative">
                    <WebsitePreview website={website} />
                  </div>
                  <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <div>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                        {website.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Edited {formatRelativeTime(website.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant={
                          website.status === "published" ? "default" : "outline"
                        }
                        className="text-xs h-7 md:h-8"
                        onClick={() => router.push(`/editor/${website.id}`)}
                      >
                        Open Project
                      </Button>
                      <div className="flex -space-x-2">
                        <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary">
                          {(website.title || "W").charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
