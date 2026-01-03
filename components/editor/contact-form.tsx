import React, { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Plus, X, Mail, User, ArrowUpRight, CheckCircle2, Send } from "lucide-react";
import { ContactFormComponentData, ComponentData } from "@/lib/editor-state";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactFormProps {
  data: ContactFormComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

const availableFields = [
  { name: 'name', label: 'Full Name', type: 'text' as const },
  { name: 'email', label: 'Email Address', type: 'email' as const },
  { name: 'phone', label: 'Phone Number', type: 'tel' as const },
  { name: 'company', label: 'Company', type: 'text' as const },
  { name: 'subject', label: 'Subject', type: 'text' as const },
  { name: 'message', label: 'Message', type: 'textarea' as const },
];

function ContactForm({ data, isPreviewMode, onUpdate }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleField = (fieldName: string, fieldType: 'text' | 'email' | 'tel' | 'textarea', fieldLabel: string) => {
    const existingIndex = data.fields.findIndex((f) => f.name === fieldName);
    if (existingIndex >= 0) {
      // Remove field
      const newFields = data.fields.filter((_, i) => i !== existingIndex);
      onUpdate({ ...data, fields: newFields });
    } else {
      // Add field
      const newField = {
        name: fieldName,
        type: fieldType,
        required: fieldName === 'email' || fieldName === 'message',
        placeholder: fieldLabel,
      };
      onUpdate({
        ...data,
        fields: [...data.fields, newField],
      });
    }
  };

  const handleUpdateField = (index: number, updates: Partial<ContactFormComponentData['fields'][0]>) => {
    const newFields = [...data.fields];
    newFields[index] = { ...newFields[index], ...updates };
    onUpdate({ ...data, fields: newFields });
  };

  const handleRemoveField = (index: number) => {
    const newFields = data.fields.filter((_, i) => i !== index);
    onUpdate({ ...data, fields: newFields });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Canvas mode - show clean content only
  const showHeader = data.showHeader !== false;
  const showProfileCard = data.showProfileCard || false;
  const layout = data.layout || (showProfileCard ? 'split' : 'single');
  
  // Get styles from component
  const styles = (data as any).styles || {};
  const borderRadius = styles.borderRadius || '12px';
  const inputBackgroundColor = styles.inputBackgroundColor || '#ffffff';
  const textColor = styles.color || 'var(--palette-title)';
  const borderColor = styles.borderColor || 'rgba(0,0,0,0.1)';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '24px';
  const fieldSpacing = data.fieldSpacing || '20px';
  const buttonColor = data.buttonColor || 'var(--palette-primary)';
  const buttonTextColor = data.buttonTextColor || '#ffffff';
  const shadow = data.shadow || 'none';
  
  const successMessage = data.successMessage || "Thanks for reaching out! We'll get back to you shortly.";

  if (isSubmitted) {
      return (
        <div 
          className="w-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300"
          style={{
            minHeight: '400px',
            backgroundColor: styles.backgroundColor || 'transparent',
            borderRadius: borderRadius,
            border: borderWidth !== '0px' ? `${borderWidth} solid ${borderColor}` : undefined,
            boxShadow: shadow !== 'none' ? shadow : undefined,
          }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--palette-primary)', color: '#fff' }}
          >
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--palette-title)' }}>Message Sent!</h3>
          <p className="text-muted-foreground max-w-md">{successMessage}</p>
          <Button 
            variant="outline" 
            className="mt-8"
            onClick={() => setIsSubmitted(false)}
          >
            Send another message
          </Button>
        </div>
      );
  }
  
  const formContent = (
      <form 
        className="w-full space-y-6" 
        onSubmit={handleSubmit} 
        style={{ 
          borderRadius: borderRadius,
          padding: padding,
          backgroundColor: styles.backgroundColor || 'transparent',
          border: borderWidth !== '0px' ? `${borderWidth} solid ${borderColor}` : undefined,
          boxShadow: shadow !== 'none' ? shadow : undefined,
        }}
      >
        {data.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: index < data.fields.length - 1 ? fieldSpacing : undefined }}>
            <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
              {field.placeholder || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <Textarea
                placeholder={`Enter your ${field.name}...`}
                required={field.required}
                rows={5}
                className="w-full resize-none transition-all focus:ring-2"
                style={{
                  borderRadius: borderRadius,
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                  color: textColor,
                  backgroundColor: inputBackgroundColor,
                }}
              />
            ) : (
              <Input
                type={field.type}
                placeholder={`Enter your ${field.name}...`}
                required={field.required}
                className="w-full h-12 transition-all focus:ring-2"
                style={{
                  borderRadius: borderRadius,
                  borderColor: borderColor,
                  borderWidth: borderWidth,
                  color: textColor,
                  backgroundColor: inputBackgroundColor,
                }}
              />
            )}
          </div>
        ))}
        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-6 text-base font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: buttonColor,
              color: buttonTextColor,
              borderRadius: borderRadius,
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {data.submitText || 'Send Message'}
                <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
  );

  // Get width - use data.width or default to max-w-4xl
  const widthClass = data.width && data.width.startsWith('max-w-') 
    ? data.width 
    : data.width 
      ? `w-full` 
      : 'max-w-4xl';
  const widthStyle = data.width && !data.width.startsWith('max-w-') 
    ? { maxWidth: data.width } 
    : {};
  
  // Split layout with profile card
  if (layout === 'split' && showProfileCard) {
    return (
        <div className={`w-full ${widthClass} mx-auto`} style={widthStyle}>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 sticky top-24">
              {showHeader && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--palette-title)' }}>
                    {data.headerTitle || 'Get in Touch'}
                  </h2>
                  {data.headerSubtitle && (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {data.headerSubtitle}
                    </p>
                  )}
                </div>
              )}
              
              {showProfileCard && (
                <div 
                  className="border rounded-2xl p-8 bg-background/50 backdrop-blur-sm" 
                  style={{ 
                    borderRadius: 'var(--palette-radius, 0.75rem)',
                    borderColor: borderColor,
                  }}
                >
                  <div className="flex items-center gap-5 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarImage src={data.profileCardImage} />
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                        {data.profileCardName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--palette-title)' }}>
                        {data.profileCardName || 'Contact Person'}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {data.profileCardTitle || 'Team Member'}
                      </p>
                    </div>
                  </div>
                  {data.profileCardDescription && (
                    <p className="text-muted-foreground leading-relaxed">
                      {data.profileCardDescription}
                    </p>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span>hello@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <span>Response time: Within 24 hours</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              {formContent}
            </div>
          </div>
      </div>
    );
  }

  // Single column layout
  return (
      <div className={`w-full ${widthClass} mx-auto`} style={widthStyle}>
        {showHeader && (
          <div className="mb-10 space-y-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--palette-title)' }}>
              {data.headerTitle || 'Get in Touch'}
            </h2>
            {data.headerSubtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {data.headerSubtitle}
              </p>
            )}
          </div>
        )}
        {formContent}
      </div>
    );
}

export default ContactForm;
