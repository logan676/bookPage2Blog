# BookPage2Blog

Transform book pages into blog posts with AI-powered OCR and intelligent content analysis. Upload images of book pages, extract text using Google Gemini AI, and convert them into beautifully formatted blog posts with interactive note-taking capabilities.

## Features

- **AI-Powered OCR**: Extract text from book page images using Google Gemini AI
- **Smart Content Analysis**: Automatically analyze and structure extracted content into blog posts
- **Interactive Reading**: Hover over paragraphs to add notes and highlights
- **Idea Management**: Organize your thoughts with an integrated sidebar for quotes and notes
- **Post Gallery**: Browse and manage your converted blog posts in grid or list view
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - Latest React with improved performance and features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **React Router v7** - Client-side routing
- **Lucide React** - Beautiful, consistent icons
- **Google Gemini AI** - Advanced OCR and content analysis

### Backend
- **Django 5.0** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Python** - Backend programming language
- **Google Cloud Vision / Gemini AI** - OCR for text extraction from images
- **django-cors-headers** - Cross-Origin Resource Sharing support
- **PostgreSQL** - Production database (SQLite for development)
- **AWS S3 + boto3** - Cloud storage for images (optional)
- **django-storages** - Cloud storage integration

Repository: [bookPage2Blog-backend](https://github.com/logan676/bookPage2Blog-backend)

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Google Gemini API Key** - Get yours at [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookPage2Blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local` or create it if it doesn't exist
   - Add your Google Gemini API key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
bookPage2Blog/
├── components/           # React components
│   ├── AddIdeaModal.tsx     # Modal for adding notes/ideas
│   ├── BlogContent.tsx      # Main blog content display
│   ├── CreatePostModal.tsx  # Post creation modal
│   ├── FileUpload.tsx       # File upload interface
│   ├── Header.tsx           # App header with theme toggle
│   ├── IdeaSidebar.tsx      # Sidebar for managing ideas
│   ├── PostCard.tsx         # Post preview card
│   └── PostEditor.tsx       # Post editing interface
├── services/             # Business logic and API services
│   └── geminiService.ts     # Google Gemini AI integration
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
├── constants.ts         # App constants and mock data
├── utils.ts             # Utility functions
├── index.tsx            # Application entry point
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## How It Works

1. **Upload**: Upload an image of a book page through the file upload interface
2. **Process**: Google Gemini AI extracts text from the image using OCR
3. **Analyze**: AI analyzes the content and structures it into blog-ready format
4. **Edit**: Review and edit the generated blog post with the integrated editor
5. **Annotate**: Add notes and highlights to specific paragraphs
6. **Publish**: Save your posts to the gallery for future reference

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Dependencies

- `react` (^19.2.0) - UI framework
- `react-router` (^7.1.1) - Routing
- `@google/genai` (^1.30.0) - Google Gemini AI SDK
- `lucide-react` (^0.554.0) - Icon library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Related Repositories

- Backend API: [https://github.com/logan676/bookPage2Blog-backend](https://github.com/logan676/bookPage2Blog-backend)
