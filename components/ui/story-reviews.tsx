"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "./button";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  avatar: string;
  profession: string;
}

interface StoryReviewsProps {
  reviews: Review[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const StoryReviews = ({ 
  reviews, 
  autoPlay = true, 
  autoPlayInterval = 4000 
}: StoryReviewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
          return 0;
        }
        return prev + 2; // 2% every 80ms = 4 seconds total
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying, reviews.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const currentReview = reviews[currentIndex];

  return (
    <div 
      className="relative w-full mx-auto bg-primary/20 rounded-2xl overflow-hidden border border-gray-700"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
    >
      {/* Progress bars */}
      <div className="flex gap-1 p-3">
        {reviews.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-75 ${
                index === currentIndex ? 'w-full' : 
                index < currentIndex ? 'w-full' : 'w-0'
              }`}
              style={{
                width: index === currentIndex ? `${progress}%` : 
                       index < currentIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Review content */}
      <div className="relative p-6 flex flex-col justify-center">
        <div className="text-center ">
          <div className="w-16 h-16 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {currentReview.avatar}
          </div>
          <h3 className="text-xl font-semibold text-white mb-1">{currentReview.name}</h3>
        </div>

        <div className="text-center ">
          <div className="flex justify-center my-2 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${
                  i < currentReview.rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-600'
                }`} 
              />
            ))}
          </div>
          <p className="text-gray-100 text-sm italic leading-relaxed">
            "{currentReview.text}"
          </p>
        </div>
      </div>

      {/* Invisible click areas for navigation */}
      <div className="absolute inset-y-0 left-0 w-1/2" onClick={goToPrevious} />
      <div className="absolute inset-y-0 right-0 w-1/2" onClick={goToNext} />

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 p-4">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

