# Kenneth Kebbie Kamara - Portfolio Website

A modern, responsive portfolio website built with Next.js, React, and TypeScript. Features a comprehensive admin dashboard for easy content management.

## Features

### Public Portfolio
- **Hero Section**: Eye-catching introduction with profile picture and call-to-action
- **About Section**: Personal information and contact details
- **Skills Section**: Organized skills by category with proficiency levels
- **Projects Section**: Filterable project showcase with images and links
- **Experience Section**: Work history and education timeline
- **Contact Section**: Contact form and information
- **Dark/Light Mode**: Theme toggle for user preference
- **Responsive Design**: Optimized for all device sizes

### Admin Dashboard
- **Secure Login**: Password-protected admin access
- **Personal Info Editor**: Update profile, bio, and contact information
- **Skills Manager**: Add, edit, and remove skills with categories
- **Projects Manager**: Full CRUD operations for portfolio projects
- **Experience Editor**: Manage work experience and education
- **File Upload**: Upload images for profile and projects
- **CV Upload**: Upload and manage resume/CV files
- **Real-time Preview**: Changes reflect immediately on the portfolio

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Data Storage**: localStorage (ready for database integration)
- **Theme**: next-themes for dark/light mode

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

1. Navigate to `/admin`
2. Enter the admin password (default: `admin123`)
3. Manage your portfolio content from the dashboard

**Important**: Change the default password in `lib/auth-context.tsx` before deploying to production.

## Project Structure

\`\`\`
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main portfolio page
│   └── globals.css         # Global styles and theme
├── components/
│   ├── admin/              # Admin dashboard components
│   ├── ui/                 # shadcn/ui components
│   ├── navigation.tsx      # Main navigation
│   ├── hero-section.tsx    # Hero section
│   ├── about-section.tsx   # About section
│   ├── skills-section.tsx  # Skills section
│   ├── projects-section.tsx # Projects section
│   ├── experience-section.tsx # Experience section
│   ├── contact-section.tsx # Contact section
│   └── footer.tsx          # Footer
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── mock-data.ts        # Initial portfolio data
│   ├── portfolio-context.tsx # Portfolio state management
│   ├── auth-context.tsx    # Authentication context
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
\`\`\`

## Customization

### Update Portfolio Content

1. **Via Admin Dashboard** (Recommended):
   - Login at `/admin`
   - Use the intuitive editors to update content
   - Changes are saved to localStorage

2. **Via Code**:
   - Edit `lib/mock-data.ts` to change initial data
   - Modify component files for layout changes
   - Update `app/globals.css` for theme customization

### Add Database Integration

The project is structured to easily integrate with a database:

1. Choose your database (Supabase, Neon, PostgreSQL, etc.)
2. Update `lib/portfolio-context.tsx` to fetch/save from database
3. Add API routes in `app/api/` for CRUD operations
4. Update authentication to use proper backend auth

### Deploy to Production

1. **Change Admin Password**:
   - Update `ADMIN_PASSWORD` in `lib/auth-context.tsx`
   - Or use environment variables

2. **Deploy to Vercel**:
   \`\`\`bash
   vercel deploy
   \`\`\`

3. **Configure Environment Variables** (if using database):
   - Add database credentials
   - Add authentication secrets
   - Configure file upload service

## Features to Add

- [ ] Database integration (Supabase/Neon)
- [ ] Email functionality for contact form
- [ ] Blog section with CMS
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Social media feed integration
- [ ] Testimonials section
- [ ] Multi-language support

## License

MIT License - feel free to use this template for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub or contact the developer.
