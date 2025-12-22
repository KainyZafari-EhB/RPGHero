/**
 * Hero Controller
 * Handles HTTP request/response logic for hero endpoints
 */

const Hero = require('../models/Hero');

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
