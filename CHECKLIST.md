# ✅ Scrapbook Site Checklist

Use this checklist to go from code to deployed site.

## Local Development

### Setup (One Time)
- [x] Install Node.js
- [x] Project files created
- [x] Backend dependencies installed (`npm install`)
- [x] Frontend dependencies installed (`cd client && npm install`)

### Testing Locally
- [ ] Start the development servers (`npm run dev`)
- [ ] Open http://localhost:3000 in browser
- [ ] Create your first user account
- [ ] Create a test post in each category
- [ ] Test restaurant post with location (check Maps link)
- [ ] Open in another browser/incognito to create second user
- [ ] Test following/unfollowing users
- [ ] Click on a friend card to view their board
- [ ] Test on mobile device (or responsive mode in browser)

## Optional Enhancements (Before Deployment)

### Google Maps (Optional but Recommended)
- [ ] Get Google Maps API key from https://console.cloud.google.com/
- [ ] Add to `.env` file: `GOOGLE_MAPS_API_KEY=your_key`
- [ ] Update PostCard.js to use embedded maps instead of links

### Google OAuth (Optional - Future Feature)
- [ ] Get Google OAuth Client ID
- [ ] Add to `.env` file: `GOOGLE_CLIENT_ID=your_id`
- [ ] Implement OAuth flow in frontend

## Deployment Preparation

### Choose Your Hosting
- [ ] Option A: Render (easiest, recommended)
- [ ] Option B: Railway (good free tier)
- [ ] Option C: Vercel + separate backend

### Pre-Deployment
- [ ] Test everything works locally one more time
- [ ] Push code to GitHub
  ```bash
  git add .
  git commit -m "Initial Scrapbook site"
  git push origin main
  ```
- [ ] Read DEPLOYMENT.md fully

### On Render (Recommended Path)

#### Database Setup
- [ ] Create PostgreSQL database on Render (for data persistence)
  - Click "New +" → "PostgreSQL"
  - Name it "scrapbook-db"
  - Copy the internal database URL
- [ ] Update `server/db/database.js` to use PostgreSQL
  - Install `pg` package: `npm install pg`
  - Switch from sqlite3 to pg
- [ ] Test database connection

#### Web Service Setup
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build Command: `npm install && cd client && npm install && npm run build && cd ..`
  - Start Command: `npm start`
- [ ] Add environment variables:
  - `NODE_ENV=production`
  - `DATABASE_URL` (auto-set if you linked the database)
  - `GOOGLE_MAPS_API_KEY` (if you have one)
- [ ] Deploy and wait for build

#### Post-Deployment Testing
- [ ] Visit your Render URL
- [ ] Create a test account
- [ ] Create a post
- [ ] Test all features:
  - [ ] Creating posts in all categories
  - [ ] Restaurant with Maps link
  - [ ] Following users
  - [ ] Viewing other user boards
  - [ ] Mobile responsiveness

## Sharing with Friends

### Before Sharing
- [ ] Create a few sample posts yourself
- [ ] Test on your phone
- [ ] Make sure everything looks good
- [ ] Write down the URL

### Sharing
- [ ] Send URL to friends via text/email
- [ ] Explain briefly: "Share your favorite restaurants, movies, books, etc!"
- [ ] Tell them accounts are automatic (no sign-up)
- [ ] Encourage them to post their favorites

## Maintenance

### Regular Checks
- [ ] Check Render dashboard for errors
- [ ] Monitor database size
- [ ] Review server logs if issues arise

### As You Get Users
- [ ] Monitor disk space
- [ ] Consider upgrading hosting if needed
- [ ] Backup database periodically

## Future Features (When You're Ready)

### Quick Wins
- [ ] Add more categories
- [ ] Customize color scheme
- [ ] Add site description/instructions

### Medium Effort
- [ ] Image uploads for posts
- [ ] Profile pictures
- [ ] Search functionality
- [ ] Filter by category

### Advanced
- [ ] Activity feed from followed users
- [ ] Email notifications
- [ ] Comments on posts
- [ ] Collections/lists
- [ ] Advanced privacy controls

## Troubleshooting

### "Site won't load locally"
- [ ] Check both servers are running
- [ ] Check ports 3000 and 5000 aren't used by other apps
- [ ] Check browser console for errors

### "Can't create posts"
- [ ] Check device ID in localStorage
- [ ] Check browser console for API errors
- [ ] Check backend logs

### "Lost my account"
- [ ] Check if browser storage was cleared
- [ ] Check if using incognito (doesn't persist)
- [ ] This is expected behavior in development

### "Deployed site not working"
- [ ] Check Render logs for errors
- [ ] Verify environment variables are set
- [ ] Test database connection
- [ ] Check build completed successfully

## Success Metrics

You'll know it's working when:
- ✅ Friends can access your URL
- ✅ Multiple people can create accounts
- ✅ Everyone can see each other's posts
- ✅ Following/unfollowing works
- ✅ Maps links work for restaurants
- ✅ Works on mobile phones

## Resources

- **Documentation**: README.md (detailed)
- **Quick Start**: START.md (get running fast)
- **Deployment**: DEPLOYMENT.md (step-by-step)
- **Summary**: SUMMARY.md (what was built)

---

**Good luck! You've got everything you need. 🚀**

