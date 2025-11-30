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

  return (
    <div className='space-y-4'>
      <div className="flex gap-2">
        <Input
          className="h-12 block border-0 focus:ring-0 focus:border-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Language name"
          value={newLanguage.name}
          onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddLanguage();
            }
          }}
        />
        <select
          value={newLanguage.level}
          onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
          className="px-3 py-2 rounded-md border border-border bg-background"
        >
          <option value="Fluent">Fluent</option>
          <option value="Advanced">Advanced</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Basic">Basic</option>
        </select>
        <Button onClick={handleAddLanguage} disabled={!newLanguage.name.trim()}>
          Add
        </Button>
      </div>
      
      {data.languages.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {data.languages.map((lang, index) => (
            <div key={index} className='rounded-full px-4 py-2 flex items-center gap-2 group font-medium border bg-muted'>
              <span className='text-muted-foreground'>
                {lang.name}
                {lang.level && (
                  <>
                    {' '}
                    <select
                      value={lang.level}
                      onChange={(e) => handleUpdateLevel(index, e.target.value)}
                      className="text-xs bg-transparent border-0 focus:ring-0 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </>
                )}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveLanguage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Languages
