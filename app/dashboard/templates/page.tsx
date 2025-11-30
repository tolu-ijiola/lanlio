"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Edit,
  Search,
  Sparkles,
  Palette,
  Briefcase,
  User,
  Rocket,
  Heart,
  FileText,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { allTemplates as templates, Template } from "@/lib/templates";
import { useRouter } from "next/navigation";

const categoryIcons = {
  portfolio: Briefcase,
  resume: FileText,
  creative: Palette,
  business: Rocket,
  personal: User,
};

const categoryColors = {
  portfolio: "from-blue-500 to-purple-600",
  resume: "from-gray-700 to-black",
  creative: "from-pink-500 to-red-500",
  business: "from-cyan-500 to-blue-500",
  personal: "from-teal-400 to-pink-400",
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const router = useRouter();

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (templateId: string) => {
    router.push(`/editor-v2?template=${templateId}`);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-[#0f172a] text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-purple-200">
            <Sparkles className="size-4" />
            <span>New Templates Added</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-200">
            Start with a masterpiece
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto">
            Choose from our professionally designed templates to kickstart your project. 
            Fully customizable and optimized for conversion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-6"
            >
              All Templates
            </Button>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Sparkles;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? null : category
                    )
                  }
                  className="capitalize rounded-full px-4"
                >
                  <Icon className="size-4 mr-2" />
                  {category}
                </Button>
              );
            })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-3xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const categoryIcon = categoryIcons[template.category] || Sparkles;
              const CategoryIcon = categoryIcon;

              return (
                <div
                  key={template.id}
                  className="group relative bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-56 overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ background: template.thumbnail }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5`}
                      >
                        <CategoryIcon className="size-3" />
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <LayoutGrid className="size-3.5" />
                          <span>{template.components.length} sections</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="w-full hover:bg-muted/50"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="size-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        className="w-full shadow-lg shadow-primary/20"
                        onClick={() => handleEdit(template.id)}
                        style={{
                          backgroundColor: template.preview.primaryColor,
                          color: "#ffffff",
                        }}
                      >
                        <Rocket className="size-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={previewTemplate !== null}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 gap-0 border-0 rounded-2xl bg-zinc-950 text-white">
          {previewTemplate && (
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                <div>
                  <h2 className="text-lg font-semibold">{previewTemplate.name}</h2>
                  <p className="text-xs text-zinc-400">Template Preview</p>
                </div>
                <div className="flex items-center gap-3">
                   <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-white/10"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleEdit(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                    style={{
                      backgroundColor: previewTemplate.preview.primaryColor,
                      color: "#ffffff",
                    }}
                  >
                    <Rocket className="size-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Left: Visual Preview */}
                  <div className="lg:col-span-2 space-y-6">
                    <div 
                      className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group"
                    >
                       <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ background: previewTemplate.thumbnail }}
                       />
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-medium">Interactive Preview Not Available</p>
                       </div>
                    </div>
                    
                    <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10">
                      <h3 className="font-semibold mb-4">About this template</h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {previewTemplate.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10 space-y-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Components</h3>
                      <div className="flex flex-wrap gap-2">
                        {previewTemplate.components.map((comp, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-300 capitalize"
                          >
                            {comp.type.replace('-', ' ')}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/10 space-y-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Style Palette</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Primary</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500">{previewTemplate.preview.primaryColor}</span>
                            <div className="w-6 h-6 rounded-full border border-white/10" style={{ background: previewTemplate.preview.primaryColor }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Background</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500">{previewTemplate.preview.backgroundColor}</span>
                            <div className="w-6 h-6 rounded-full border border-white/10" style={{ background: previewTemplate.preview.backgroundColor }} />
                          </div>
                        </div>
                        {previewTemplate.preview.accentColor && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Accent</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-zinc-500">{previewTemplate.preview.accentColor}</span>
                              <div className="w-6 h-6 rounded-full border border-white/10" style={{ background: previewTemplate.preview.accentColor }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

