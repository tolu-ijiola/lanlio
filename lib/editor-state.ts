import { ComponentType } from './component-registry';

// Component data types
export interface BaseComponentData {
  id: string;
  type: ComponentType;
  tabletStyles?: React.CSSProperties;
  mobileStyles?: React.CSSProperties;
}

export interface TextComponentData extends BaseComponentData {
  type: 'header' | 'text';
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ButtonComponentData extends BaseComponentData {
  type: 'button';
  buttons: Array<{
    text: string;
    link: string;
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    icon?: string;
    hasIcon?: boolean;
    iconPosition?: 'left' | 'right';
    openInNewTab?: boolean;
    displayMode?: 'text' | 'icon' | 'both';
    iconPlacement?: 'left' | 'right';
    iconColor?: string;
    customIcon?: string;
    width?: string;
    height?: string;
    paddingX?: string;
    paddingY?: string;
    contentAlign?: 'left' | 'center' | 'right';
  }>;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageComponentData extends BaseComponentData {
  type: 'image';
  src: string;
  alt?: string;
}

export interface VideoComponentData extends BaseComponentData {
  type: 'video';
  embedUrl: string;
  title?: string;
}

export interface EmbedComponentData extends BaseComponentData {
  type: 'embed';
  url: string;
  title?: string;
}

export interface HtmlComponentData extends BaseComponentData {
  type: 'html';
  code: string;
}

export interface ProfileComponentData extends BaseComponentData {
  type: 'profile';
  name: string;
  jobTitle: string;
  title: string;
  summary: string;
  avatar?: string;
}

export interface GalleryComponentData extends BaseComponentData {
  type: 'gallery';
  images: Array<{ src: string; alt?: string }>;
  mode?: 'grid' | 'marquee' | 'carousel';
  direction?: 'left' | 'right';
  columns?: 2 | 3 | 4 | 5 | 6;
  maxImages?: number;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'auto';
  spacing?: number; // in pixels or rem
  speed?: number; // animation speed in seconds (for marquee/carousel)
  // Carousel specific
  carouselMoveFull?: boolean; // move by full slide or by pixels
  carouselMoveByPx?: number; // pixels to move if not full
  carouselImagesToShow?: number; // how many images to show at once
  carouselAutoPlay?: boolean; // auto-rotate carousel
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
  variant?: 'pill' | 'badge' | 'minimal' | 'outlined';
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
  width?: string; // Form width (e.g., "100%", "800px", "max-w-2xl")
  // Header options
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  // Profile card options
  showProfileCard?: boolean;
  profileCardName?: string;
  profileCardTitle?: string;
  profileCardImage?: string;
  profileCardDescription?: string;
  layout?: 'single' | 'split';
  // Styling options
  buttonColor?: string;
  buttonTextColor?: string;
  fieldSpacing?: string;
  shadow?: string;
  successMessage?: string;
}

export interface ContactDetailsComponentData extends BaseComponentData {
  type: 'contact-details';
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  availability?: string;
  variant?: 'default' | 'minimal' | 'card' | 'inline';
  alignment?: 'left' | 'center' | 'right';
  iconStyle?: 'default' | 'circle' | 'square' | 'none';
  customFields?: Array<{
    id: string;
    icon: string;
    label: string;
    value: string;
    type: 'text' | 'link' | 'email' | 'phone';
  }>;
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
  playlistUrl?: string;
  title?: string;
  playlists?: Array<{
    url: string;
    title?: string;
  }>;
  layout?: 'grid' | 'list';
}

export interface LinkBlockComponentData extends BaseComponentData {
  type: 'link-block';
  links: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  layout?: 'grid' | 'side-by-side';
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
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  badgeColor?: string;
}

export interface LayoutComponentData extends BaseComponentData {
  type: 'layout';
  layoutType: 'single' | 'double' | 'three';
  direction?: 'horizontal' | 'vertical';
  isLayout: true;
  title?: string;
  backgroundType?: 'none' | 'color' | 'image' | 'video' | 'url';
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundUrl?: string;
  backgroundOverlay?: boolean;
  backgroundOverlayEnabled?: boolean;
  backgroundOverlayColor?: string;
  backgroundOverlayOpacity?: number;
  height?: string;
  columnWidths?: number[]; // Array of percentages, e.g. [50, 50] or [30, 70]
  columnAlignments?: string[]; // Array of alignment values, e.g. ['flex-start', 'center', 'flex-end']
  styles?: React.CSSProperties;
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
    customIcon?: string;
  }>;
  alignment?: 'left' | 'center' | 'right';
  arrangement?: 'horizontal' | 'vertical';
  displayMode?: 'icons-only' | 'icons-text' | 'text-only';
  size?: 'sm' | 'md' | 'lg';
  buttonStyle?: 'outline' | 'filled';
  shape?: 'pill' | 'rounded' | 'square';
  iconOrientation?: 'inline' | 'stacked';
  lineMode?: 'auto' | 'single';
  backgroundColor?: string;
  iconColor?: string;
  textColor?: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  targetType: 'page' | 'link' | 'email' | 'phone';
  targetValue: string;
}

export interface NavigationComponentData extends BaseComponentData {
  type: 'navigation';
  variant: 'logo-text' | 'logo-only' | 'text-only';
  brandText: string;
  logoImage?: string;
  tagline?: string;
  menuDisplay: 'inline' | 'hamburger';
  menuItems: NavigationMenuItem[];
  isSticky?: boolean;
  button?: {
    enabled: boolean;
    label: string;
    iconMode: 'text' | 'icon' | 'both';
    icon?: string;
    iconPlacement?: 'left' | 'right';
    style: 'solid' | 'outline' | 'ghost';
    linkType: 'page' | 'link' | 'email' | 'phone';
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
  | HtmlComponentData
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
  | LayoutComponentData
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
    case 'embed':
      return { id, type: 'embed', url: '', title: 'Embed' };
    case 'html':
      return { id, type: 'html', code: '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px; text-align: center;">\n  <h3>Hello World</h3>\n  <p>Edit this HTML code in the inspector.</p>\n</div>' };
    case 'navigation':
      return {
        id,
        type: 'navigation',
        variant: 'logo-text',
        brandText: 'Studio',
        menuDisplay: 'inline',
        isSticky: false,
        menuItems: [
          { id: `${id}-item-1`, label: 'About', targetType: 'page', targetValue: '#about' },
          { id: `${id}-item-2`, label: 'Work', targetType: 'page', targetValue: '#work' },
          { id: `${id}-item-3`, label: 'Contact', targetType: 'page', targetValue: '#contact' },
        ],
        button: {
          enabled: true,
          label: 'Hire Me',
          iconMode: 'text',
          iconPlacement: 'left',
          style: 'solid',
          linkType: 'page',
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
        width: 'max-w-5xl',
        showHeader: true,
        headerTitle: 'Love to hear from you, Get in touch 👋',
        style: 'default',
      };
    case 'contact-details':
      return { 
        id, 
        type: 'contact-details', 
        variant: 'default',
        alignment: 'left',
        iconStyle: 'default',
        customFields: []
      };
    case 'languages':
      return { id, type: 'languages', languages: [] };
    case 'github':
      return { id, type: 'github', username: '', showRepos: false };
    case 'spotify':
      return { id, type: 'spotify', playlists: [], layout: 'grid' };
    case 'link-block':
      return { id, type: 'link-block', links: [], layout: 'grid' };
    case 'projects':
      return { id, type: 'projects', projects: [], mode: 'grid' };
    case 'profile-photo':
      return {
        id,
        type: 'profile-photo',
        rounded: 'full',
        alignment: 'center',
        size: 'md',
        showBadge: true,
        badgeColor: '#22c55e',
      };
    case 'tools':
      return { id, type: 'tools', tools: [] };
    case 'social-media':
      return {
        id,
        type: 'social-media',
        links: [
          { platform: 'GitHub', url: 'https://github.com/username' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/username' },
        ],
        alignment: 'center',
        arrangement: 'horizontal',
        displayMode: 'icons-text',
        size: 'md',
        buttonStyle: 'filled',
        shape: 'pill',
        iconOrientation: 'inline',
        lineMode: 'auto',
        backgroundColor: '#ffffff',
        iconColor: '#0f172a',
        textColor: '#0f172a',
      };
    case 'layout':
      return {
        id,
        type: 'layout',
        layoutType: 'single',
        direction: 'vertical',
        isLayout: true,
        backgroundType: 'none',
        title: '',
        height: 'auto',
        backgroundOverlay: false,
        backgroundOverlayColor: '#000000',
        backgroundOverlayOpacity: 0.5,
      };
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

