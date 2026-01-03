import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, FileImage, X, Upload, ChevronLeft, ChevronRight, Grid3x3, Move, Film, Link as LinkIcon } from "lucide-react";
import { GalleryComponentData, ComponentData } from "@/lib/editor-state";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface GalleryProps {
  data: GalleryComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Gallery({ data, isPreviewMode, onUpdate }: GalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = data.maxImages || 8;
  const mode = data.mode || 'grid';
  const direction = data.direction || 'left';
  const aspectRatio = data.aspectRatio || '1:1';
  const spacing = data.spacing || '12px';
  const speed = data.speed || 30;
  const images = Array.isArray(data.images) ? data.images : [];
  
  // Carousel specific settings
  const carouselImagesToShow = Math.min(data.carouselImagesToShow || 1, 3);
  const carouselAutoPlay = data.carouselAutoPlay !== false; // default true

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    Promise.all(
      filesToAdd.map((file) => {
        return new Promise<{ src: string; alt: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              src: reader.result as string,
              alt: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((newImages) => {
      onUpdate({
        ...data,
        images: [...data.images, ...newImages],
      });
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onUpdate({ ...data, images: newImages });
  };

  const handleUrlAdd = (url: string) => {
    if (url && images.length < maxImages) {
      onUpdate({
        ...data,
        images: [...images, { src: url, alt: 'Gallery image' }],
      });
    }
  };

  // Helper functions
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '3:2': return 'aspect-[3/2]';
      case '1:1': return 'aspect-square';
      default: return '';
    }
  };

  const columns = data.columns || 3;
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  if (isPreviewMode) {
    if (images.length === 0) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
          <p className="text-muted-foreground">No images added</p>
        </div>
      );
    }
    
    if (mode === 'marquee') {
      return (
        <>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-container {
              display: flex;
              overflow: hidden;
              white-space: nowrap;
            }
            .marquee-content {
              display: inline-flex;
              animation: scroll ${speed}s linear infinite;
            }
            .marquee-content.marquee-right {
              animation-direction: reverse;
            }
            .marquee-content:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="marquee-container py-4">
            <div 
              className={`marquee-content ${direction === 'right' ? 'marquee-right' : ''}`}
              style={{ gap: spacing }}
            >
              {[...images, ...images].map((img, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden group cursor-pointer shrink-0 ${getAspectRatioClass()}`}
                  style={{ 
                    borderRadius: 'var(--palette-radius, 0.75rem)',
                    // Mobile: 1.5 items (66vw), Tablet: 3 items (33vw), Desktop: Auto/Fixed
                    width: 'clamp(200px, 66vw, 400px)', 
                    minHeight: aspectRatio === 'auto' ? '200px' : undefined
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ borderRadius: 'var(--palette-radius, 0.75rem)' }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    // Carousel mode - Embla Carousel
    if (mode === 'carousel') {
      const CarouselComponent = () => {
        // Embla Carousel Setup - only initialize in carousel mode
        const [emblaRef, emblaApi] = useEmblaCarousel({ 
          loop: true,
          align: 'start',
          slidesToScroll: 1,
        }, [
          Autoplay({ delay: (speed < 1 ? 3 : speed) * 1000, stopOnInteraction: false, playOnInit: carouselAutoPlay })
        ]);

        const [selectedIndex, setSelectedIndex] = useState(0);
        const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

        const onInit = useCallback((emblaApi: any) => {
          setScrollSnaps(emblaApi.scrollSnapList());
        }, []);

        const onSelect = useCallback((emblaApi: any) => {
          setSelectedIndex(emblaApi.selectedScrollSnap());
        }, []);

        useEffect(() => {
          if (!emblaApi) return;

          onInit(emblaApi);
          onSelect(emblaApi);
          emblaApi.on('reInit', onInit);
          emblaApi.on('reInit', onSelect);
          emblaApi.on('select', onSelect);
        }, [emblaApi, onInit, onSelect]);

        const scrollPrev = useCallback(() => {
          if (emblaApi) emblaApi.scrollPrev();
        }, [emblaApi]);

        const scrollNext = useCallback(() => {
          if (emblaApi) emblaApi.scrollNext();
        }, [emblaApi]);

        const scrollTo = useCallback((index: number) => {
          if (emblaApi) emblaApi.scrollTo(index);
        }, [emblaApi]);

        const itemWidth = 100 / carouselImagesToShow;
        
        return (
          <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex" style={{ gap: spacing }}>
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`relative flex-[0_0_auto] min-w-0 ${getAspectRatioClass() || 'aspect-video'}`}
                    style={{ 
                      width: `${itemWidth}%`,
                      borderRadius: 'var(--palette-radius, 0.75rem)'
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover block"
                      style={{ borderRadius: 'var(--palette-radius, 0.75rem)' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {images.length > carouselImagesToShow && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots */}
            {scrollSnaps.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      };
      
      return <CarouselComponent />;
    }
    
    // Grid mode
    return (
      <>
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div 
          className={`grid ${gridCols}`}
          style={{ gap: spacing }}
        >
        {images.map((img, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden group cursor-pointer ${getAspectRatioClass() || 'aspect-square'}`}
              style={{ 
                borderRadius: 'var(--palette-radius, 0.5rem)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
              }}
            >
            <img
              src={img.src}
              alt={img.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
            />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
      </>
    );
  }

  // Edit mode - show controls and preview
  if (!isPreviewMode) {
    const [urlInput, setUrlInput] = useState("");

    return (
      <div className="space-y-4">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Images ({images.length}/{maxImages})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= maxImages}
              className="h-8 text-xs"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Add image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && urlInput.trim()) {
                  handleUrlAdd(urlInput.trim());
                  setUrlInput("");
                }
              }}
              className="h-8 text-xs flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (urlInput.trim()) {
                  handleUrlAdd(urlInput.trim());
                  setUrlInput("");
                }
              }}
              disabled={!urlInput.trim() || images.length >= maxImages}
              className="h-8 px-3"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Image Grid Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, index) => (
                <div key={index} className="relative group aspect-square rounded-md overflow-hidden border border-border">
                  <img
                    src={img.src}
                    alt={img.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
              <div className="text-center space-y-2">
                <FileImage className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No images added</p>
              </div>
            </div>
          )}
        </div>

        {/* Display Style Section */}
        <div className="pt-3 border-t border-border space-y-3">
          <Label className="text-xs text-muted-foreground">Display Style</Label>
          <Select
            value={mode}
            onValueChange={(value: 'grid' | 'marquee' | 'carousel') => {
              onUpdate({ ...data, mode: value });
            }}
          >
            <SelectTrigger className="h-9 text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </div>
              </SelectItem>
              <SelectItem value="marquee">
                <div className="flex items-center gap-2">
                  <Move className="h-3.5 w-3.5" />
                  <span>Marquee</span>
                </div>
              </SelectItem>
              <SelectItem value="carousel">
                <div className="flex items-center gap-2">
                  <Film className="h-3.5 w-3.5" />
                  <span>Carousel</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Style-specific Settings */}
          {mode === 'grid' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Columns</Label>
                <Select
                  value={String(columns || 3)}
                  onValueChange={(value) => {
                    onUpdate({ ...data, columns: Number(value) as 2 | 3 | 4 });
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
                <Select
                  value={aspectRatio || '1:1'}
                  onValueChange={(value: '16:9' | '4:3' | '3:2' | '1:1' | 'auto') => {
                    onUpdate({ ...data, aspectRatio: value });
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {mode === 'marquee' && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direction</Label>
              <Select
                value={direction}
                onValueChange={(value: 'left' | 'right') => {
                  onUpdate({ ...data, direction: value });
                }}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === 'carousel' && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Images to Show</Label>
              <Select
                value={String(Math.min(carouselImagesToShow, 3))}
                onValueChange={(value) => {
                  onUpdate({ ...data, carouselImagesToShow: Number(value) });
                }}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Image</SelectItem>
                  <SelectItem value="2">2 Images</SelectItem>
                  <SelectItem value="3">3 Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Preview of Gallery */}
        {images.length > 0 && (
          <div className="pt-3 border-t border-border">
            <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              {/* Render preview based on mode */}
              {mode === 'grid' && (
                <div className={`grid ${gridCols}`} style={{ gap: spacing }}>
                  {images.slice(0, 6).map((img, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden ${getAspectRatioClass() || 'aspect-square'}`}
                      style={{ borderRadius: '0.5rem' }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '0.5rem' }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {mode === 'marquee' && (
                <div className="overflow-hidden">
                  <div className="flex gap-2 animate-pulse">
                    {images.slice(0, 3).map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden shrink-0 w-32 aspect-square rounded-lg"
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {mode === 'carousel' && (
                <div className="relative">
                  <div className="flex gap-2 overflow-hidden">
                    {images.slice(0, 3).map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden shrink-0 w-32 aspect-video rounded-lg"
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Canvas mode - show clean content only (when no images in edit mode)
  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
        <p className="text-muted-foreground">No images added</p>
      </div>
    );
  }

  // Render preview content for canvas
  if (mode === 'marquee') {
    return (
      <>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            display: flex;
            overflow: hidden;
            white-space: nowrap;
          }
          .marquee-content {
            display: inline-flex;
            animation: scroll ${speed}s linear infinite;
          }
          .marquee-content.marquee-right {
            animation-direction: reverse;
          }
          .marquee-content:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-container py-4">
          <div 
            className={`marquee-content ${direction === 'right' ? 'marquee-right' : ''}`}
            style={{ gap: spacing }}
          >
            {[...images, ...images].map((img, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden group cursor-pointer shrink-0 ${getAspectRatioClass()}`}
                style={{ 
                  borderRadius: 'var(--palette-radius, 0.75rem)',
                  width: 'clamp(200px, 66vw, 400px)', 
                  minHeight: aspectRatio === 'auto' ? '200px' : undefined
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ borderRadius: 'var(--palette-radius, 0.75rem)' }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Carousel mode - Embla Carousel
  if (mode === 'carousel') {
    const CarouselComponent = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true,
        align: 'start',
        slidesToScroll: 1,
      }, [
        Autoplay({ delay: (speed < 1 ? 3 : speed) * 1000, stopOnInteraction: false, playOnInit: carouselAutoPlay })
      ]);

      const [selectedIndex, setSelectedIndex] = useState(0);
      const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

      const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
      }, []);

      const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      }, []);

      useEffect(() => {
        if (!emblaApi) return;
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
      }, [emblaApi, onInit, onSelect]);

      const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
      }, [emblaApi]);

      const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
      }, [emblaApi]);

      const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
      }, [emblaApi]);

      const itemWidth = 100 / carouselImagesToShow;
      
      return (
        <div className="relative group">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex" style={{ gap: spacing }}>
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative flex-[0_0_auto] min-w-0 ${getAspectRatioClass() || 'aspect-video'}`}
                  style={{ 
                    width: `${itemWidth}%`,
                    borderRadius: 'var(--palette-radius, 0.75rem)'
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover block"
                    style={{ borderRadius: 'var(--palette-radius, 0.75rem)' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {images.length > carouselImagesToShow && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {scrollSnaps.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    };
    
    return <CarouselComponent />;
  }
  
  // Grid mode
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div 
        className={`grid ${gridCols}`}
        style={{ gap: spacing }}
      >
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden group cursor-pointer ${getAspectRatioClass() || 'aspect-square'}`}
            style={{ 
              borderRadius: 'var(--palette-radius, 0.5rem)',
              animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
            }}
          >
            <img
              src={img.src}
              alt={img.alt || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
    </div>
    </>
  );
}

export default Gallery;

