/**
 * Hero Model
 * Handles all database operations for heroes
 */

const db = require('../config/database');

class Hero {
    /**
     * Get all heroes with optional pagination and sorting
     * @param {Object} options - Query options
     * @param {number} options.limit - Maximum number of results (default: 10)
     * @param {number} options.offset - Number of results to skip (default: 0)
     * @param {string} options.sort - Field to sort by
     * @param {string} options.order - Sort order: 'asc' or 'desc'
     * @returns {Array} List of heroes
     */
    static findAll(options = {}) {
        const { limit = 10, offset = 0, sort = 'id', order = 'asc' } = options;

        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['id', 'name', 'class', 'level', 'health', 'strength', 'intelligence', 'created_at'];
        const sortField = allowedSortFields.includes(sort) ? sort : 'id';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const stmt = db.prepare(`
            SELECT * FROM heroes 
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ? OFFSET ?
        `);

        return stmt.all(limit, offset);
    }

    /**
     * Get total count of heroes
     * @returns {number} Total count
     */
    static count() {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM heroes');
        return stmt.get().count;
    }

    /**
     * Find a hero by ID
     * @param {number} id - Hero ID
     * @returns {Object|undefined} Hero object or undefined
     */
    static findById(id) {
        const stmt = db.prepare('SELECT * FROM heroes WHERE id = ?');
        return stmt.get(id);
    }

    /**
     * Search heroes by name and/or class
     * @param {Object} criteria - Search criteria
     * @param {string} criteria.name - Name to search for (partial match)
     * @param {string} criteria.class - Class to filter by
     * @param {number} criteria.minLevel - Minimum level
     * @param {number} criteria.maxLevel - Maximum level
     * @param {number} criteria.limit - Maximum results
     * @param {number} criteria.offset - Results to skip
     * @returns {Array} Matching heroes
     */
    static search(criteria = {}) {
        const { name, class: heroClass, minLevel, maxLevel, limit = 10, offset = 0 } = criteria;

        let query = 'SELECT * FROM heroes WHERE 1=1';
        const params = [];

        if (name) {
            query += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }

        if (heroClass) {
            query += ' AND class = ?';
            params.push(heroClass);
        }

        if (minLevel) {
            query += ' AND level >= ?';
            params.push(minLevel);
        }

        if (maxLevel) {
            query += ' AND level <= ?';
            params.push(maxLevel);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = db.prepare(query);
        return stmt.all(...params);
    }

    /**
     * Create a new hero
     * @param {Object} heroData - Hero data
     * @returns {Object} Created hero with ID
     */
    static create(heroData) {
        const { name, class: heroClass, level = 1, health, mana, strength, intelligence } = heroData;

        const stmt = db.prepare(`
            INSERT INTO heroes (name, class, level, health, mana, strength, intelligence)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(name, heroClass, level, health, mana, strength, intelligence);

        return this.findById(result.lastInsertRowid);
    }

    /**
     * Update an existing hero
     * @param {number} id - Hero ID
     * @param {Object} heroData - Updated hero data
     * @returns {Object|null} Updated hero or null if not found
     */
    static update(id, heroData) {
        const existing = this.findById(id);
        if (!existing) return null;

        const { name, class: heroClass, level, health, mana, strength, intelligence } = heroData;

        const stmt = db.prepare(`
            UPDATE heroes 
            SET name = ?, class = ?, level = ?, health = ?, mana = ?, 
                strength = ?, intelligence = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(
            name ?? existing.name,
            heroClass ?? existing.class,
            level ?? existing.level,
            health ?? existing.health,
            mana ?? existing.mana,
            strength ?? existing.strength,
            intelligence ?? existing.intelligence,
            id
        );

        return this.findById(id);
    }

    /**
     * Delete a hero
     * @param {number} id - Hero ID
     * @returns {boolean} True if deleted, false if not found
     */
    static delete(id) {
        const stmt = db.prepare('DELETE FROM heroes WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}

module.exports = Hero;
