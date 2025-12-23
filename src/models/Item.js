/**
 * Item Model
 * Handles database operations for items
 */

const db = require('../config/database');

class Item {
    /**
     * Get all items with optional pagination
     * @param {Object} options - Query options
     * @returns {Array} List of items
     */
    static findAll(options = {}) {
        const { limit = 10, offset = 0, sort = 'id', order = 'asc' } = options;

        const allowedSortFields = ['id', 'name', 'type', 'damage', 'weight', 'rarity', 'created_at'];
        const sortField = allowedSortFields.includes(sort) ? sort : 'id';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const stmt = db.prepare(`
            SELECT * FROM items 
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ? OFFSET ?
        `);

        return stmt.all(limit, offset);
    }

    /**
     * Find item by ID
     * @param {number} id 
     */
    static findById(id) {
        const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
        return stmt.get(id);
    }

    /**
     * Find items belonging to a specific hero
     * @param {number} heroId 
     */
    static findByHeroId(heroId) {
        const stmt = db.prepare('SELECT * FROM items WHERE hero_id = ?');
        return stmt.all(heroId);
    }

    /**
     * Search items by type
     * @param {string} type 
     */
    static searchByType(type) {
        const stmt = db.prepare('SELECT * FROM items WHERE type LIKE ?');
        return stmt.all(`%${type}%`);
    }

    /**
     * Create a new item
     * @param {Object} itemData 
     */
    static create(itemData) {
        const { name, type, damage = 0, weight, rarity, hero_id = null } = itemData;

        const stmt = db.prepare(`
            INSERT INTO items (name, type, damage, weight, rarity, hero_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(name, type, damage, weight, rarity, hero_id);
        return this.findById(result.lastInsertRowid);
    }

    /**
     * Update an item
     * @param {number} id 
     * @param {Object} itemData 
     */
    static update(id, itemData) {
        const existing = this.findById(id);
        if (!existing) return null;

        const { name, type, damage, weight, rarity, hero_id } = itemData;

        const stmt = db.prepare(`
            UPDATE items 
            SET name = ?, type = ?, damage = ?, weight = ?, rarity = ?, hero_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        stmt.run(
            name ?? existing.name,
            type ?? existing.type,
            damage ?? existing.damage,
            weight ?? existing.weight,
            rarity ?? existing.rarity,
            hero_id !== undefined ? hero_id : existing.hero_id,
            id
        );

        return this.findById(id);
    }

    /**
     * Delete an item
     * @param {number} id 
     */
    static delete(id) {
        const stmt = db.prepare('DELETE FROM items WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}

module.exports = Item;
