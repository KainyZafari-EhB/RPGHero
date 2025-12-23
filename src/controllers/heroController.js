/**
 * Hero Controller
 * Handles HTTP request/response logic for hero endpoints
 */

const Hero = require('../models/Hero');
const Item = require('../models/Item');

/**
 * Get all heroes with pagination and sorting
 * GET /heroes
 */
exports.getAllHeroes = (req, res) => {
    try {
        const { limit, offset, sort, order } = req.query;

        const heroes = Hero.findAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            sort: sort || 'id',
            order: order || 'asc'
        });

        const total = Hero.count();

        res.json({
            success: true,
            data: heroes,
            pagination: {
                total,
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch heroes',
            message: error.message
        });
    }
};

/**
 * Get a single hero by ID
 * GET /heroes/:id
 */
exports.getHeroById = (req, res) => {
    try {
        const hero = Hero.findById(req.params.id);

        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        res.json({
            success: true,
            data: hero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch hero',
            message: error.message
        });
    }
};

/**
 * Search heroes by various criteria
 * GET /heroes/search
 */
exports.searchHeroes = (req, res) => {
    try {
        const { name, class: heroClass, minLevel, maxLevel, limit, offset } = req.query;

        const heroes = Hero.search({
            name,
            class: heroClass,
            minLevel: parseInt(minLevel) || undefined,
            maxLevel: parseInt(maxLevel) || undefined,
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0
        });

        res.json({
            success: true,
            data: heroes,
            count: heroes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Search failed',
            message: error.message
        });
    }
};

/**
 * Create a new hero
 * POST /heroes
 */
exports.createHero = (req, res) => {
    try {
        const hero = Hero.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Hero created successfully',
            data: hero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create hero',
            message: error.message
        });
    }
};

/**
 * Update an existing hero
 * PUT /heroes/:id
 */
exports.updateHero = (req, res) => {
    try {
        const hero = Hero.update(req.params.id, req.body);

        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        res.json({
            success: true,
            message: 'Hero updated successfully',
            data: hero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update hero',
            message: error.message
        });
    }
};

/**
 * Delete a hero
 * DELETE /heroes/:id
 */
exports.deleteHero = (req, res) => {
    try {
        const deleted = Hero.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        res.json({
            success: true,
            message: 'Hero deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete hero',
            message: error.message
        });
    }
};

/**
 * Get hero's inventory
 * GET /heroes/:id/inventory
 */
exports.getHeroInventory = (req, res) => {
    try {
        const hero = Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        const items = Item.findByHeroId(req.params.id);

        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch inventory',
            message: error.message
        });
    }
};

/**
 * Add item to hero's inventory
 * POST /heroes/:id/inventory
 */
exports.addItemToInventory = (req, res) => {
    try {
        const heroId = parseInt(req.params.id);
        const hero = Hero.findById(heroId);

        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        // Calculate max carry capacity (Bonus requirement)
        // Rule: Max Weight = Strength * 5
        const maxCapacity = hero.strength * 5;

        // Get current inventory usage
        const currentItems = Item.findByHeroId(heroId);
        const currentWeight = currentItems.reduce((total, item) => total + item.weight, 0);

        // Check if we are adding an existing item or creating a new one
        const { itemId, name, type, damage, weight, rarity } = req.body;
        let itemToAddWeight = 0;
        let itemToUpdateId = null;

        if (itemId) {
            const existingItem = Item.findById(itemId);
            if (!existingItem) {
                return res.status(404).json({ success: false, error: 'Item not found' });
            }
            itemToAddWeight = existingItem.weight;
            itemToUpdateId = itemId;
        } else {
            // New item creation
            if (weight === undefined) {
                return res.status(400).json({ success: false, error: 'Weight is required for new items' });
            }
            itemToAddWeight = parseInt(weight);
        }

        // Check capacity
        if (currentWeight + itemToAddWeight > maxCapacity) {
            return res.status(400).json({
                success: false,
                error: 'Inventory full',
                message: `Cannot carry item. Max capacity: ${maxCapacity}, Current: ${currentWeight}, Item: ${itemToAddWeight}`
            });
        }

        let resultItem;
        if (itemToUpdateId) {
            // Assign existing item
            resultItem = Item.update(itemToUpdateId, { hero_id: heroId });
        } else {
            // Create new item assigned to hero
            resultItem = Item.create({
                name,
                type,
                damage,
                weight: itemToAddWeight,
                rarity,
                hero_id: heroId
            });
        }

        res.status(201).json({
            success: true,
            message: 'Item added to inventory',
            data: resultItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add item',
            message: error.message
        });
    }
};
