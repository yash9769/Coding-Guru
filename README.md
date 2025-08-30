# AIBuilder 🤖✨

**AI-Powered Web Application Builder with Visual Drag-and-Drop Interface**

Transform your ideas into fully functional web applications using the power of artificial intelligence. AIBuilder provides an intuitive drag-and-drop interface combined with AI-powered code generation to create professional websites and interactive workflows.

![AIBuilder Dashboard](https://img.shields.io/badge/Build-AI%20Powered-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20TypeScript-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

## 🌟 Features

### 🎨 Visual Drag-and-Drop Interface
- **Component Palette**: 40+ pre-built components across 7 categories
- **Interactive Canvas**: Drag components, connect them with visual flows
- **Responsive Preview**: Test your designs on desktop, tablet, and mobile
- **Real-time Editing**: Instant visual feedback as you build

### 🤖 AI-Powered Code Generation
- **Webapp Mode**: Generate complete, interactive web applications
- **Flow Mode**: Create workflow diagrams and process flows
- **Smart Prompts**: Natural language to functional code
- **Live Preview**: Instantly preview generated websites in browser

### 🚀 One-Click Deployment
- **Multiple Providers**: Vercel, Netlify, AWS Amplify integration
- **Custom Domains**: Deploy with your own domain
- **Environment Management**: Production, preview, and development builds

### 💻 Modern Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use NeonDB serverless)
- Google Gemini API key (optional - includes mock responses)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aibuilder.git
cd aibuilder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
REPLIT_DOMAINS=localhost:5000
NODE_ENV=development
```

4. **Initialize the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5000`

## 📖 Usage Guide

### Creating Your First Webapp

1. **Start with AI Builder**
   - Click "Build with AI" in the dashboard
   - Choose "Build Full WebApp with AI"

2. **Describe Your Vision**
   - Enter a prompt like: "Create a modern portfolio website with project showcase and contact form"
   - Click "Build with AI"

3. **Preview Your Creation**
   - AI generates a complete, interactive website
   - Automatic preview opens in new tab
   - Customize using the drag-and-drop editor

### Using the Visual Editor

1. **Drag & Drop Components**
   - Browse the component palette (Layout, Content, Interactive, etc.)
   - Click components to add them to your canvas
   - Connect components using the visual handles

2. **Customize Properties**
   - Select any component to edit its properties
   - Adjust colors, text, layout, and behavior
   - Preview changes in real-time

3. **Export & Deploy**
   - Generate production-ready code
   - Deploy to Vercel, Netlify, or AWS
   - Download source code for self-hosting

## 🏗️ Architecture

```
AIBuilder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and helpers
├── server/                 # Express backend
│   ├── db.ts              # Database connection
│   ├── gemini.ts          # AI integration
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Data persistence
├── shared/                 # Shared types and schemas
└── README.md              # This file
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open database studio
```

### Component Categories

- **Layout**: Headers, footers, navigation, containers
- **Content**: Text blocks, images, videos, galleries
- **Interactive**: Buttons, forms, modals, tabs
- **E-commerce**: Product cards, shopping carts, pricing
- **Social**: Social media integration, comments, sharing
- **Data**: Charts, statistics, progress indicators
- **Utility**: Calendars, maps, contact info, timers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Reference

### Authentication
```http
GET /api/auth/user          # Get current user
POST /api/login             # Login user
POST /api/logout            # Logout user
```

### Projects
```http
GET /api/projects           # List user projects
POST /api/projects          # Create new project
GET /api/projects/:id       # Get project details
PUT /api/projects/:id       # Update project
DELETE /api/projects/:id    # Delete project
```

### AI Generation
```http
POST /api/ai/build-from-prompt     # Generate webapp from prompt
POST /api/ai/generate-component    # Generate React component
POST /api/ai/generate-backend      # Generate backend code
```

### Preview & Deployment
```http
GET /api/preview/:projectId        # Preview generated webapp
POST /api/deploy                   # Deploy to hosting provider
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No* |
| `REPLIT_DOMAINS` | Allowed domains for CORS | No |
| `NODE_ENV` | Environment (development/production) | No |

*Mock responses are provided when API key is not configured

### Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables:
- `users` - User authentication and profiles
- `projects` - User projects and their configurations
- `deployments` - Deployment history and status

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```bash
docker build -t aibuilder .
docker run -p 5000:5000 aibuilder
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings

**AI Generation Not Working**
- Verify GEMINI_API_KEY is set correctly
- Check API quota and billing
- Mock responses available as fallback

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)
- Verify all environment variables are set

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Google Gemini](https://ai.google.dev/) - AI integration
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

## 📧 Support

- 📧 Email: support@aibuilder.dev
- 💬 Discord: [Join our community](https://discord.gg/aibuilder)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/aibuilder/issues)
- 📖 Docs: [Documentation](https://docs.aibuilder.dev)

---

**Built with ❤️ by the AIBuilder team**

*Transform your ideas into reality with the power of AI*