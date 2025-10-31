const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../scrapbook.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Promisify database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables
function initDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          displayName TEXT NOT NULL,
          deviceId TEXT UNIQUE,
          googleId TEXT UNIQUE,
          profilePic TEXT,
          themeColor TEXT DEFAULT 'purple',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Posts table
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Follows table
      db.run(`
        CREATE TABLE IF NOT EXISTS follows (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          followerId INTEGER NOT NULL,
          followedId INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (followerId) REFERENCES users(id),
          FOREIGN KEY (followedId) REFERENCES users(id),
          UNIQUE(followerId, followedId)
        )
      `, (err) => {
        if (err) {
          console.error('Error initializing database:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

initDB().catch(console.error);

module.exports = { db, dbRun, dbGet, dbAll, initDB };

