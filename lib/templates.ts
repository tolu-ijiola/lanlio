import { ComponentData, generateComponentId, DesignPalette } from "./editor-state";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'portfolio' | 'resume' | 'creative' | 'business' | 'personal';
  thumbnail: string; // CSS gradient or placeholder
  components: ComponentData[];
  designPalette: DesignPalette;
  preview: {
    primaryColor: string;
    backgroundColor: string;
    accentColor?: string;
  };
}

export const allTemplates: Template[] = [
  {
    id: 'modern-portfolio',
    name: 'Modern Portfolio',
    description: 'Clean, professional portfolio perfect for showcasing your work and skills',
    category: 'portfolio',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: {
      primaryColor: '#667eea',
      backgroundColor: '#ffffff',
      accentColor: '#764ba2',
    },
    designPalette: {
      primaryColor: '#667eea',
      backgroundColor: '#ffffff',
      titleColor: '#1a202c',
      descriptionColor: '#4a5568',
      fontFamily: 'Inter',
      borderRadius: '0.75rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'John Doe',
        jobTitle: 'Senior Product Designer',
        title: 'Creative Designer & Problem Solver',
        summary: 'I craft beautiful digital experiences that solve real problems. With 8+ years of experience, I specialize in user-centered design and modern web technologies.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Featured Projects',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'projects',
        projects: [
          {
            title: 'E-Commerce Platform',
            link: '#',
            description: 'Modern e-commerce solution with seamless checkout experience',
            image: '',
          },
          {
            title: 'Mobile Banking App',
            link: '#',
            description: 'Secure and intuitive banking experience for iOS and Android',
            image: '',
          },
          {
            title: 'Design System',
            link: '#',
            description: 'Comprehensive design system for enterprise applications',
            image: '',
          },
        ],
        mode: 'grid',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Skills & Expertise',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'skills',
        skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems', 'Frontend Development'],
        alignment: 'center',
        variant: 'pill',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Experience',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'experience',
        experiences: [
          {
            position: 'Senior Product Designer',
            company: 'Tech Corp',
            period: '2021 - Present',
            description: 'Leading design initiatives for core products, managing a team of 5 designers, and establishing design systems used by 50+ developers.',
          },
          {
            position: 'Product Designer',
            company: 'StartupXYZ',
            period: '2019 - 2021',
            description: 'Designed and shipped multiple features, conducted user research, and collaborated closely with engineering teams.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'button',
        buttons: [
          { text: 'View Portfolio', link: '#', variant: 'default', icon: 'external-link' },
          { text: 'Get in Touch', link: '#', variant: 'outline' },
        ],
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'contact-details',
        variant: 'card',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'www.johndoe.com',
      },
    ],
  },
  {
    id: 'creative-showcase',
    name: 'Creative Showcase',
    description: 'Bold and artistic portfolio for creatives, artists, and designers',
    category: 'creative',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: {
      primaryColor: '#f5576c',
      backgroundColor: '#0a0a0a',
      accentColor: '#f093fb',
    },
    designPalette: {
      primaryColor: '#f5576c',
      backgroundColor: '#0a0a0a',
      titleColor: '#ffffff',
      descriptionColor: '#a0a0a0',
      fontFamily: 'Poppins',
      borderRadius: '1rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Alex Creative',
        jobTitle: 'Visual Artist & Designer',
        title: 'Bringing Ideas to Life Through Design',
        summary: 'Passionate about creating visually stunning experiences that tell stories and evoke emotions. Specializing in brand identity, digital art, and creative direction.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'gallery',
        images: [],
        mode: 'grid',
        columns: 3,
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Selected Works',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'projects',
        projects: [
          {
            title: 'Brand Identity Design',
            link: '#',
            description: 'Complete brand overhaul for luxury fashion brand',
            image: '',
          },
          {
            title: 'Digital Art Collection',
            link: '#',
            description: 'NFT collection featuring 100 unique digital artworks',
            image: '',
          },
          {
            title: 'Creative Direction',
            link: '#',
            description: 'Art direction for major advertising campaign',
            image: '',
          },
        ],
        mode: 'carousel',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'What I Do',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Brand Identity',
            description: 'Creating memorable brand experiences that resonate with audiences',
          },
          {
            title: 'Digital Art',
            description: 'Unique digital artworks and illustrations for various mediums',
          },
          {
            title: 'Creative Direction',
            description: 'Leading creative vision for campaigns and projects',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'social-media',
        links: [
          { platform: 'Instagram', url: 'https://instagram.com' },
          { platform: 'Behance', url: 'https://behance.net' },
          { platform: 'Dribbble', url: 'https://dribbble.com' },
        ],
        alignment: 'center',
        arrangement: 'horizontal',
        displayMode: 'icons-text',
      },
    ],
  },
  {
    id: 'minimal-resume',
    name: 'Minimal Resume',
    description: 'Elegant and simple resume template for professionals',
    category: 'resume',
    thumbnail: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    preview: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      accentColor: '#434343',
    },
    designPalette: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      titleColor: '#1a1a1a',
      descriptionColor: '#666666',
      fontFamily: 'Inter',
      borderRadius: '0.5rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Sarah Johnson',
        jobTitle: 'Software Engineer',
        title: 'Full Stack Developer',
        summary: 'Experienced software engineer specializing in modern web technologies and cloud infrastructure. Passionate about building scalable applications and leading technical teams.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'contact-details',
        variant: 'inline',
        email: 'sarah@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        website: 'www.sarahjohnson.dev',
        availability: 'Available for opportunities',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Professional Experience',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'experience',
        experiences: [
          {
            position: 'Senior Software Engineer',
            company: 'Tech Innovations Inc.',
            period: '2020 - Present',
            description: 'Lead development of microservices architecture serving 1M+ users. Mentored junior developers and established coding standards. Technologies: Node.js, React, AWS, Docker.',
          },
          {
            position: 'Software Engineer',
            company: 'Digital Solutions',
            period: '2018 - 2020',
            description: 'Developed and maintained web applications using React and Node.js. Improved application performance by 40% through optimization.',
          },
          {
            position: 'Junior Developer',
            company: 'Web Agency',
            period: '2016 - 2018',
            description: 'Built responsive websites and web applications. Collaborated with design team to implement pixel-perfect UI components.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Technical Skills',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'skills',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL'],
        alignment: 'left',
        variant: 'badge',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Education',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'text',
        content: 'Bachelor of Science in Computer Science\nUniversity of Technology, 2016',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Languages',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'languages',
        languages: [
          { name: 'English', level: 'Native' },
          { name: 'Spanish', level: 'Fluent' },
          { name: 'French', level: 'Conversational' },
        ],
      },
    ],
  },
  {
    id: 'tech-professional',
    name: 'Tech Professional',
    description: 'Modern template for developers and tech professionals',
    category: 'business',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    preview: {
      primaryColor: '#4facfe',
      backgroundColor: '#ffffff',
      accentColor: '#00f2fe',
    },
    designPalette: {
      primaryColor: '#4facfe',
      backgroundColor: '#ffffff',
      titleColor: '#1e293b',
      descriptionColor: '#64748b',
      fontFamily: 'Inter',
      borderRadius: '0.75rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Michael Chen',
        jobTitle: 'Full Stack Developer',
        title: 'Building the Future, One Line of Code at a Time',
        summary: 'Passionate developer with expertise in modern web technologies. I build scalable applications and contribute to open-source projects.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'github',
        username: '',
        showRepos: true,
        showCommits: true,
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Tech Stack',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'tools',
        tools: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Recent Projects',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'projects',
        projects: [
          {
            title: 'Cloud Infrastructure Platform',
            link: '#',
            description: 'Scalable cloud platform built with microservices architecture',
            image: '',
          },
          {
            title: 'Real-time Chat Application',
            link: '#',
            description: 'WebSocket-based chat app with 10K+ concurrent users',
            image: '',
          },
          {
            title: 'E-commerce API',
            link: '#',
            description: 'RESTful API handling 1M+ requests daily',
            image: '',
          },
        ],
        mode: 'grid',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Experience',
        alignment: 'left',
      },
      {
        id: generateComponentId(),
        type: 'experience',
        experiences: [
          {
            position: 'Senior Full Stack Developer',
            company: 'CloudTech Solutions',
            period: '2021 - Present',
            description: 'Architect and develop cloud-native applications. Lead technical decisions and mentor team members.',
          },
          {
            position: 'Full Stack Developer',
            company: 'StartupHub',
            period: '2019 - 2021',
            description: 'Built and maintained multiple web applications. Implemented CI/CD pipelines and improved deployment processes.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'button',
        buttons: [
          { text: 'View GitHub', link: '#', variant: 'default', icon: 'github' },
          { text: 'Contact Me', link: '#', variant: 'outline' },
        ],
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'contact-form',
        fields: [
          { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
          { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
          { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' },
        ],
        submitText: 'Send Message',
        alignment: 'center',
        style: 'bordered',
      },
    ],
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'Dynamic and vibrant template for agencies and creative teams',
    category: 'business',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    preview: {
      primaryColor: '#fa709a',
      backgroundColor: '#ffffff',
      accentColor: '#fee140',
    },
    designPalette: {
      primaryColor: '#fa709a',
      backgroundColor: '#ffffff',
      titleColor: '#1a1a1a',
      descriptionColor: '#4a4a4a',
      fontFamily: 'Poppins',
      borderRadius: '1rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Creative Agency',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'text',
        content: 'We transform ideas into extraordinary digital experiences. Our team of designers, developers, and strategists work together to create brands that stand out.',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Creative Studio',
        jobTitle: 'Digital Agency',
        title: 'We Create, You Succeed',
        summary: 'A full-service creative agency specializing in brand identity, web design, and digital marketing. We help businesses grow through creative solutions.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Our Services',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Brand Identity',
            description: 'Complete brand strategy and visual identity design',
          },
          {
            title: 'Web Design & Development',
            description: 'Custom websites and web applications',
          },
          {
            title: 'Digital Marketing',
            description: 'SEO, social media, and content marketing',
          },
          {
            title: 'UI/UX Design',
            description: 'User-centered design for digital products',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Featured Work',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'projects',
        projects: [
          {
            title: 'Brand Redesign',
            link: '#',
            description: 'Complete brand transformation for tech startup',
            image: '',
          },
          {
            title: 'E-commerce Website',
            link: '#',
            description: 'Modern e-commerce platform with custom features',
            image: '',
          },
          {
            title: 'Mobile App Design',
            link: '#',
            description: 'iOS and Android app design and development',
            image: '',
          },
        ],
        mode: 'carousel',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Client Testimonials',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'review',
        reviews: [
          {
            name: 'John Smith',
            role: 'CEO',
            company: 'TechStart',
            rating: 5,
            comment: 'Outstanding work! They transformed our brand and increased our online presence significantly.',
          },
          {
            name: 'Emily Davis',
            role: 'Founder',
            company: 'DesignCo',
            rating: 5,
            comment: 'Professional, creative, and delivered beyond expectations. Highly recommended!',
          },
        ],
        mode: 'grid',
      },
      {
        id: generateComponentId(),
        type: 'button',
        buttons: [
          { text: 'Start Your Project', link: '#', variant: 'default', icon: 'arrow-right' },
        ],
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'contact-form',
        fields: [
          { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
          { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
          { name: 'company', type: 'text', required: false, placeholder: 'Company' },
          { name: 'message', type: 'textarea', required: true, placeholder: 'Tell us about your project' },
        ],
        submitText: 'Send Message',
        alignment: 'center',
        style: 'gradient',
      },
    ],
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand',
    description: 'Storytelling-focused template for personal branding',
    category: 'personal',
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: {
      primaryColor: '#a8edea',
      backgroundColor: '#ffffff',
      accentColor: '#fed6e3',
    },
    designPalette: {
      primaryColor: '#a8edea',
      backgroundColor: '#ffffff',
      titleColor: '#2d3748',
      descriptionColor: '#718096',
      fontFamily: 'Inter',
      borderRadius: '0.75rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Emma Wilson',
        jobTitle: 'Content Creator & Speaker',
        title: 'Sharing Stories That Inspire',
        summary: 'I help individuals and businesses tell their stories through compelling content. With a background in journalism and marketing, I create content that connects and converts.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'My Story',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'text',
        content: 'With over 10 years of experience in content creation and storytelling, I\'ve helped hundreds of brands find their voice and connect with their audience. My approach combines data-driven insights with creative storytelling to deliver results that matter.',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'What I Offer',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Content Strategy',
            description: 'Develop comprehensive content strategies that align with your business goals',
          },
          {
            title: 'Copywriting',
            description: 'Compelling copy for websites, marketing materials, and campaigns',
          },
          {
            title: 'Content Creation',
            description: 'Blog posts, articles, social media content, and more',
          },
          {
            title: 'Speaking & Workshops',
            description: 'Keynote speeches and workshops on content marketing and storytelling',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Featured Content',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'projects',
        projects: [
          {
            title: 'Content Marketing Guide',
            link: '#',
            description: 'Comprehensive guide to content marketing strategies',
            image: '',
          },
          {
            title: 'Brand Storytelling Course',
            link: '#',
            description: 'Online course teaching the art of brand storytelling',
            image: '',
          },
        ],
        mode: 'list',
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Let\'s Connect',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'social-media',
        links: [
          { platform: 'LinkedIn', url: 'https://linkedin.com' },
          { platform: 'Twitter', url: 'https://twitter.com' },
          { platform: 'Instagram', url: 'https://instagram.com' },
        ],
        alignment: 'center',
        arrangement: 'horizontal',
        displayMode: 'icons-text',
      },
      {
        id: generateComponentId(),
        type: 'contact-form',
        fields: [
          { name: 'name', type: 'text', required: true, placeholder: 'Your Name' },
          { name: 'email', type: 'email', required: true, placeholder: 'Your Email' },
          { name: 'message', type: 'textarea', required: true, placeholder: 'Your Message' },
        ],
        submitText: 'Send Message',
        alignment: 'center',
        style: 'minimal',
      },
    ],
  },

  {
    id: 'saas-landing',
    name: 'SaaS Launch',
    description: 'High-conversion landing page for software products and startups',
    category: 'business',
    thumbnail: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    preview: {
      primaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      accentColor: '#1e40af',
    },
    designPalette: {
      primaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      titleColor: '#0f172a',
      descriptionColor: '#475569',
      fontFamily: 'Inter',
      borderRadius: '0.5rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Product Features',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'text',
        content: 'Everything you need to scale your business. Our platform provides powerful tools to help you grow faster and smarter.',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Analytics Dashboard',
            description: 'Real-time insights into your business performance with customizable charts.',
          },
          {
            title: 'Team Collaboration',
            description: 'Built-in tools for seamless communication and project management.',
          },
          {
            title: 'Automated Workflows',
            description: 'Save time by automating repetitive tasks with our visual builder.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Trusted by Industry Leaders',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'review',
        reviews: [
          {
            name: 'David Kim',
            role: 'CTO',
            company: 'TechFlow',
            rating: 5,
            comment: 'This platform has completely transformed how we manage our development cycle. Highly recommended!',
          },
          {
            name: 'Sarah Jenkins',
            role: 'Product Manager',
            company: 'Innovate',
            rating: 5,
            comment: 'The best investment we made this year. The ROI was immediate and the support team is fantastic.',
          },
          {
            name: 'Michael Ross',
            role: 'Founder',
            company: 'StartUp Inc',
            rating: 4,
            comment: 'Great features and intuitive interface. It helped us scale from 10 to 100 employees seamlessly.',
          },
        ],
        mode: 'marquee',
      },
      {
        id: generateComponentId(),
        type: 'contact-form',
        fields: [
          { name: 'email', type: 'email', required: true, placeholder: 'Enter your work email' },
        ],
        submitText: 'Get Early Access',
        alignment: 'center',
        style: 'minimal',
      },
    ],
  },
  {
    id: 'restaurant-menu',
    name: 'Bistro & Taste',
    description: 'Elegant template for restaurants, cafes, and food businesses',
    category: 'creative',
    thumbnail: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    preview: {
      primaryColor: '#166534',
      backgroundColor: '#fcfbf7',
      accentColor: '#d4fc79',
    },
    designPalette: {
      primaryColor: '#166534',
      backgroundColor: '#fcfbf7',
      titleColor: '#1c1917',
      descriptionColor: '#57534e',
      fontFamily: 'Playfair Display',
      borderRadius: '0.25rem',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'header',
        content: 'The Bistro Experience',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'text',
        content: 'Experience the finest farm-to-table dining in the heart of the city. Our seasonal menu features locally sourced ingredients prepared with passion.',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'gallery',
        images: [], // User would populate this
        mode: 'marquee',
        columns: 2,
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Our Menu Highlights',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Signature Steaks',
            description: 'Dry-aged for 28 days and grilled to perfection over oak wood.',
          },
          {
            title: 'Fresh Seafood',
            description: 'Daily catches from local fishermen, served with seasonal vegetables.',
          },
          {
            title: 'Artisan Desserts',
            description: 'Handcrafted pastries and desserts to sweeten your evening.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'contact-details',
        variant: 'card',
        email: 'reservations@bistro.com',
        phone: '(555) 012-3456',
        location: '123 Culinary Ave, Food City',
        website: 'www.bistro-taste.com',
        availability: 'Open Daily: 5pm - 11pm',
      },
    ],
  },
  {
    id: 'photography-portfolio',
    name: 'Lens & Light',
    description: 'Minimalist gallery-focused template for photographers',
    category: 'portfolio',
    thumbnail: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    preview: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      accentColor: '#414345',
    },
    designPalette: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      titleColor: '#000000',
      descriptionColor: '#666666',
      fontFamily: 'Inter',
      borderRadius: '0',
    },
    components: [
      {
        id: generateComponentId(),
        type: 'profile',
        name: 'Elena Lens',
        jobTitle: 'Professional Photographer',
        title: 'Capturing Moments in Time',
        summary: 'Specializing in portrait, landscape, and street photography. I believe every image tells a story waiting to be discovered.',
        avatar: '',
      },
      {
        id: generateComponentId(),
        type: 'gallery',
        images: [], // User would populate
        mode: 'grid',
        columns: 3,
      },
      {
        id: generateComponentId(),
        type: 'header',
        content: 'Services',
        alignment: 'center',
      },
      {
        id: generateComponentId(),
        type: 'services',
        services: [
          {
            title: 'Portrait Sessions',
            description: 'Professional headshots and creative portraiture.',
          },
          {
            title: 'Event Coverage',
            description: 'Documenting weddings, corporate events, and celebrations.',
          },
          {
            title: 'Commercial',
            description: 'Product photography and brand campaigns.',
          },
        ],
      },
      {
        id: generateComponentId(),
        type: 'social-media',
        links: [
          { platform: 'Instagram', url: '#' },
          { platform: 'Twitter', url: '#' },
        ],
        alignment: 'center',
        arrangement: 'horizontal',
        displayMode: 'icons-only',
      },
      {
        id: generateComponentId(),
        type: 'contact-form',
        fields: [
          { name: 'name', type: 'text', required: true, placeholder: 'Name' },
          { name: 'email', type: 'email', required: true, placeholder: 'Email' },
          { name: 'details', type: 'textarea', required: true, placeholder: 'Project Details' },
        ],
        submitText: 'Inquire Now',
        alignment: 'center',
        style: 'minimal',
      },
    ],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return allTemplates.filter(t => t.category === category);
}





