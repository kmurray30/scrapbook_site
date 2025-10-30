# 📖 Scrapbook - Social Recommendation Sharing Platform

A beautiful web app where friends can share their favorite experiences - restaurants, movies, books, songs, and more!

## Features

- 🎯 **Easy Posting**: Share recommendations with a 20-word limit for quick, focused reviews
- 🗺️ **Restaurant Integration**: Automatic Google Maps links for restaurant recommendations
- 👥 **Friend Discovery**: Browse friends' boards and follow your favorites
- 📱 **Device-Based Accounts**: Start instantly - your account is tied to your device
- 🔐 **Google OAuth Ready**: Upgrade to a permanent account anytime
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Express.js (Node.js)
- **Database**: SQLite (local development) / PostgreSQL (production)
- **Authentication**: Device UUID + Google OAuth

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

1. **Install dependencies**

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

2. **Set up environment variables** (optional for local development)

The app will work locally without any configuration. For production or if you want Google Maps integration:

- Create a `.env` file in the root directory
- Add your Google Maps API key: `GOOGLE_MAPS_API_KEY=your_key_here`

### Running Locally

**Option 1: Run both frontend and backend together**

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5001
- React frontend on http://localhost:3000

**Option 2: Run separately**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### First Time Setup

1. Open http://localhost:3000 in your browser
2. Enter your name to create an account (automatically tied to your device)
3. Start posting your favorite things!
4. Open the same URL on other devices or share with friends to see multiple users

## Project Structure

```
scrapbook_site/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components (PostCard, PostForm, etc.)
│   │   ├── pages/            # Main pages (YourBoard, FriendsGallery, UserBoard)
│   │   ├── services/         # API communication layer
│   │   └── App.js            # Main app component with routing
│   └── public/
├── server/                    # Express backend
│   ├── db/                   # Database setup and initialization
│   ├── routes/               # API endpoints (users, posts, follows)
│   ├── middleware/           # Authentication middleware
│   └── server.js             # Express app configuration
└── scrapbook.db              # SQLite database (auto-created)
```

## API Endpoints

### Users
- `POST /api/users/init` - Create/get user by device ID
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users

### Posts
- `GET /api/posts?userId=:id` - Get posts (all or by user)
- `POST /api/posts` - Create new post
- `GET /api/posts/user/:userId` - Get posts for specific user

### Follows
- `GET /api/follows/following` - Get users current user follows
- `GET /api/follows/status/:userId` - Check if following a user
- `POST /api/follows` - Follow a user
- `DELETE /api/follows/:userId` - Unfollow a user

## Deployment

### Quick Deploy to Render

1. **Prepare for deployment**

```bash
npm run build
```

2. **Create a new Web Service on Render.com**

- Connect your GitHub repository
- Environment: Node
- Build Command: `npm install && cd client && npm install && npm run build && cd ..`
- Start Command: `npm start`

3. **Set Environment Variables**

```
NODE_ENV=production
PORT=5000
```

4. **For production database**, add PostgreSQL:
   - Add PostgreSQL addon in Render
   - Update `server/db/database.js` to use PostgreSQL in production

### Deploy to Vercel (Alternative)

Frontend only (requires separate backend deployment):

```bash
cd client
npm run build
vercel --prod
```

### Environment Variables for Production

- `NODE_ENV=production`
- `PORT=5000` (or your preferred port)
- `GOOGLE_MAPS_API_KEY=your_key` (optional but recommended)
- `GOOGLE_CLIENT_ID=your_client_id` (for OAuth - future feature)

## Usage Guide

### For Users

1. **Creating Posts**
   - Click "New Post" button
   - Select category (Restaurant, Movie, Book, Song, Other)
   - Add title and description (max 20 words)
   - For restaurants, add location for automatic Google Maps integration
   - Click "Create Post"

2. **Discovering Friends**
   - Go to "Friends" page
   - Browse all users on the platform
   - Click "Follow" to mark favorites (they'll appear at the top)
   - Click any user card to see their full board

3. **Following Friends**
   - Following a user highlights their card
   - Followed users always appear at the top of your Friends gallery
   - Makes it easy to keep track of your close friends' recommendations

## Future Enhancements

- ✅ Google OAuth for permanent accounts
- ✅ Enhanced Google Maps embed with interactive maps
- 📸 Image uploads for posts
- 🔍 Search and filter functionality
- 📊 Activity feed showing recent posts from followed friends
- 💬 Comments and reactions on posts
- 🏷️ Tags and collections
- 📤 Share individual posts via link

## Development

### Adding New Post Categories

Edit `client/src/components/PostCard.js` and `client/src/components/PostForm.js`:

```javascript
const categories = ['Restaurant', 'Movie', 'Book', 'Song', 'YourNewCategory'];
const categoryIcons = {
  YourNewCategory: '🎯'
};
```

### Database Schema

**users**
- id, displayName, deviceId, googleId, profilePic, createdAt

**posts**
- id, userId, title, content, category, location, createdAt

**follows**
- id, followerId, followedId, createdAt

## Troubleshooting

**"Device ID required" error**
- Clear browser localStorage and refresh
- This creates a new device ID

**Can't see other users**
- Open the site in a different browser or incognito window
- Each browser/device gets its own account

**Posts not showing**
- Check browser console for errors
- Ensure backend is running on port 5000

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ for sharing great experiences with friends

