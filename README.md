# AskURL 🌐

An AI-powered web scraping service that extracts specific information from websites based on user questions.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Backend**: Express.js, Node.js
- **Queue System**: BullMQ with Redis
- **Database**: PostgreSQL with Drizzle ORM
- **Web Scraping**: Cheerio
- **AI Processing**: Google Gemini API
- **Validation**: Zod
- **HTTP Client**: Axios


## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│  Express API    │────▶│   BullMQ Queue  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  PostgreSQL     │     │  Redis Worker   │
                        │  (Drizzle ORM)  │     │  (Scraper + AI) │
                        └─────────────────┘     └─────────────────┘
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 2. Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

#### Backend `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://username:password@host:port
GEMINI_API_KEY=your_google_gemini_api_key
```

#### Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Database Setup

```bash
cd backend
npm run drizzle:generate  # Generate migrations
npm run drizzle:push      # Apply migrations
```

### 4. Start Development Servers

```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm run dev

# Worker (Terminal 3) - Optional, for processing jobs
cd backend && npm run worker
```

## 🔄 How It Works

1. **User submits task**: Sends URL and question to `/api/tasks`
2. **Task validation**: Zod validates input data
3. **Database storage**: Task saved with "PENDING" status
4. **Queue processing**: BullMQ adds scraping job to queue
5. **Worker execution**: 
   - Scrapes website content using Cheerio
   - Processes content with Google Gemini AI
   - Updates task with answer and "COMPLETED" status
6. **Result retrieval**: User polls `/api/tasks/:id` for results

## 🎨 Frontend Components

**Current Implementation** (Basic Next.js App Router):
- `app/page.js` - Home page with basic HTML form (no React hooks/state)
- `app/tasks/[id]/page.js` - Task status page with simple data fetching
- `src/lib/hooks/useTask.js` - Basic data fetching utility 


## 📡 API Endpoints

### Create Task
**POST** `/api/tasks`

**Request:**
```json
{
  "url": "https://example.com",
  "question": "What is the main product described on this page?"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com",
  "question": "What is the main product described on this page?",
  "status": "PENDING"
}
```

### Get Task Status
**GET** `/api/tasks/:id`

**Response (Completed):**
```json
{
  "id": 1,
  "url": "https://example.com",
  "question": "What is the main product described on this page?",
  "status": "COMPLETED",
  "answer": "The main product is a cloud-based project management tool...",
  "scrapedContent": "Full scraped HTML content...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:01:00Z"
}
```

**Response (Pending):**
```json
{
  "id": 1,
  "url": "https://example.com",
  "question": "What is the main product described on this page?",
  "status": "PENDING"
}
```

## ⚠️ Known Limitations

- **JavaScript-only scraping**: Uses Cheerio for static content only
- **No dynamic content**: Cannot scrape JavaScript-rendered content
- **Rate limiting**: No built-in rate limiting for external requests
- **Error handling**: Basic error handling, some sites may fail unexpectedly
- **Content size**: Large pages may exceed AI model token limits
- **Frontend dependencies**: React and Tailwind CSS are installed but not currently used in the UI

## 🔮 Future Improvements

- **Playwright Integration**: Add support for JavaScript-rendered content
- **Authentication**: Support for scraping protected content
- **Better UI**: Real-time updates, progress indicators
- **Rate Limiting**: Implement intelligent rate limiting
- **Caching**: Cache results to avoid re-scraping
- **Batch Processing**: Support for multiple URLs at once
- **Export Options**: PDF, CSV, JSON export functionality
- **User Management**: Multi-user support with authentication

## 🧪 Development

```bash
# Run backend tests
cd backend && npm test

# Build frontend for production
cd frontend && npm run build

# Start production servers
cd backend && npm start
cd frontend && npm start
```

## 📄 License

ISC License - see LICENSE file for details.

---

**AskURL** - Making web scraping intelligent and accessible 🚀