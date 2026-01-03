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
      <div className="relative overflow-hidden bg-primary/5 flex flex-col justify-center rounded-2xl items-center mx-4 md:mx-6 mt-4 md:mt-6">
        <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12 border-t border-b border-border flex justify-center items-center gap-4 md:gap-6 relative z-10">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="w-full h-full relative">
              {Array.from({ length: 300 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-4 w-full -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.05)] outline-offset-[-0.25px]"
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
            <div className="self-stretch flex flex-col justify-start items-start gap-4 md:gap-6">
              <div className="self-stretch text-center flex justify-center flex-col text-foreground text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight font-sans tracking-tight">
                Choose a template to get started
              </div>
              <p className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                Professionally designed templates to kickstart your portfolio. Fully customizable and ready to use.
              </p>
              
              <div className="w-full max-w-xl mx-auto mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-card border-border/50 focus:bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-4 md:px-6 text-xs md:text-sm"
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
                  className="capitalize rounded-full px-3 md:px-4 text-xs md:text-sm"
                >
                  <Icon className="size-3 md:size-4 mr-1.5 md:mr-2" />
                  {category}
                </Button>
              );
            })}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center bg-card rounded-2xl border border-dashed border-border">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="size-6 md:size-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">No templates found</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTemplates.map((template) => {
              const categoryIcon = categoryIcons[template.category] || Sparkles;
              const CategoryIcon = categoryIcon;

              return (
                <div
                  key={template.id}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 md:h-56 overflow-hidden bg-muted/30">
                    <div 
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{ background: template.thumbnail }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                    
                    <div className="absolute top-3 left-3">
                      <div className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm border border-border text-foreground text-xs font-medium flex items-center gap-1.5 shadow-sm">
                        <CategoryIcon className="size-3" />
                        <span className="capitalize">{template.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex flex-col flex-1 space-y-3 md:space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg md:text-xl mb-1.5 md:mb-2 group-hover:text-primary transition-colors text-foreground">
                        {template.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <LayoutGrid className="size-3 md:size-3.5" />
                          <span>{template.components.length} sections</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs md:text-sm"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="size-3 md:size-4 mr-1.5 md:mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="w-full text-xs md:text-sm"
                        onClick={() => handleEdit(template.id)}
                      >
                        <Rocket className="size-3 md:size-4 mr-1.5 md:mr-2" />
                        Use
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 gap-0 border border-border rounded-2xl bg-card">
          {previewTemplate && (
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-foreground">{previewTemplate.name}</h2>
                  <p className="text-xs text-muted-foreground">Template Preview</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                   <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => {
                      handleEdit(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                  >
                    <Rocket className="size-3 md:size-4 mr-1.5 md:mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
                  {/* Left: Visual Preview */}
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div 
                      className="aspect-video rounded-xl overflow-hidden shadow-lg border border-border relative group bg-muted/30"
                    >
                       <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ background: previewTemplate.thumbnail }}
                       />
                       <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-foreground font-medium text-sm md:text-base">Interactive Preview Not Available</p>
                       </div>
                    </div>
                    
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
                      <h3 className="font-semibold mb-3 md:mb-4 text-foreground">About this template</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {previewTemplate.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border space-y-3 md:space-y-4">
                      <h3 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Components</h3>
                      <div className="flex flex-wrap gap-2">
                        {previewTemplate.components.map((comp, idx) => (
                          <div
                            key={idx}
                            className="px-2.5 md:px-3 py-1 md:py-1.5 bg-muted/50 border border-border rounded-md text-xs text-foreground capitalize"
                          >
                            {comp.type.replace('-', ' ')}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-xl p-4 md:p-6 border border-border space-y-3 md:space-y-4">
                      <h3 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Style Palette</h3>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm text-muted-foreground">Primary</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-mono text-muted-foreground">{previewTemplate.preview.primaryColor}</span>
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-border" style={{ background: previewTemplate.preview.primaryColor }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm text-muted-foreground">Background</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-mono text-muted-foreground">{previewTemplate.preview.backgroundColor}</span>
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-border" style={{ background: previewTemplate.preview.backgroundColor }} />
                          </div>
                        </div>
                        {previewTemplate.preview.accentColor && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm text-muted-foreground">Accent</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] md:text-xs font-mono text-muted-foreground">{previewTemplate.preview.accentColor}</span>
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-border" style={{ background: previewTemplate.preview.accentColor }} />
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

