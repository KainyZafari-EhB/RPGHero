/**
 * Quest Model
 * Handles all database operations for quests
 */

const db = require('../config/database');

class Quest {
    /**
     * Get all quests with optional pagination and sorting
     * @param {Object} options - Query options
     * @param {number} options.limit - Maximum number of results (default: 10)
     * @param {number} options.offset - Number of results to skip (default: 0)
     * @param {string} options.sort - Field to sort by
     * @param {string} options.order - Sort order: 'asc' or 'desc'
     * @returns {Array} List of quests
     */
    static findAll(options = {}) {
        const { limit = 10, offset = 0, sort = 'id', order = 'asc' } = options;

        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['id', 'title', 'difficulty', 'reward_gold', 'reward_xp', 'min_level', 'start_date', 'end_date', 'created_at'];
        const sortField = allowedSortFields.includes(sort) ? sort : 'id';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const stmt = db.prepare(`
            SELECT * FROM quests 
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ? OFFSET ?
        `);

        return stmt.all(limit, offset);
    }

    /**
     * Get total count of quests
     * @returns {number} Total count
     */
    static count() {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM quests');
        return stmt.get().count;
    }

    /**
     * Find a quest by ID
     * @param {number} id - Quest ID
     * @returns {Object|undefined} Quest object or undefined
     */
    static findById(id) {
        const stmt = db.prepare('SELECT * FROM quests WHERE id = ?');
        return stmt.get(id);
    }

    /**
     * Search quests by various criteria
     * @param {Object} criteria - Search criteria
     * @param {string} criteria.title - Title to search for (partial match)
     * @param {string} criteria.difficulty - Difficulty to filter by
     * @param {number} criteria.minReward - Minimum gold reward
     * @param {boolean} criteria.activeOnly - Only return active quests
     * @param {number} criteria.limit - Maximum results
     * @param {number} criteria.offset - Results to skip
     * @returns {Array} Matching quests
     */
    static search(criteria = {}) {
        const { title, difficulty, minReward, activeOnly, limit = 10, offset = 0 } = criteria;

        let query = 'SELECT * FROM quests WHERE 1=1';
        const params = [];

        if (title) {
            query += ' AND title LIKE ?';
            params.push(`%${title}%`);
        }

        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        if (minReward) {
            query += ' AND reward_gold >= ?';
            params.push(minReward);
        }

        if (activeOnly) {
            query += ' AND is_active = 1';
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = db.prepare(query);
        return stmt.all(...params);
    }

    /**
     * Create a new quest
     * @param {Object} questData - Quest data
     * @returns {Object} Created quest with ID
     */
    static create(questData) {
        const {
            title,
            description,
            difficulty,
            reward_gold,
            reward_xp,
            min_level = 1,
            start_date = null,
            end_date = null,
            is_active = 1
        } = questData;

        const stmt = db.prepare(`
            INSERT INTO quests (title, description, difficulty, reward_gold, reward_xp, min_level, start_date, end_date, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(title, description, difficulty, reward_gold, reward_xp, min_level, start_date, end_date, is_active);

        return this.findById(result.lastInsertRowid);
    }

    /**
     * Update an existing quest
     * @param {number} id - Quest ID
     * @param {Object} questData - Updated quest data
     * @returns {Object|null} Updated quest or null if not found
     */
    static update(id, questData) {
        const existing = this.findById(id);
        if (!existing) return null;

        const {
            title,
            description,
            difficulty,
            reward_gold,
            reward_xp,
            min_level,
            start_date,
            end_date,
            is_active
        } = questData;

        const stmt = db.prepare(`
            UPDATE quests 
            SET title = ?, description = ?, difficulty = ?, reward_gold = ?, reward_xp = ?, 
                min_level = ?, start_date = ?, end_date = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(
            title ?? existing.title,
            description ?? existing.description,
            difficulty ?? existing.difficulty,
            reward_gold ?? existing.reward_gold,
            reward_xp ?? existing.reward_xp,
            min_level ?? existing.min_level,
            start_date !== undefined ? start_date : existing.start_date,
            end_date !== undefined ? end_date : existing.end_date,
            is_active ?? existing.is_active,
            id
        );

        return this.findById(id);
    }

    /**
     * Delete a quest
     * @param {number} id - Quest ID
     * @returns {boolean} True if deleted, false if not found
     */
    static delete(id) {
        const stmt = db.prepare('DELETE FROM quests WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}

module.exports = Quest;
