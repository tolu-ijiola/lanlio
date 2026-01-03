import { ComponentType } from './component-registry';

// Component data types
export interface BaseComponentData {
  id: string;
  type: ComponentType;
}

export interface TextComponentData extends BaseComponentData {
  type: 'header' | 'text';
  content: string;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: string;
  fontColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
}

export interface ButtonComponentData extends BaseComponentData {
  type: 'button';
  buttons: Array<{
    text: string;
    link: string;
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    icon?: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageComponentData extends BaseComponentData {
  type: 'image';
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  borderWidth?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderColor?: string;
  borderRadius?: string;
  borderRadiusTopLeft?: string;
  borderRadiusTopRight?: string;
  borderRadiusBottomRight?: string;
  borderRadiusBottomLeft?: string;
  opacity?: number;
  backgroundColor?: string;
  anchorName?: string;
}

export interface VideoComponentData extends BaseComponentData {
  type: 'video';
  embedUrl: string;
  title?: string;
}

export interface EmbedComponentData extends BaseComponentData {
  type: 'embed';
  embedType?: 'website' | 'map' | 'code';
  url?: string;
  code?: string;
  mapAddress?: string;
  width?: string;
  height?: string;
}

export interface ProfileComponentData extends BaseComponentData {
  type: 'profile';
  name: string;
  jobTitle: string;
  title: string;
  summary: string;
  avatar?: string;
  avatarBorderRadius?: string;
  avatarSize?: string;
  nameColor?: string;
  nameSize?: string;
  jobTitleColor?: string;
  jobTitleSize?: string;
  titleColor?: string;
  titleSize?: string;
  summaryColor?: string;
  summarySize?: string;
}

export interface GalleryComponentData extends BaseComponentData {
  type: 'gallery';
  images: Array<{ src: string; alt?: string }>;
  mode?: 'grid' | 'marquee' | 'carousel';
  direction?: 'left' | 'right';
  columns?: 2 | 3 | 4;
  carouselImagesToShow?: number;
  carouselAutoPlay?: boolean;
  aspectRatio?: '16:9' | '4:3' | '3:2' | '1:1' | 'auto';
  spacing?: string;
  speed?: number;
  maxImages?: number;
}

export interface ReviewComponentData extends BaseComponentData {
  type: 'review';
  reviews: Array<{
    name: string;
    role: string;
    company?: string;
    rating: number;
    comment: string;
    avatar?: string;
    date?: string;
  }>;
  mode?: 'grid' | 'marquee';
  direction?: 'left' | 'right';
}

export interface SkillsComponentData extends BaseComponentData {
  type: 'skills';
  skills: string[];
  alignment?: 'left' | 'center' | 'right';
  variant?: 'normal' | 'pills' | 'outline' | 'list';
  layout?: 'horizontal' | 'vertical' | 'grid' | 'marquee';
  speed?: number;
  gap?: string;
}

export interface ExperienceComponentData extends BaseComponentData {
  type: 'experience';
  experiences: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
  }>;
}

export interface ServicesComponentData extends BaseComponentData {
  type: 'services';
  services: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface PricingComponentData extends BaseComponentData {
  type: 'pricing';
  plans: Array<{
    name: string;
    price: string;
    period?: string;
    description: string;
    features: Array<{ text: string }>;
    buttonText: string;
    buttonLink: string;
    popular?: boolean;
  }>;
}

export interface SpacerComponentData extends BaseComponentData {
  type: 'spacer';
  height: string;
}

export interface AwardComponentData extends BaseComponentData {
  type: 'award';
  awards: Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
    image?: string;
  }>;
}

export interface ContactFormComponentData extends BaseComponentData {
  type: 'contact-form';
  fields: Array<{
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    required: boolean;
    placeholder?: string;
  }>;
  submitText: string;
  alignment?: 'left' | 'center' | 'right';
  style?: 'default' | 'minimal' | 'bordered' | 'gradient';
}

export interface ContactDetailsComponentData extends BaseComponentData {
  type: 'contact-details';
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  availability?: string;
  variant?: 'default' | 'minimal' | 'card' | 'inline';
}

export interface LanguageComponentData extends BaseComponentData {
  type: 'languages';
  languages: Array<{ name: string; level?: string }>;
}

export interface GitHubComponentData extends BaseComponentData {
  type: 'github';
  username: string;
  showRepos?: boolean;
  showCommits?: boolean;
}

export interface SpotifyComponentData extends BaseComponentData {
  type: 'spotify';
  playlistUrl: string;
  title?: string;
}

export interface LinkBlockComponentData extends BaseComponentData {
  type: 'link-block';
  links: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

export interface ProjectsComponentData extends BaseComponentData {
  type: 'projects';
  projects: Array<{
    title: string;
    link: string;
    image?: string;
    description?: string;
  }>;
  mode?: 'grid' | 'list' | 'carousel';
}

export interface ProfilePhotoComponentData extends BaseComponentData {
  type: 'profile-photo';
  image?: string;
  rounded?: 'none' | 'small' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

export interface ToolsComponentData extends BaseComponentData {
  type: 'tools';
  tools: string[];
}

export interface SocialMediaComponentData extends BaseComponentData {
  type: 'social-media';
  links: Array<{
    platform: string;
    url: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
  arrangement?: 'horizontal' | 'vertical';
  displayMode?: 'icons-only' | 'icons-text' | 'text-only';
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  targetType: 'anchor' | 'link' | 'email' | 'phone';
  targetValue: string;
}

export interface NavigationComponentData extends BaseComponentData {
  type: 'navigation';
  variant: 'logo-text' | 'logo-only' | 'text-only';
  brandText: string;
  logoImage?: string;
  menuDisplay: 'inline' | 'hamburger';
  menuItems: NavigationMenuItem[];
  isSticky?: boolean;
  button?: {
    enabled: boolean;
    label: string;
    iconMode: 'text' | 'icon' | 'both';
    icon?: string;
    style: 'solid' | 'outline' | 'ghost';
    linkType: 'anchor' | 'link' | 'email' | 'phone';
    linkValue: string;
  };
}

// Design Palette State
export interface DesignPalette {
  primaryColor: string;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  fontFamily: string;
  borderRadius: string;
}

// Union type for all component data
export type ComponentData = 
  | TextComponentData
  | ButtonComponentData
  | ImageComponentData
  | VideoComponentData
  | EmbedComponentData
  | ProfileComponentData
  | GalleryComponentData
  | NavigationComponentData
  | SkillsComponentData
  | ExperienceComponentData
  | ServicesComponentData
  | PricingComponentData
  | SpacerComponentData
  | AwardComponentData
  | ReviewComponentData
  | ContactFormComponentData
  | LanguageComponentData
  | GitHubComponentData
  | SpotifyComponentData
  | LinkBlockComponentData
  | ProjectsComponentData
  | ProfilePhotoComponentData
  | ToolsComponentData
  | SocialMediaComponentData
  | ContactDetailsComponentData
  | BaseComponentData;

// Editor state
export interface EditorState {
  components: ComponentData[];
  isPreviewMode: boolean;
}

// Helper to generate unique ID
export function generateComponentId(): string {
  return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to get default data for a component type
export function getDefaultComponentData(type: ComponentType, id: string): ComponentData {
  switch (type) {
    case 'header':
      return { id, type: 'header', content: 'Section Header' };
    case 'text':
      return { id, type: 'text', content: 'Enter your text here...' };
    case 'button':
      return {
        id,
        type: 'button',
        buttons: [{ text: 'Click Me', link: '#', variant: 'default' }],
        alignment: 'left',
      };
    case 'image':
      return { id, type: 'image', src: '', alt: 'Image' };
    case 'video':
      return { id, type: 'video', embedUrl: '', title: '' };
    case 'embed':
      return { id, type: 'embed', embedType: 'website', url: '' };
    case 'profile':
      return {
        id,
        type: 'profile',
        name: '',
        jobTitle: '',
        title: '',
        summary: '',
      };
    case 'gallery':
      return { id, type: 'gallery', images: [], mode: 'grid', direction: 'left' };
    case 'navigation':
      return {
        id,
        type: 'navigation',
        variant: 'logo-text',
        brandText: 'Studio',
        menuDisplay: 'inline',
        isSticky: false,
        menuItems: [
          { id: `${id}-item-1`, label: 'About', targetType: 'anchor', targetValue: '#about' },
          { id: `${id}-item-2`, label: 'Work', targetType: 'anchor', targetValue: '#work' },
          { id: `${id}-item-3`, label: 'Contact', targetType: 'anchor', targetValue: '#contact' },
        ],
        button: {
          enabled: true,
          label: 'Hire Me',
          iconMode: 'text',
          style: 'solid',
          linkType: 'anchor',
          linkValue: '#contact',
        },
      } as NavigationComponentData;
    case 'skills':
      return { id, type: 'skills', skills: [], alignment: 'left', variant: 'pill' };
    case 'experience':
      return { id, type: 'experience', experiences: [] };
    case 'services':
      return { id, type: 'services', services: [] };
    case 'pricing':
      return { id, type: 'pricing', plans: [] };
    case 'spacer':
      return { id, type: 'spacer', height: '2rem' };
    case 'award':
      return { id, type: 'award', awards: [] };
    case 'review':
      return { id, type: 'review', reviews: [], mode: 'grid', direction: 'left' };
    case 'contact-form':
      return {
        id,
        type: 'contact-form',
        fields: [
          { name: 'name', type: 'text', required: true, placeholder: 'Full Name' },
          { name: 'email', type: 'email', required: true, placeholder: 'Email Address' },
          { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' },
        ],
        submitText: 'Send Message',
        alignment: 'left',
        style: 'default',
      };
    case 'contact-details':
      return { id, type: 'contact-details', variant: 'default' };
    case 'languages':
      return { id, type: 'languages', languages: [] };
    case 'github':
      return { id, type: 'github', username: '', showRepos: true, showCommits: true };
    case 'spotify':
      return { id, type: 'spotify', playlistUrl: '', title: '' };
    case 'link-block':
      return { id, type: 'link-block', links: [] };
    case 'projects':
      return { id, type: 'projects', projects: [], mode: 'grid' };
    case 'profile-photo':
      return { id, type: 'profile-photo', rounded: 'full', alignment: 'center' };
    case 'tools':
      return { id, type: 'tools', tools: [] };
    case 'social-media':
      return { id, type: 'social-media', links: [], alignment: 'center', arrangement: 'horizontal', displayMode: 'icons-text' };
    default:
      return { id, type };
  }
}

// Default design palette (Classic white and black theme)
export const defaultDesignPalette: DesignPalette = {
  primaryColor: '#000000',
  backgroundColor: '#ffffff',
  titleColor: '#000000',
  descriptionColor: '#4b5563',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
};

