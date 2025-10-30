# 🚀 Quick Start Guide

Welcome! This guide will help you get your Scrapbook site running in just a few minutes.

## What You Just Built

You've created a social recommendation platform where you and your friends can:
- Share favorite restaurants, movies, books, songs, and more
- Follow friends to see what they recommend
- Get Google Maps links for restaurants
- Start using it immediately (no sign-up needed!)

## Running the Application

You have two options:

### Option 1: Run Everything Together (Easiest)

Open your terminal in this folder and run:

```bash
npm run dev
```

This starts both the backend (server) and frontend (website) at the same time.

- **Backend** will run on: http://localhost:5001
- **Frontend** will open automatically at: http://localhost:3000

### Option 2: Run Them Separately

If you prefer more control, open TWO terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## First Time Using It

1. Open http://localhost:3000 in your web browser
2. You'll see a welcome screen asking for your name
3. Enter your name and click "Get Started"
4. Start posting your favorite things!

## Testing with Multiple Users

To see how it works with multiple people:

1. Open the site in a different browser (like Chrome, Safari, Firefox)
2. Or use Incognito/Private mode
3. Each browser will get its own account automatically
4. You'll see other users in the "Friends" tab

## Creating Your First Post

1. Click the "New Post" button
2. Select a category (Restaurant, Movie, Book, Song, or Other)
3. Add a title and description (20 words max - keep it snappy!)
4. For restaurants, add the location to get a Google Maps link
5. Click "Create Post"

## Common Issues

**"Cannot connect to server"**
- Make sure the backend is running (`npm run server`)
- Note: We use port 5001 because macOS AirPlay uses port 5000

**"Page won't load"**
- Make sure the frontend is running (`npm run client`)
- Try visiting http://localhost:3000 directly

**"Lost my account"**
- Your account is tied to your browser
- Clearing browser data will reset it
- This is normal for local development!

## What's Next?

Once you've tested it locally and you're happy with it:

1. Check out `DEPLOYMENT.md` for instructions on deploying to the internet
2. Your friends will be able to access it from anywhere!
3. Consider upgrading the database to PostgreSQL for permanent storage

## Features You Can Try

- ✅ Create posts in different categories
- ✅ Follow and unfollow friends
- ✅ Click on friend cards to see their boards
- ✅ Add restaurants with locations for Google Maps links
- ✅ See your posts sorted by date

## Need Help?

- Check `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for deployment instructions
- Look at the code - it's well-organized and commented!

---

**Enjoy building your social scrapbook! 📖✨**

