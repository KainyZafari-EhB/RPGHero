/**
 * Database Configuration
 * Uses better-sqlite3 for synchronous SQLite operations
 * Source: https://github.com/WiseLibs/better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');

// Create database file in the database folder
const dbPath = path.join(__dirname, '../../database/rpghero.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database tables
 * Creates Heroes and Quests tables if they don't exist
 */
function initializeDatabase() {
    // Create Heroes table
    db.exec(`
        CREATE TABLE IF NOT EXISTS heroes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT NOT NULL CHECK(class IN ('warrior', 'mage', 'rogue', 'healer')),
            level INTEGER NOT NULL DEFAULT 1 CHECK(level >= 1 AND level <= 100),
            health INTEGER NOT NULL CHECK(health > 0),
            mana INTEGER NOT NULL CHECK(mana >= 0),
            strength INTEGER NOT NULL CHECK(strength >= 0),
            intelligence INTEGER NOT NULL CHECK(intelligence >= 0),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create Quests table
    db.exec(`
        CREATE TABLE IF NOT EXISTS quests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'legendary')),
            reward_gold INTEGER NOT NULL CHECK(reward_gold >= 0),
            reward_xp INTEGER NOT NULL CHECK(reward_xp >= 0),
            min_level INTEGER NOT NULL DEFAULT 1 CHECK(min_level >= 1 AND min_level <= 100),
            start_date DATE,
            end_date DATE,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized successfully');
}

// Initialize database on module load
initializeDatabase();

module.exports = db;
