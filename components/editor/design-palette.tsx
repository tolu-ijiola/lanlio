import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignPalette, defaultDesignPalette } from "@/lib/editor-state";
import { Palette, Type, CornerDownRight, Check, Sparkles } from "lucide-react";

interface DesignPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palette: DesignPalette;
  onUpdate: (palette: DesignPalette) => void;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  fontFamily: string;
  description?: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Classic',
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
    titleColor: '#000000',
    descriptionColor: '#4b5563',
    fontFamily: 'Inter',
    description: 'Clean black and white'
  },
  {
    id: 'dark',
    name: 'Dark',
    primaryColor: '#ffffff',
    backgroundColor: '#000000',
    titleColor: '#ffffff',
    descriptionColor: '#a1a1aa',
    fontFamily: 'Inter',
    description: 'Elegant dark mode'
  },
  {
    id: 'ocean',
    name: 'Ocean Gradient',
    primaryColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    titleColor: '#0c4a6e',
    descriptionColor: '#475569',
    fontFamily: 'Poppins',
    description: 'Blue gradient accents'
  },
  {
    id: 'forest',
    name: 'Forest Gradient',
    primaryColor: '#10b981',
    backgroundColor: '#ffffff',
    titleColor: '#064e3b',
    descriptionColor: '#475569',
    fontFamily: 'Montserrat',
    description: 'Green gradient accents'
  },
  {
    id: 'sunset',
    name: 'Sunset Gradient',
    primaryColor: '#f59e0b',
    backgroundColor: '#ffffff',
    titleColor: '#78350f',
    descriptionColor: '#475569',
    fontFamily: 'Lato',
    description: 'Warm gradient accents'
  },
  {
    id: 'lavender',
    name: 'Lavender Gradient',
    primaryColor: '#a855f7',
    backgroundColor: '#ffffff',
    titleColor: '#581c87',
    descriptionColor: '#475569',
    fontFamily: 'Raleway',
    description: 'Purple gradient accents'
  },
  {
    id: 'rose',
    name: 'Rose Gradient',
    primaryColor: '#ec4899',
    backgroundColor: '#ffffff',
    titleColor: '#831843',
    descriptionColor: '#475569',
    fontFamily: 'Open Sans',
    description: 'Pink gradient accents'
  },
  {
    id: 'slate',
    name: 'Slate Gradient',
    primaryColor: '#475569',
    backgroundColor: '#ffffff',
    titleColor: '#1e293b',
    descriptionColor: '#475569',
    fontFamily: 'Roboto',
    description: 'Gray gradient accents'
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    primaryColor: '#6366f1',
    backgroundColor: '#000000',
    titleColor: '#ffffff',
    descriptionColor: '#a1a1aa',
    fontFamily: 'Source Sans Pro',
    description: 'Dark mode with indigo accents'
  },
  {
    id: 'emerald',
    name: 'Emerald Gradient',
    primaryColor: '#14b8a6',
    backgroundColor: '#ffffff',
    titleColor: '#134e4a',
    descriptionColor: '#475569',
    fontFamily: 'Ubuntu',
    description: 'Teal gradient accents'
  },
  {
    id: 'crimson',
    name: 'Crimson Gradient',
    primaryColor: '#dc2626',
    backgroundColor: '#ffffff',
    titleColor: '#991b1b',
    descriptionColor: '#475569',
    fontFamily: 'Nunito',
    description: 'Red gradient accents'
  },
];

const googleFonts = [
  { name: 'Inter', category: 'Sans Serif' },
  { name: 'Roboto', category: 'Sans Serif' },
  { name: 'Open Sans', category: 'Sans Serif' },
  { name: 'Lato', category: 'Sans Serif' },
  { name: 'Montserrat', category: 'Sans Serif' },
  { name: 'Raleway', category: 'Sans Serif' },
  { name: 'Poppins', category: 'Sans Serif' },
  { name: 'Source Sans Pro', category: 'Sans Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Cormorant', category: 'Serif' },
  { name: 'Oswald', category: 'Display' },
  { name: 'Bebas Neue', category: 'Display' },
  { name: 'Ubuntu', category: 'Sans Serif' },
  { name: 'Nunito', category: 'Sans Serif' },
  { name: 'Dancing Script', category: 'Handwriting' },
  { name: 'Fredoka One', category: 'Display' },
  { name: 'Pacifico', category: 'Handwriting' },
  { name: 'Satisfy', category: 'Handwriting' },
  { name: 'Lobster', category: 'Display' },
];

const borderRadiusOptions = [
  { value: '0', label: 'None', preview: '0' },
  { value: '0.25rem', label: 'Small', preview: '4px' },
  { value: '0.5rem', label: 'Medium', preview: '8px' },
  { value: '0.75rem', label: 'Large', preview: '12px' },
  { value: '1rem', label: 'Extra Large', preview: '16px' },
  { value: '9999px', label: 'Rounded', preview: '●' },
];

function DesignPalette({ open, onOpenChange, palette, onUpdate }: DesignPaletteProps) {
  const [localPalette, setLocalPalette] = React.useState<DesignPalette>(palette);
  const [selectedTheme, setSelectedTheme] = React.useState<Theme | null>(null);

  useEffect(() => {
    setLocalPalette(palette);
    // Find matching theme
    const theme = themes.find(t => 
      t.primaryColor === palette.primaryColor &&
      t.backgroundColor === palette.backgroundColor &&
      t.titleColor === palette.titleColor &&
      t.descriptionColor === palette.descriptionColor
    );
    setSelectedTheme(theme || themes[0]);
  }, [palette, open]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    const newPalette = {
      ...localPalette,
      primaryColor: theme.primaryColor,
      backgroundColor: theme.backgroundColor,
      titleColor: theme.titleColor,
      descriptionColor: theme.descriptionColor,
      fontFamily: theme.fontFamily, // Set theme's default font
    };
    setLocalPalette(newPalette);
    onUpdate(newPalette);
  };

  const handleFontChange = (fontFamily: string) => {
    const newPalette = { ...localPalette, fontFamily };
    setLocalPalette(newPalette);
    onUpdate(newPalette);
  };

  const handleBorderRadiusChange = (borderRadius: string) => {
    const newPalette = { ...localPalette, borderRadius };
    setLocalPalette(newPalette);
    onUpdate(newPalette);
  };

  const handleReset = () => {
    const defaultTheme = themes[0]; // Classic theme
    const newPalette = {
      primaryColor: defaultTheme.primaryColor,
      backgroundColor: defaultTheme.backgroundColor,
      titleColor: defaultTheme.titleColor,
      descriptionColor: defaultTheme.descriptionColor,
      fontFamily: defaultTheme.fontFamily,
      borderRadius: defaultDesignPalette.borderRadius,
    };
    setLocalPalette(newPalette);
    setSelectedTheme(defaultTheme);
    onUpdate(newPalette);
  };

  const handleApply = () => {
    onUpdate(localPalette);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                Design Theme
              </DialogTitle>
              <DialogDescription className="mt-1">
                Choose a theme and customize typography and styling
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="theme" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4 mb-2">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <CornerDownRight className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <TabsContent value="theme" className="mt-4 space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Choose a Theme</Label>
                <p className="text-xs text-muted-foreground mb-4">
                  Select a color theme for your site. You can customize the font separately.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme)}
                      className={`relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                        selectedTheme?.id === theme.id
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {selectedTheme?.id === theme.id && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-base">{theme.name}</div>
                            {theme.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {theme.description}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div
                            className="h-10 flex-1 rounded-lg border-2 border-border/50"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div
                            className="h-10 flex-1 rounded-lg border-2 border-border/50"
                            style={{ backgroundColor: theme.backgroundColor }}
                          />
                          <div
                            className="h-10 flex-1 rounded-lg border-2 border-border/50"
                            style={{ backgroundColor: theme.titleColor }}
                          />
                        </div>
                        
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                          Font: <span className="font-medium">{theme.fontFamily}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Font Family</Label>
                  <p className="text-xs text-muted-foreground mb-4">
                    Choose a font from Google Fonts. You can change the font while keeping your theme colors.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {googleFonts.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => handleFontChange(font.name)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 hover:bg-accent ${
                          localPalette.fontFamily === font.name
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border'
                        }`}
                      >
                        <div
                          style={{ fontFamily: font.name }}
                          className="font-semibold text-lg mb-1"
                        >
                          {font.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {font.category}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Border Radius</Label>
                  <p className="text-xs text-muted-foreground mb-4">
                    Adjust the roundness of corners for buttons, cards, images, and other elements
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {borderRadiusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleBorderRadiusChange(option.value)}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                          localPalette.borderRadius === option.value
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.preview}</span>
                        </div>
                        <div
                          className="w-full h-12 bg-primary/20 border border-primary/30"
                          style={{ borderRadius: option.value }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Live Preview</Label>
                  <p className="text-xs text-muted-foreground mb-4">
                    See how your theme and design choices look in action
                  </p>
                </div>

                <div
                  className="p-8 rounded-xl border-2 border-border space-y-6 transition-all"
                  style={{
                    backgroundColor: localPalette.backgroundColor,
                    borderRadius: localPalette.borderRadius,
                    fontFamily: localPalette.fontFamily,
                  }}
                >
                  <div className="space-y-2">
                    <h1
                      style={{
                        color: localPalette.titleColor,
                        fontFamily: localPalette.fontFamily,
                      }}
                      className="text-3xl font-bold"
                    >
                      Sample Heading
                    </h1>
                    <h2
                      style={{
                        color: localPalette.titleColor,
                        fontFamily: localPalette.fontFamily,
                      }}
                      className="text-2xl font-semibold"
                    >
                      Subheading
                    </h2>
                    <p
                      style={{
                        color: localPalette.descriptionColor,
                        fontFamily: localPalette.fontFamily,
                      }}
                      className="text-base leading-relaxed"
                    >
                      This is a sample paragraph that demonstrates how your description text will look with the selected theme and typography.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      style={{
                        backgroundColor: localPalette.primaryColor,
                        color: '#ffffff',
                        borderRadius: localPalette.borderRadius,
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: localPalette.primaryColor,
                        color: localPalette.primaryColor,
                        borderRadius: localPalette.borderRadius,
                      }}
                    >
                      Outline Button
                    </Button>
                  </div>

                  <div
                    className="p-4 rounded-lg border overflow-hidden"
                    style={{
                      backgroundColor: localPalette.backgroundColor,
                      borderColor: localPalette.descriptionColor + '30',
                      borderRadius: localPalette.borderRadius,
                    }}
                  >
                    <div
                      style={{
                        color: localPalette.titleColor,
                        fontFamily: localPalette.fontFamily,
                      }}
                      className="font-semibold mb-2"
                    >
                      Card Title
                    </div>
                    <div
                      style={{
                        color: localPalette.descriptionColor,
                        fontFamily: localPalette.fontFamily,
                      }}
                      className="text-sm mb-3"
                    >
                      This is a sample card component showing how elements will look with your design choices.
                    </div>
                    <div
                      className="w-full h-32 rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: localPalette.primaryColor + '20',
                        borderRadius: localPalette.borderRadius,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                        Sample Image
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t px-6 py-4 bg-muted/30 flex items-center justify-between">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DesignPalette;
