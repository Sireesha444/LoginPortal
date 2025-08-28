# Oppliv - Student-Company Matching Platform

## Overview

Oppliv is a web application designed to connect students with companies, facilitating networking and career opportunities. The platform provides separate authentication systems for students and companies, with a modern React frontend and an Express.js backend. The application uses a full-stack TypeScript architecture with PostgreSQL as the primary database, implementing secure authentication through both custom login systems and Replit's OAuth integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and API interactions
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

The frontend follows a component-based architecture with separate pages for landing, authentication, and dashboard views. The routing system conditionally renders pages based on authentication state, providing different experiences for authenticated and unauthenticated users.

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Authentication**: Dual authentication system supporting both custom login (students/companies) and Replit OAuth integration
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful endpoints with consistent error handling and request logging middleware

The backend implements a layered architecture with separate concerns for routing, authentication, data access, and business logic. The storage layer abstracts database operations through an interface pattern, making the system extensible for different storage implementations.

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema-first approach for type safety
- **Schema Structure**: 
  - Users table for basic user information (required for Replit Auth)
  - Students table for student-specific data with email/password authentication
  - Companies table for company-specific data with company codes and email/password authentication
  - Sessions table for session storage (required for Replit Auth)
- **Migration Strategy**: Drizzle Kit for schema migrations with version control

### Authentication & Authorization
- **Multi-Modal Authentication**: Supports both Replit OAuth and custom email/password authentication
- **User Types**: Differentiated user types (student/company) with role-based access
- **Session Security**: HTTP-only cookies with secure flags and configurable expiration
- **Password Security**: bcrypt hashing for password storage
- **OAuth Integration**: OpenID Connect integration with Replit's identity provider

The authentication system accommodates multiple user flows - Replit users can authenticate via OAuth, while students and companies can register and login with traditional email/password credentials.

### Development & Build Tools
- **Build System**: Vite for frontend bundling with hot module replacement
- **TypeScript Configuration**: Shared TypeScript config across client, server, and shared modules
- **Path Aliases**: Configured path mapping for cleaner imports across frontend components
- **Development Server**: Vite development server with Express backend integration
- **Production Build**: Optimized production builds with ESBuild for server bundling

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Authentication Provider**: Replit OAuth/OpenID Connect for seamless Replit integration
- **Session Store**: PostgreSQL-backed session storage for scalable session management

### UI & Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Consistent icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### Development & Utilities
- **Form Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack Query for server state caching and synchronization
- **Build Tools**: PostCSS with Autoprefixer for CSS processing

### Runtime & Server
- **Database Driver**: @neondatabase/serverless for optimized PostgreSQL connections
- **Session Management**: express-session with connect-pg-simple for PostgreSQL storage
- **Security**: bcrypt for password hashing and authentication security
- **Development**: tsx for TypeScript execution and hot reloading during development

The application is designed to run seamlessly on Replit's infrastructure while maintaining compatibility with standard Node.js deployment environments.