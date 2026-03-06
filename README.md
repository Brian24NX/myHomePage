# Brian's Personal Website

A full-stack personal portfolio website with a React frontend and Spring Boot backend.

## Tech Stack

**Frontend**
- React 19 + Vite 7
- React Router for client-side routing
- Framer Motion for animations
- Recharts for GitHub analytics visualizations
- react-markdown for blog content rendering

**Backend**
- Java 17 + Spring Boot 3.4
- Spring Security with JWT authentication
- Spring Data MongoDB
- Spring Mail for contact form emails

## Project Structure

```
├── frontend/          # React SPA
│   └── src/
│       ├── components/  # Hero, About, Experience, Projects, Resume, Contact, etc.
│       ├── pages/       # Blog, BlogPost, Admin, Login, NotFound
│       └── api/         # API client
└── backend/
    └── api/           # Spring Boot REST API
        └── src/main/java/com/brian/website/
            ├── controller/  # Auth, Blog, Contact, GitHub, CV, Admin
            ├── service/     # Blog, Contact, GitHub
            ├── model/       # BlogPost, ContactMessage
            ├── security/    # JWT auth filter & utility
            └── config/      # CORS, Security, Mail
```

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven
- MongoDB

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

### Backend

```bash
cd backend/api
mvn spring-boot:run
```

Runs on `http://localhost:8080`.

### Docker (Backend)

```bash
cd backend/api
docker build -t brian-website-api .
docker run -p 8080:8080 brian-website-api
```

## Features

- Animated hero section and scroll progress indicator
- About, Experience timeline, and Resume sections
- GitHub analytics dashboard with contribution charts
- Project showcase
- Blog with markdown support and admin panel
- Contact form with email notifications
- Dark/light mode toggle
- SEO with react-helmet-async
- Skeleton loaders and lazy-loaded routes
- 404 page
- Accessibility (skip-to-content link)
