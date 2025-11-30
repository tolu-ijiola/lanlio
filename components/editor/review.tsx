import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, X, Upload, Star, User } from "lucide-react";
import { ReviewComponentData, ComponentData } from "@/lib/editor-state";

interface ReviewProps {
  data: ReviewComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Review({ data, isPreviewMode, onUpdate }: ReviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newReview, setNewReview] = React.useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    comment: '',
    avatar: '',
    date: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== undefined) {
          const newReviews = [...data.reviews];
          newReviews[index] = { ...newReviews[index], avatar: reader.result as string };
          onUpdate({ ...data, reviews: newReviews });
        } else {
          setNewReview({ ...newReview, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      onUpdate({
        ...data,
        reviews: [...data.reviews, { ...newReview }],
      });
      setNewReview({
        name: '',
        role: '',
        company: '',
        rating: 5,
        comment: '',
        avatar: '',
        date: '',
      });
    }
  };

  const handleRemoveReview = (index: number) => {
    const newReviews = data.reviews.filter((_, i) => i !== index);
    onUpdate({ ...data, reviews: newReviews });
  };

  const handleUpdateReview = (index: number, field: string, value: any) => {
    const newReviews = [...data.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    onUpdate({ ...data, reviews: newReviews });
  };

  if (isPreviewMode) {
    if (data.reviews.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '24px';
    const titleColor = styles.color || 'var(--palette-title)';
    const descriptionColor = styles.descriptionColor || 'var(--palette-description)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '12px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '24px';
    const boxShadow = styles.boxShadow;
    const starColor = styles.starColor || '#fbbf24';
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap }}>
        {data.reviews.map((review, index) => (
          <div
            key={index}
            className="transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
              boxShadow: boxShadow,
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              {review.avatar ? (
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                  style={{ borderRadius: '9999px' }}
                />
              ) : (
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: 'var(--palette-primary)',
                    borderRadius: '9999px',
                  }}
                >
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h4 
                  className="font-semibold"
                  style={{ color: titleColor }}
                >
                  {review.name}
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: descriptionColor }}
                >
                  {review.role}
                  {review.company && ` at ${review.company}`}
                </p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground'}`}
                  style={{ 
                    color: i < review.rating ? starColor : undefined,
                    fill: i < review.rating ? starColor : 'none'
                  }}
                />
              ))}
            </div>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: descriptionColor }}
            >
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="text-sm font-semibold">Reviews</h3>
        <Button onClick={handleAddReview} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>
      
      {data.reviews.map((review, index) => (
        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Review #{index + 1}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRemoveReview(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              {review.avatar ? (
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="hidden"
                id={`review-avatar-${index}`}
              />
              <label
                htmlFor={`review-avatar-${index}`}
                className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
              >
                <Upload className="h-4 w-4 text-white" />
              </label>
            </div>
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Name"
                value={review.name}
                onChange={(e) => handleUpdateReview(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Role"
                value={review.role}
                onChange={(e) => handleUpdateReview(index, 'role', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={review.company}
                onChange={(e) => handleUpdateReview(index, 'company', e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Rating:</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleUpdateReview(index, 'rating', rating)}
                className={`p-1 ${review.rating >= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
              >
                <Star className={`h-4 w-4 ${review.rating >= rating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Review comment"
            value={review.comment}
            onChange={(e) => handleUpdateReview(index, 'comment', e.target.value)}
            rows={3}
          />
        </div>
      ))}
    </div>
  );
}

export default Review;
