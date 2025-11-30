import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, FileImage, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryComponentData, ComponentData } from "@/lib/editor-state";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface GalleryProps {
  data: GalleryComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Gallery({ data, isPreviewMode, onUpdate }: GalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = data.maxImages || 20;
  const mode = data.mode || 'grid';
  const direction = data.direction || 'left';
  const aspectRatio = data.aspectRatio || '1:1';
  const spacing = data.spacing || '12px';
  const speed = data.speed || 30;
  const images = Array.isArray(data.images) ? data.images : [];
  
  // Carousel specific settings
  const carouselImagesToShow = data.carouselImagesToShow || 1;
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

  if (isPreviewMode) {
    if (images.length === 0) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center">
          <p className="text-muted-foreground">No images added</p>
        </div>
      );
    }
    
    const getAspectRatioClass = () => {
      switch (aspectRatio) {
        case '16:9': return 'aspect-video';
        case '4:3': return 'aspect-[4/3]';
        case '3:2': return 'aspect-[3/2]';
        case '1:1': return 'aspect-square';
        default: return '';
      }
    };

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
    const columns = data.columns || 3;
    const gridCols = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-6',
    }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 pb-2 border-b flex-wrap">
        <label className="text-sm font-medium">Display Mode:</label>
        <select
          value={mode}
          onChange={(e) => onUpdate({ ...data, mode: e.target.value as 'grid' | 'marquee' | 'carousel' })}
          className="px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="grid">Grid</option>
          <option value="marquee">Marquee</option>
          <option value="carousel">Carousel</option>
        </select>
        {mode === 'grid' && (
          <>
            <label className="text-sm font-medium ml-4">Columns:</label>
            <select
              value={data.columns || 3}
              onChange={(e) => onUpdate({ ...data, columns: parseInt(e.target.value) as 2 | 3 | 4 | 5 | 6 })}
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </>
        )}
        {mode === 'marquee' && (
          <>
            <label className="text-sm font-medium ml-4">Direction:</label>
            <select
              value={direction}
              onChange={(e) => onUpdate({ ...data, direction: e.target.value as 'left' | 'right' })}
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="left">Left to Right</option>
              <option value="right">Right to Left</option>
            </select>
          </>
        )}
      </div>
      {images.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border flex justify-center items-center min-h-[200px] py-12 bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="text-center space-y-4">
            <FileImage className="size-10 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add up to {maxImages} images</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="mr-2 size-4" /> Add Images
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={mode === 'marquee' || mode === 'carousel' ? "flex gap-3 overflow-x-auto pb-2" : "grid grid-cols-2 gap-4"}>
            {images.map((img, index) => (
              <div 
                key={index} 
                className="relative group aspect-square overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ borderRadius: 'var(--palette-radius, 0.5rem)' }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    className="transform scale-90 group-hover:scale-100 transition-transform"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {images.length < maxImages && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2 size-4" />
                Add More Images ({images.length}/{maxImages})
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Or paste image URL"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrlAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="h-10"
                />
              </div>
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

export default Gallery;

