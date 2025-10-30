# Deployment Guide

This guide will help you deploy your Scrapbook site to the internet so your friends can access it from anywhere.

## Option 1: Render (Recommended - Easiest)

Render is completely free for hobby projects and perfect for this app.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a Render account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `scrapbook-site`
   - Environment: `Node`
   - Build Command: `npm install && cd client && npm install && npm run build && cd ..`
   - Start Command: `npm start`
   - Click "Create Web Service"

4. **Your site is live!**
   - Render will give you a URL like `https://scrapbook-site.onrender.com`
   - Share this URL with your friends!

### Important Notes:
- Free tier: Your app will sleep after 15 minutes of inactivity
- First load after sleeping takes ~30 seconds
- Database (SQLite) is ephemeral - data resets on deploys (see upgrade below)

### Upgrading Database (Optional):
To keep data between deployments:
1. Add PostgreSQL database in Render
2. Update `server/db/database.js` to use PostgreSQL
3. Install `pg` package: `npm install pg`

## Option 2: Railway

Railway offers $5 free credit per month (enough for hobby use).

### Steps:

1. **Push to GitHub** (same as above)

2. **Create Railway account**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects the setup

4. **Set environment variables**
   - Go to Variables tab
   - Add: `NODE_ENV=production`

5. **Generate domain**
   - Go to Settings → Generate Domain
   - Share your URL!

## Option 3: Vercel + Backend Separately

### Frontend on Vercel:
```bash
cd client
vercel --prod
```

### Backend on Render/Railway:
Deploy just the server folder separately following steps above.

### Update API URL:
In `client/src/services/api.js`, update:
```javascript
const API_BASE = 'https://your-backend-url.com/api';
```

## Environment Variables

After deployment, set these in your hosting platform:

### Required:
- `NODE_ENV=production`
- `PORT=5001` (or auto-assigned by host)

### Optional (but recommended):
- `GOOGLE_MAPS_API_KEY=your_key_here`
  - Get one at: https://console.cloud.google.com/google/maps-apis/
  - Needed for restaurant map embeds
  
- `GOOGLE_CLIENT_ID=your_client_id`
  - For future Google OAuth feature
  - Get one at: https://console.cloud.google.com/apis/credentials

## Post-Deployment Checklist

✅ Site loads without errors
✅ Can create a new account
✅ Can create posts
✅ Can view Friends gallery
✅ Can follow/unfollow users
✅ Google Maps links work for restaurants

## Database Considerations

### SQLite (Current - Simple but Limited):
- ✅ No setup needed
- ✅ Works immediately
- ❌ Data resets on each deploy
- ❌ Not suitable for production long-term

### PostgreSQL (Recommended for Production):
- ✅ Data persists between deploys
- ✅ Better performance
- ✅ Scalable
- ❌ Requires migration code

### To Migrate to PostgreSQL:

1. **Install pg**
   ```bash
   npm install pg
   ```

2. **Update `server/db/database.js`**
   ```javascript
   const { Pool } = require('pg');
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });
   
   // Update queries to use pool.query() instead of db.prepare()
   ```

3. **Add PostgreSQL in Render**
   - Click "New +" → "PostgreSQL"
   - Link to your web service
   - DATABASE_URL is automatically set

## Sharing Your Site

Once deployed, share your URL with friends!

**Tips:**
- Send them the direct link
- They can create accounts instantly (tied to their device)
- No downloads or sign-ups needed
- Works on phones, tablets, computers

## Monitoring

### Render Dashboard:
- View logs for errors
- See deployment history
- Monitor usage

### Common Issues:
- **Slow first load**: Free tier sleeps after inactivity (normal)
- **Data disappeared**: SQLite resets on deploy (upgrade to PostgreSQL)
- **Can't connect**: Check Render logs for errors

## Cost Estimates

### Free Tier Options:
- **Render**: Free forever (with sleep after 15 min inactivity)
- **Railway**: $5 credit/month free
- **Vercel**: Free for personal projects

### Paid Upgrades (Optional):
- **Render**: $7/month (no sleep + PostgreSQL)
- **Railway**: $5/month credit (pay for usage)

## Support

If deployment fails:
1. Check the logs in your hosting dashboard
2. Ensure all dependencies are in package.json
3. Verify build commands are correct
4. Check that PORT environment variable is set

---

Need help? Check the logs first - they usually tell you exactly what's wrong!

