import React from 'react'
import { Input } from '../ui/input'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { LanguageComponentData, ComponentData } from '@/lib/editor-state'

interface LanguagesProps {
  data: LanguageComponentData;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

function Languages({ data, isPreviewMode, onUpdate }: LanguagesProps) {
  const [newLanguage, setNewLanguage] = React.useState({ name: '', level: 'Fluent' });

  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      const exists = data.languages.some(l => l.name.toLowerCase() === newLanguage.name.trim().toLowerCase());
      if (!exists) {
        onUpdate({
          ...data,
          languages: [...data.languages, { name: newLanguage.name.trim(), level: newLanguage.level }],
        });
        setNewLanguage({ name: '', level: 'Fluent' });
      }
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = data.languages.filter((_, i) => i !== index);
    onUpdate({ ...data, languages: newLanguages });
  };

  const handleUpdateLevel = (index: number, level: string) => {
    const newLanguages = [...data.languages];
    newLanguages[index] = { ...newLanguages[index], level };
    onUpdate({ ...data, languages: newLanguages });
  };

  if (isPreviewMode) {
    if (data.languages.length === 0) return null;
    
    const styles = (data as any).styles || {};
    const gap = (data as any).gap || '8px';
    const textColor = styles.color || 'var(--palette-title)';
    const backgroundColor = styles.backgroundColor || '#ffffff';
    const borderColor = styles.borderColor || '#e5e7eb';
    const borderRadius = styles.borderRadius || '24px';
    const borderWidth = styles.borderWidth || '1px';
    const padding = styles.padding || '8px 16px';
    
    return (
      <div className='flex flex-wrap' style={{ gap }}>
        {data.languages.map((lang, index) => (
          <div 
            key={index} 
            className='font-medium transition-all duration-300 hover:scale-105'
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              borderRadius: borderRadius,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: 'solid',
              padding: padding,
            }}
          >
            {lang.name} {lang.level && <span className="text-xs opacity-70">({lang.level})</span>}
          </div>
        ))}
      </div>
    );
  }

  // Canvas mode - show clean content only
  if (data.languages.length === 0) return null;
  
  const styles = (data as any).styles || {};
  const gap = (data as any).gap || '8px';
  const textColor = styles.color || 'var(--palette-title)';
  const backgroundColor = styles.backgroundColor || '#ffffff';
  const borderColor = styles.borderColor || '#e5e7eb';
  const borderRadius = styles.borderRadius || '24px';
  const borderWidth = styles.borderWidth || '1px';
  const padding = styles.padding || '8px 16px';
  const variant = (data as any).variant || 'pill';
  const direction = (data as any).direction || 'horizontal';
  
  // Variant styles
  let variantStyles: any = {};
  if (variant === 'badge') {
    variantStyles = { borderRadius: '8px', padding: '6px 12px' };
  } else if (variant === 'minimal') {
    variantStyles = { backgroundColor: 'transparent', borderWidth: '0px' };
  }
  
  const containerClass = direction === 'vertical' ? 'flex flex-col' : 'flex flex-wrap';
  
  return (
    <div className={containerClass} style={{ gap }}>
      {data.languages.map((lang, index) => (
        <div 
          key={index} 
          className='font-medium transition-all duration-300 hover:scale-105'
          style={{
            backgroundColor: variantStyles.backgroundColor || backgroundColor,
            color: textColor,
            borderRadius: variantStyles.borderRadius || borderRadius,
            borderColor: borderColor,
            borderWidth: variantStyles.borderWidth || borderWidth,
            borderStyle: 'solid',
            padding: variantStyles.padding || padding,
          }}
        >
          {lang.name} {lang.level && <span className="text-xs opacity-70">({lang.level})</span>}
        </div>
      ))}
    </div>
  );
}

export default Languages
