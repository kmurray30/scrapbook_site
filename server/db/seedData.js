const { dbRun, dbGet, dbAll } = require('./database');

const sampleUsers = [
  { displayName: 'Emma Chen', deviceId: null, themeColor: 'pink' },
  { displayName: 'Marcus Johnson', deviceId: null, themeColor: 'blue' },
  { displayName: 'Sofia Rodriguez', deviceId: null, themeColor: 'green' },
  { displayName: 'Liam O\'Brien', deviceId: null, themeColor: 'orange' },
  { displayName: 'Aisha Patel', deviceId: null, themeColor: 'yellow' },
  { displayName: 'James Kim', deviceId: null, themeColor: 'red' },
  { displayName: 'Isabella Santos', deviceId: null, themeColor: 'purple' },
  { displayName: 'Noah Taylor', deviceId: null, themeColor: 'blue' },
];

const samplePosts = [
  // Emma's posts
  { user: 0, category: 'Restaurant', title: 'Best Ramen in Town', content: 'Tonkotsu broth is incredible, noodles perfectly cooked. Must try the spicy miso version!', location: 'Ichiran Ramen, 374 Johnson Ave, Brooklyn NY', daysAgo: 0 },
  { user: 0, category: 'Movie', title: 'Perfect Autumn Film', content: 'Beautiful cinematography and touching story. The soundtrack alone is worth it. Highly recommend!', location: null, daysAgo: 1 },
  { user: 0, category: 'Book', title: 'Couldn\'t Put It Down', content: 'Mystery that keeps you guessing until the very end. Characters feel so real and relatable.', location: null, daysAgo: 3 },
  { user: 0, category: 'Song', title: 'Morning Motivation Mix', content: 'Gets me energized every morning. Upbeat tempo and inspiring lyrics. Added to all my playlists!', location: null, daysAgo: 9 },
  
  // Marcus's posts
  { user: 1, category: 'Song', title: 'New Workout Anthem', content: 'Perfect beat for running. This song pushed me through my last mile every single time!', location: null, daysAgo: 0 },
  { user: 1, category: 'Restaurant', title: 'Hidden Gem BBQ Spot', content: 'Brisket melts in your mouth. Family-owned, cash only. Get there early, they sell out fast!', location: 'Mike\'s BBQ Shack, 892 Oak Street, Austin TX', daysAgo: 2 },
  { user: 1, category: 'Other', title: 'Best Coffee Beans', content: 'Single origin Ethiopian blend. Fruity notes, smooth finish. Changed my morning coffee routine completely.', location: null, daysAgo: 5 },
  { user: 1, category: 'Movie', title: 'Epic Space Adventure', content: 'Stunning visual effects and compelling storyline. Watch it on the biggest screen you can find!', location: null, daysAgo: 8 },
  { user: 1, category: 'Book', title: 'Gripping Thriller Novel', content: 'Page turner from start to finish. Plot twists I never saw coming. Read entire thing overnight!', location: null, daysAgo: 12 },
  
  // Sofia's posts
  { user: 2, category: 'Book', title: 'Life-Changing Philosophy', content: 'Made me rethink my entire approach to work and relationships. Every chapter has quotable wisdom.', location: null, daysAgo: 1 },
  { user: 2, category: 'Restaurant', title: 'Authentic Thai Cuisine', content: 'Pad Thai is perfection. Green curry has the right amount of spice. Feels like Bangkok!', location: 'Thai Smile, 234 Mission St, San Francisco CA', daysAgo: 2 },
  { user: 2, category: 'Song', title: 'Perfect Chill Vibes', content: 'Great for studying or relaxing. The guitar melody is so soothing and the vocals are angelic.', location: null, daysAgo: 6 },
  { user: 2, category: 'Other', title: 'Game Changer Yoga Mat', content: 'Extra thick, non-slip surface. My knees thank me. Worth every penny for home practice.', location: null, daysAgo: 10 },
  { user: 2, category: 'Movie', title: 'Documentary Eye-Opener', content: 'Changed how I think about the environment. Everyone should watch this. Beautifully shot and moving.', location: null, daysAgo: 14 },
  
  // Liam's posts
  { user: 3, category: 'Movie', title: 'Classic That Still Holds Up', content: 'Watched it for the fifth time. Every scene is crafted perfectly. A masterclass in filmmaking.', location: null, daysAgo: 0 },
  { user: 3, category: 'Restaurant', title: 'Brunch Paradise Found', content: 'Belgian waffles are fluffy perfection. Bottomless mimosas. Long wait but absolutely worth it!', location: 'Sunday Brunch House, 456 Maple Ave, Portland OR', daysAgo: 1 },
  { user: 3, category: 'Book', title: 'Historical Fiction Masterpiece', content: 'Transported me to another era. Research is impeccable. Couldn\'t stop reading until 3 AM.', location: null, daysAgo: 4 },
  { user: 3, category: 'Song', title: 'Ultimate Feel-Good Track', content: 'Impossible not to smile when this comes on. Perfect summer road trip song with windows down!', location: null, daysAgo: 7 },
  
  // Aisha's posts
  { user: 4, category: 'Restaurant', title: 'Authentic Indian Street Food', content: 'Samosas are crispy and flavorful. Chutney is homemade perfection. Takes me back to Mumbai visits!', location: 'Bombay Bites, 789 Devon Ave, Chicago IL', daysAgo: 0 },
  { user: 4, category: 'Book', title: 'Sci-Fi That Blew My Mind', content: 'Incredible world-building and thought-provoking themes. The ending left me speechless. Highly recommend!', location: null, daysAgo: 2 },
  { user: 4, category: 'Other', title: 'Amazing Fountain Pen', content: 'Smooth writing experience. Perfect weight and balance. Makes journaling feel luxurious and intentional.', location: null, daysAgo: 5 },
  { user: 4, category: 'Song', title: 'Indie Gem Discovery', content: 'Found this artist last week. Unique sound and poetic lyrics. Can\'t stop listening on repeat!', location: null, daysAgo: 9 },
  { user: 4, category: 'Movie', title: 'Heartwarming Family Film', content: 'Made me laugh and cry. Perfect for movie night. Great message without being preachy.', location: null, daysAgo: 13 },
  
  // James's posts
  { user: 5, category: 'Movie', title: 'Best Action Film This Year', content: 'Non-stop excitement with amazing choreography. The car chase scene is legendary. Watch in theaters!', location: null, daysAgo: 0 },
  { user: 5, category: 'Restaurant', title: 'Korean BBQ Excellence', content: 'Meat quality is outstanding. Banchan sides are amazing. Service is attentive. Best dinner experience lately!', location: 'Seoul Garden, 234 Olympic Blvd, Los Angeles CA', daysAgo: 1 },
  { user: 5, category: 'Song', title: 'Late Night Driving Music', content: 'Perfect for night drives. Atmospheric and hypnotic. Makes any commute feel like a movie scene.', location: null, daysAgo: 6 },
  { user: 5, category: 'Other', title: 'Wireless Headphones Worth It', content: 'Sound quality rivals wired. Battery lasts forever. Comfort for all-day wear. Best tech purchase ever!', location: null, daysAgo: 11 },
  
  // Isabella's posts  
  { user: 6, category: 'Book', title: 'Poetry Collection Gem', content: 'Every poem hits different. Beautiful imagery and emotional depth. Keep it on nightstand for inspiration.', location: null, daysAgo: 1 },
  { user: 6, category: 'Restaurant', title: 'Brazilian Steakhouse Heaven', content: 'Endless meat options all cooked perfectly. Salad bar is impressive. Save room because portions are huge!', location: 'Fogo de Chão, 567 West St, Miami FL', daysAgo: 3 },
  { user: 6, category: 'Movie', title: 'Foreign Film Masterpiece', content: 'Subtitles are worth it. Story is universal and touching. Cinematography is absolutely breathtaking.', location: null, daysAgo: 7 },
  { user: 6, category: 'Song', title: 'Jazz Standard Perfection', content: 'Timeless classic with incredible vocals. Perfect for dinner parties. Never gets old no matter how many listens.', location: null, daysAgo: 10 },
  { user: 6, category: 'Other', title: 'Ceramic Plant Pots', content: 'Gorgeous design and great drainage. Plants are thriving. Perfect size for indoor herbs and succulents.', location: null, daysAgo: 15 },
  
  // Noah's posts
  { user: 7, category: 'Song', title: 'Rock Ballad Perfection', content: 'Guitar solo gives me chills every time. Vocals are powerful and emotional. Instant classic in my book!', location: null, daysAgo: 0 },
  { user: 7, category: 'Restaurant', title: 'Pizza Like in Naples', content: 'Wood-fired oven magic. Crust is perfect char and chew. Simple ingredients done absolutely right!', location: 'Pizzeria Bianco, 623 East Adams, Phoenix AZ', daysAgo: 4 },
  { user: 7, category: 'Book', title: 'Business Strategy Must-Read', content: 'Practical advice backed by research. Changed how I approach projects. Every entrepreneur should read this!', location: null, daysAgo: 8 },
  { user: 7, category: 'Movie', title: 'Comedy That Actually Funny', content: 'Laughed from start to finish. Smart humor with heart. Cast has perfect chemistry throughout.', location: null, daysAgo: 11 },
  { user: 7, category: 'Other', title: 'Standing Desk Game Changer', content: 'Energy levels improved significantly. Back pain gone. Adjustable height is perfect. Productivity boost is real!', location: null, daysAgo: 16 },
];

async function seedDatabase() {
  try {
    // Check if we already have seed data
    const existingUsers = await dbAll('SELECT * FROM users WHERE deviceId LIKE \'seed_user_%\'', []);
    
    if (existingUsers.length > 0) {
      console.log('Seed data already exists, skipping...');
      return;
    }

    console.log('Seeding database with sample data...');

    // Create sample users
    const userIds = [];
    for (const user of sampleUsers) {
      const result = await dbRun(
        'INSERT INTO users (displayName, deviceId, themeColor) VALUES (?, ?, ?)',
        [user.displayName, user.deviceId, user.themeColor]
      );
      userIds.push(result.lastID);
    }

    // Create sample posts
    for (const post of samplePosts) {
      const userId = userIds[post.user];
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - post.daysAgo);
      
      await dbRun(
        'INSERT INTO posts (userId, title, content, category, location, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, post.title, post.content, post.category, post.location, createdAt.toISOString()]
      );
    }

    // Create some follows (make them follow each other in interesting patterns)
    // Emma follows Marcus, Sofia, and James
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[0], userIds[1]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[0], userIds[2]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[0], userIds[5]]);
    
    // Marcus follows Emma, Liam, and Noah
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[1], userIds[0]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[1], userIds[3]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[1], userIds[7]]);
    
    // Sofia follows everyone (social butterfly)
    for (let i = 0; i < userIds.length; i++) {
      if (i !== 2) { // Don't follow herself
        await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[2], userIds[i]]);
      }
    }
    
    // Liam follows Sofia and Aisha
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[3], userIds[2]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[3], userIds[4]]);
    
    // Aisha follows Isabella and Emma
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[4], userIds[6]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[4], userIds[0]]);
    
    // James follows Marcus, Noah, and Liam
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[5], userIds[1]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[5], userIds[7]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[5], userIds[3]]);
    
    // Isabella follows Aisha, Sofia, and Emma
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[6], userIds[4]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[6], userIds[2]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[6], userIds[0]]);
    
    // Noah follows James and Marcus
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[7], userIds[5]]);
    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [userIds[7], userIds[1]]);

    console.log('✅ Database seeded successfully with sample data!');
    console.log(`   - ${sampleUsers.length} sample users created`);
    console.log(`   - ${samplePosts.length} sample posts created`);
    console.log('   - Follow relationships established');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase };

