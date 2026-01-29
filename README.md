# 📋 Pastebin-Lite

A simple Pastebin-like application that allows users to create text pastes and share a link to view them.  
Pastes can optionally expire after a time limit (TTL) or after a maximum number of views.
The application is built with a Node.js + Express.js backend and a React.js frontend.

## ✨ Features

- 📝 Create text pastes with optional expiration and view limits
- ⏰ **TTL Support**: Pastes auto-expire after specified duration
- 👁️ **View Limits**: Control maximum number of views
- 💾 **Redis Persistence**: Uses Upstash Redis for serverless deployment

---

## Running the App Locally

### Prerequisites

- Node.js (v18 or later)
- A Redis instance (Upstash Redis recommended)

---

### Clone the Repository

```bash
git clone https://github.com/mrDeepakk/Pastebin-Lite.git
cd Pastebin-Lite
```
### Create a `.env` file inside the `backend` directory
```bash
REDIS_URL=your_redis_connection_url
PORT=3001
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
TEST_MODE=0
```
### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend runs at: http://localhost:3001

### Create a `.env` file inside the `frontend` directory
```bash
VITE_API_BASE_URL=http://localhost:3001
```
### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs at: http://localhost:5173