description: A comprehensive management system for tracking cattle, events, and reminders with a modern React frontend and FastAPI backend.

# Cow Manager

Cow Manager is a specialized application designed to help farmers and cattle managers efficiently track their livestock. It provides a streamlined interface for managing cow data, recording significant events, and staying on top of scheduled tasks through a calendar and reminder system.

## Key Features

- **🐄 Cow Management**: Easily maintain a digital record of your cattle. Add new cows, view detailed profiles, and manage the herd list.
- **📅 Event Tracking & Timeline**: Record and track life events for each cow (e.g., breeding, health checks). View a historical timeline of events for individual animals.
- **🗓️ Calendar View**: A centralized calendar to visualize all past and upcoming events across the entire herd.
- **🔔 Upcoming Reminders**: Never miss an important task with a dedicated view for upcoming reminders and scheduled events.
- **⚙️ Configurable Settings**: Customize the application behavior, including event definitions and language preferences (i18n).
- **🚀 Modern Tech Stack**: Built with high-performance tools for a responsive and reliable experience.

## Technical Architecture

### Frontend
- **Framework**: React (v19) with Vite for fast development and builds.
- **Styling**: Tailwind CSS for a modern, responsive UI.
- **Routing**: React Router for seamless navigation.
- **Icons**: Lucide React for consistent and beautiful iconography.
- **Internationalization**: i18next for multi-language support.

### Backend
- **Framework**: FastAPI (Python) providing a robust and documented REST API.
- **Database**: SQLite for lightweight and efficient data storage, managed via SQLAlchemy ORM.
- **API Documentation**: Automatic Swagger/OpenAPI documentation provided by FastAPI.

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Start the server: `python app/main.py`.

### Frontend Setup
1. From the root directory, install dependencies: `pnpm install` (or `npm install`).
2. Start the development server: `pnpm dev` (or `npm run dev`).
3. Access the application at the URL provided by Vite (usually `http://localhost:5173`).
