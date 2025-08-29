# Replit.md - Coding Guru Platform

## Overview

Coding Guru is a comprehensive full-stack web application that enables users to create, design, and deploy websites using AI-powered tools. The platform features a visual drag-and-drop interface, code generation capabilities, backend API builder, and integrated deployment options. Built with a modern React frontend and Express.js backend, it provides an end-to-end solution for web development with minimal coding required.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Comprehensive set of Radix UI primitives wrapped in shadcn/ui components
- **Design System**: Custom design tokens with CSS variables for theming support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with organized route handling
- **Middleware**: Session management, authentication, request logging, and error handling
- **Development**: Hot reload with tsx for TypeScript execution

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Centralized schema in shared directory for frontend/backend consistency
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Data Models**: Users, projects, API endpoints with proper foreign key relationships

### Authentication and Authorization
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL persistence
- **Security**: HTTP-only cookies, CSRF protection, secure session configuration
- **User Management**: Automatic user creation/updates on authentication
- **Route Protection**: Middleware-based authentication checks for protected endpoints

### External Dependencies
- **Database Hosting**: Neon PostgreSQL serverless database
- **Authentication**: Replit OpenID Connect service
- **AI Integration**: Google Generative AI (@google/genai) for code generation
- **UI Framework**: Radix UI primitives for accessible components
- **Development Tools**: Vite with React plugin, TypeScript compiler, Tailwind CSS
- **Session Storage**: PostgreSQL-based session management
- **Deployment**: Configurable deployment options (Vercel, Netlify, etc.)
- **Code Generation**: AI-powered component and backend API generation
- **Version Control**: Git-based workflow assumed for project management