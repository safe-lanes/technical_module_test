# Seafarer Technical Management System

## Overview

This project is a full-stack Technical Module for a maritime Planned Maintenance System (PMS). It aims to provide a comprehensive solution for managing technical equipment maintenance, scheduling, and performance tracking for maritime professionals. The system will feature a PMS Dashboard, equipment and task management, reporting, and an administration module.

## User Preferences

Preferred communication style: Simple, everyday language.

## Technical Module Context

The SAIL Technical Module manages three core aspects of cargo ship operations:

1. **Certificate & Surveys Management** - Ship's certification and survey tracking
2. **Defect Reporting** - Equipment, machinery and systems defect management  
3. **Planned Maintenance System (PMS)** - Compliance with classification society requirements (DNV, ABS)

### Module Hierarchy
- **Technical** (Module)
  - **PMS** (Submodule)
    - **Components** (Sub Submodule)
    - **Work Orders** (Sub Submodule) 
    - **Running Hrs** (Sub Submodule)
    - **Spares** (Sub Submodule)
    - **Reports** (Sub Submodule)
    - **Modify PMS** (Sub Submodule)
    - **Admin** (Sub Submodule)

## System Architecture

The application uses a modern full-stack architecture with a React frontend (TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Wouter) and an Express.js backend (TypeScript). It integrates with PostgreSQL via Drizzle ORM for database operations, with an in-memory storage fallback for development. The UI/UX prioritizes a consistent design system through shadcn/ui and Tailwind CSS, following a mobile-first responsive design approach. Core features include a Technical Dashboard, Equipment Management, Maintenance Scheduling, Task Management, Reporting, and an Admin Module. The Admin Module supports dynamic configuration of forms, including configurable rank groups and field visibility, using a standard `FormPopup` component for consistent modal presentation.

## External Dependencies

- **Frontend**:
    - `@radix-ui/*`
    - `@tanstack/react-query`
    - `wouter`
    - `tailwindcss`
    - `lucide-react`
- **Backend**:
    - `express`
    - `drizzle-orm`
    - `@neondatabase/serverless`
    - `connect-pg-simple`
- **Development**:
    - `vite`
    - `typescript`
    - `drizzle-kit`