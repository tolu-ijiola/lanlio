import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, FileImage, X, Upload, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentData } from "@/lib/editor-state";

interface Project {
  title: string;
  link: string;
  image?: string;
  description?: string;
}

interface ProjectsComponentData {
  id: string;
  type: 'projects';
  projects: Project[];
  mode?: 'grid' | 'list' | 'carousel';
}

interface ProjectsProps {
  data: ProjectsComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Projects({ data, isPreviewMode, onUpdate }: ProjectsProps) {
  const [newProject, setNewProject] = React.useState<Project>({
    title: '',
    link: '',
    image: '',
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Carousel scrollability check
  const checkScrollability = React.useCallback(() => {
    if (carouselRef.current && data.mode === 'carousel') {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, [data.mode]);

  React.useEffect(() => {
    if (data.mode === 'carousel' && isPreviewMode) {
      checkScrollability();
      const ref = carouselRef.current;
      if (ref) {
        ref.addEventListener('scroll', checkScrollability);
        // Also check on resize
        const resizeObserver = new ResizeObserver(checkScrollability);
        resizeObserver.observe(ref);
        return () => {
          ref.removeEventListener('scroll', checkScrollability);
          resizeObserver.disconnect();
        };
      }
    }
  }, [data.projects, data.mode, isPreviewMode, checkScrollability]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== undefined) {
          const newProjects = [...data.projects];
          newProjects[index] = { ...newProjects[index], image: reader.result as string };
          onUpdate({ ...data, projects: newProjects });
        } else {
          setNewProject({ ...newProject, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = () => {
    if (newProject.title.trim() && newProject.link.trim()) {
      onUpdate({
        ...data,
        projects: [...data.projects, { ...newProject }],
      });
      setNewProject({ title: '', link: '', image: '', description: '' });
    }
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    onUpdate({ ...data, projects: newProjects });
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onUpdate({ ...data, projects: newProjects });
  };

  if (isPreviewMode) {
    if (data.projects.length === 0) return null;
    
    const mode = data.mode || 'grid';
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '16px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '16px';
    const boxShadow = styles.boxShadow;

    // Grid Mode - Premium cards with description
    if (mode === 'grid') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
            {data.projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  borderRadius: borderRadius,
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                  borderStyle: 'solid',
                  boxShadow: boxShadow,
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                      <FileImage className="size-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink 
                      className="size-4 text-white bg-black/50 rounded-full p-1.5"
                    />
                  </div>
                </div>
                <div style={{ padding }}>
                  <h3 
                    className="text-sm font-semibold mb-1.5 truncate"
                    style={{ color: titleColor }}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p 
                      className="text-xs line-clamp-2 mb-2"
                      style={{ color: descriptionColor }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // List Mode - Horizontal cards with description
    if (mode === 'list') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-border rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
              >
                {project.image ? (
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 bg-muted/30 rounded-md flex items-center justify-center">
                    <FileImage className="size-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-sm font-semibold truncate mb-1"
                    style={{ color: 'var(--palette-title)' }}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p 
                      className="text-xs text-muted-foreground line-clamp-2"
                      style={{ color: 'var(--palette-description)' }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
                <ExternalLink 
                  className="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--palette-primary)' }}
                />
              </a>
            ))}
          </div>
        </div>
      );
    }

    // Carousel Mode - Horizontal scrolling with description and navigation
    if (mode === 'carousel') {
      const scrollLeft = () => {
        if (carouselRef.current) {
          carouselRef.current.scrollBy({ left: -280, behavior: 'smooth' });
        }
      };
      
      const scrollRight = () => {
        if (carouselRef.current) {
          carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
      };

      return (
        <div className="max-w-4xl mx-auto relative">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              WebkitOverflowScrolling: 'touch',
              gap: gap,
            }}
            onScroll={() => {
              if (carouselRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
              }
            }}
          >
            {data.projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 w-64 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  borderRadius: borderRadius,
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                  borderStyle: 'solid',
                  boxShadow: boxShadow,
                }}
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                      <FileImage className="size-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink 
                      className="size-4 text-white bg-black/50 rounded-full p-1.5"
                    />
                  </div>
                </div>
                <div style={{ padding }}>
                  <h3 
                    className="text-sm font-semibold mb-1 truncate"
                    style={{ color: titleColor }}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p 
                      className="text-xs line-clamp-2"
                      style={{ color: descriptionColor }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg"
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    }
  }

  // Canvas mode - show clean content only (reuse preview rendering)
  if (data.projects.length === 0) return null;
  
  const mode = data.mode || 'grid';
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '16px';
  const titleColor = styles.color || 'var(--palette-title)';
  const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
  const backgroundColor = styles.backgroundColor || '#ffffff';
  const borderColor = styles.borderColor || '#e5e7eb';
  const borderRadius = styles.borderRadius || '12px';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '16px';
  const boxShadow = styles.boxShadow;

  // Grid Mode - Premium cards with description
  if (mode === 'grid') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
          {data.projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ 
                borderRadius: borderRadius,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                boxShadow: boxShadow,
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <FileImage className="size-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div style={{ padding }}>
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: titleColor }}
                >
                  {project.title}
                </h3>
                {project.description && (
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: descriptionColor }}
                  >
                    {project.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // List Mode - Horizontal cards
  if (mode === 'list') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 items-center transition-all duration-300 hover:shadow-lg p-4 rounded-lg"
              style={{ 
                borderRadius: borderRadius,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                boxShadow: boxShadow,
              }}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-24 h-24 flex-shrink-0 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                  style={{ borderRadius: borderRadius }}
                />
              ) : (
                <div className="w-24 h-24 flex-shrink-0 bg-muted/30 rounded-md flex items-center justify-center">
                  <FileImage className="size-8 text-muted-foreground/30" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-sm font-semibold truncate mb-1"
                  style={{ color: titleColor }}
                >
                  {project.title}
                </h3>
                {project.description && (
                  <p 
                    className="text-xs text-muted-foreground line-clamp-2"
                    style={{ color: descriptionColor }}
                  >
                    {project.description}
                  </p>
                )}
              </div>
              <ExternalLink 
                className="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--palette-primary)' }}
              />
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Carousel Mode - Horizontal scrolling
  return (
    <div className="max-w-4xl mx-auto relative">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          WebkitOverflowScrolling: 'touch',
          gap: gap,
        }}
      >
        {data.projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-64 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ 
              borderRadius: borderRadius,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              boxShadow: boxShadow,
            }}
          >
            <div className="relative aspect-4/3 overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                  <FileImage className="size-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div style={{ padding }}>
              <h3 
                className="text-sm font-semibold mb-1 truncate"
                style={{ color: titleColor }}
              >
                {project.title}
              </h3>
              {project.description && (
                <p 
                  className="text-xs line-clamp-2"
                  style={{ color: descriptionColor }}
                >
                  {project.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Projects;
