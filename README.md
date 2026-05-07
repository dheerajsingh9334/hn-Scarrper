# Hacker News Scraper (MERN Stack)

A full-stack MERN application that scrapes the top 10 stories from Hacker News, displays them in a modern, premium UI, and allows authenticated users to bookmark their favorite stories.

## Features

- **Web Scraper**: Automatically fetches the top 10 stories from Hacker News on server start. Can also be triggered manually via the UI or API.
- **Authentication**: JWT-based user registration and login.
- **Bookmarks**: Authenticated users can bookmark stories.
- **Premium UI**: Designed with a glassmorphism aesthetic, dark mode, smooth micro-animations, and responsive layout.

## Tech Stack

- **Frontend**: React (Vite), React Router, Context API, Vanilla CSS, Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcryptjs, Axios, Cheerio.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017, or update the `MONGO_URI` in `backend/.env`)

## Setup Instructions

### 1. Clone the repository

If you haven't already:
```bash
git clone <repository-url>
cd hn-scraper-mern
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Ensure the `backend/.env` file exists with the following content:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hn_scraper
JWT_SECRET=super_secret_jwt_key_12345
```

Start the backend server:
```bash
npm run dev
```
*(Uses nodemon to run the server on `http://localhost:5000`)*

### 3. Frontend Setup

In a new terminal window:
```bash
cd frontend
npm install
```

Ensure the `frontend/.env` file exists with the following content:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
*(The frontend will typically run on `http://localhost:5173`)*

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current authenticated user

### Stories & Scraper
- `GET /api/stories` - Fetch all scraped stories
- `GET /api/stories/:id` - Fetch a single story
- `POST /api/stories/:id/bookmark` - Toggle bookmark for a story (Protected)
- `POST /api/scrape` - Trigger the Hacker News scraper manually
