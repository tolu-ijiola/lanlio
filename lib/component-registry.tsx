import React from 'react';
import Profile from '@/components/editor/profile';
import CTAButton from '@/components/editor/button';
import EditorImage from '@/components/editor/image';
import Skills from '@/components/editor/skills';
import Experience from '@/components/editor/experience';
import Projects from '@/components/editor/projects';
import Award from '@/components/editor/award';
import ContactForm from '@/components/editor/contact-form';
import ContactDetails from '@/components/editor/contact-details';
import SocialMedia from '@/components/editor/social-media';
import Gallery from '@/components/editor/gallery';
import Video from '@/components/editor/video';
import GitHub from '@/components/editor/github';
import Spotify from '@/components/editor/spotify';
import Divider from '@/components/editor/divider';
import Tools from '@/components/editor/tools';
import Languages from '@/components/editor/languages';
import Review from '@/components/editor/review';
import Services from '@/components/editor/services';
import Pricing from '@/components/editor/pricing';
import Spacer from '@/components/editor/spacer';
import LinkBlock from '@/components/editor/link-block';
import ProfilePhoto from '@/components/editor/profile-photo';
import { EditableHeader, EditableText } from '@/components/editor/editable-text';
import Navigation from '@/components/editor/navigation';

export type ComponentType = 
  | 'profile'
  | 'header'
  | 'text'
  | 'button'
  | 'image'
  | 'video'
  | 'gallery'
  | 'embed'
  | 'html'
  | 'navigation'
  | 'skills'
  | 'experience'
  | 'services'
  | 'pricing'
  | 'spacer'
  | 'projects'
  | 'award'
  | 'review'
  | 'contact-form'
  | 'contact-details'
  | 'social-media'
  | 'github'
  | 'spotify'
  | 'divider'
  | 'tools'
  | 'languages'
  | 'link-block'
  | 'profile-photo';
  // | 'layout';

export interface ComponentMetadata {
  id: ComponentType;
  name: string;
  description: string;
  category: 'text' | 'media' | 'social' | 'contact' | 'content';
  icon?: React.ReactNode;
  component: React.ComponentType<any>;
}

export const componentRegistry: Record<ComponentType, ComponentMetadata> = {
  profile: {
    id: 'profile',
    name: 'Profile',
    description: 'Personal profile with name, title, and summary',
    category: 'text',
    component: Profile,
  },
  header: {
    id: 'header',
    name: 'Header',
    description: 'Section header text',
    category: 'text',
    component: EditableHeader,
  },
  navigation: {
    id: 'navigation',
    name: 'Navigation',
    description: 'Responsive website navigation',
    category: 'content',
    component: Navigation,
  },
  text: {
    id: 'text',
    name: 'Text',
    description: 'Simple text content',
    category: 'text',
    component: EditableText,
  },
  button: {
    id: 'button',
    name: 'Button',
    description: 'Call-to-action button',
    category: 'text',
    component: CTAButton,
  },
  image: {
    id: 'image',
    name: 'Image',
    description: 'Upload and display an image',
    category: 'media',
    component: EditorImage,
  },
  video: {
    id: 'video',
    name: 'Video',
    description: 'Embed a video',
    category: 'media',
    component: Video,
  },
  gallery: {
    id: 'gallery',
    name: 'Gallery',
    description: 'Image gallery',
    category: 'media',
    component: Gallery,
  },
  embed: {
    id: 'embed',
    name: 'Embed',
    description: 'Embed external content (YouTube, Maps, etc.)',
    category: 'media',
    component: React.lazy(() => import('@/components/editor/embed')),
  },
  html: {
    id: 'html',
    name: 'HTML Code',
    description: 'Custom HTML, CSS, and JavaScript',
    category: 'content',
    component: React.lazy(() => import('@/components/editor/html')),
  },
  skills: {
    id: 'skills',
    name: 'Skills',
    description: 'Display your skills',
    category: 'content',
    component: Skills,
  },
  experience: {
    id: 'experience',
    name: 'Experience',
    description: 'Work experience section',
    category: 'content',
    component: Experience,
  },
  services: {
    id: 'services',
    name: 'Services',
    description: 'Services you offer',
    category: 'content',
    component: Services,
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing',
    description: 'Pricing plans and packages',
    category: 'content',
    component: Pricing,
  },
  spacer: {
    id: 'spacer',
    name: 'Spacer',
    description: 'Add vertical spacing between sections',
    category: 'text',
    component: Spacer,
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    description: 'Showcase your projects',
    category: 'content',
    component: Projects,
  },
  award: {
    id: 'award',
    name: 'Awards',
    description: 'Awards and achievements',
    category: 'content',
    component: Award,
  },
  review: {
    id: 'review',
    name: 'Reviews',
    description: 'Customer reviews and testimonials',
    category: 'content',
    component: Review,
  },
  'contact-form': {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Contact form for visitors',
    category: 'contact',
    component: ContactForm,
  },
  'contact-details': {
    id: 'contact-details',
    name: 'Contact Details',
    description: 'Contact information',
    category: 'contact',
    component: ContactDetails,
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media',
    description: 'Social media links',
    category: 'social',
    component: SocialMedia,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub profile embed',
    category: 'social',
    component: GitHub,
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    description: 'Spotify playlist embed',
    category: 'social',
    component: Spotify,
  },
  divider: {
    id: 'divider',
    name: 'Divider',
    description: 'Visual separator line',
    category: 'text',
    component: Divider,
  },
  tools: {
    id: 'tools',
    name: 'Tools',
    description: 'Tools and technologies',
    category: 'content',
    component: Tools,
  },
  languages: {
    id: 'languages',
    name: 'Languages',
    description: 'Languages you speak',
    category: 'content',
    component: Languages,
  },
  'link-block': {
    id: 'link-block',
    name: 'Link Block',
    description: 'Beautiful link cards',
    category: 'content',
    component: LinkBlock,
  },
  'profile-photo': {
    id: 'profile-photo',
    name: 'Profile Photo',
    description: 'Display a profile photo with styling options',
    category: 'media',
    component: ProfilePhoto,
  },
  // layout: {
  //   id: 'layout',
  //   name: 'Layout',
  //   description: 'Multi-column layout container',
  //   category: 'text',
  //   component: React.lazy(() => import('@/components/editor/layout').then(mod => ({ default: mod.LayoutComponent }))),
  // },
};

export const componentCategories = {
  text: { name: 'Text', components: ['profile', 'header', 'text', 'button', 'divider', 'spacer'] as ComponentType[] },
  media: { name: 'Media', components: ['image', 'video', 'gallery', 'embed', 'profile-photo'] as ComponentType[] },
  content: { name: 'Content', components: ['navigation', 'skills', 'experience', 'services', 'pricing', 'projects', 'award', 'review', 'tools', 'languages', 'link-block'] as ComponentType[] },
  contact: { name: 'Contact', components: ['contact-form', 'contact-details'] as ComponentType[] },
  social: { name: 'Social', components: ['social-media', 'github', 'spotify'] as ComponentType[] },
};

export function getComponent(type: ComponentType): React.ComponentType<any> {
  if (!componentRegistry[type]) {
    throw new Error(`Component type "${type}" not found in registry`);
  }
  return componentRegistry[type].component;
}

export function searchComponents(query: string): ComponentMetadata[] {
  const searchQuery = query.toLowerCase().trim();
  if (!searchQuery) {
    return Object.values(componentRegistry);
  }
  
  return Object.values(componentRegistry).filter(
    (component) =>
      component.name.toLowerCase().includes(searchQuery) ||
      component.description.toLowerCase().includes(searchQuery) ||
      component.category.toLowerCase().includes(searchQuery)
  );
}

