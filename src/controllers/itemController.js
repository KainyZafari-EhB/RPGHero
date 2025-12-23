/**
 * Item Controller
 * Handles HTTP request/response logic for item endpoints
 */

const Item = require('../models/Item');
const Hero = require('../models/Hero');

/**
 * Get all items
 * GET /items
 */
exports.getAllItems = (req, res) => {
    try {
        const { limit, offset, sort, order } = req.query;

        const items = Item.findAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            sort: sort || 'id',
            order: order || 'asc'
        });

        res.json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items',
            message: error.message
        });
    }
};

/**
 * Get item by ID
 * GET /items/:id
 */
exports.getItemById = (req, res) => {
    try {
        const item = Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch item',
            message: error.message
        });
    }
};

/**
 * Search items by type
 * GET /items/search
 */
exports.searchItems = (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                success: false,
                error: 'Type query parameter is required'
            });
        }

        const items = Item.searchByType(type);

        res.json({
            success: true,
            data: items,
            count: items.length
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
 * Create a new item
 * POST /items
 */
exports.createItem = (req, res) => {
    try {
        // Basic validation handled by database constraints and potential middleware
        // Here we just check logical constraints if needed

        const item = Item.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create item',
            message: error.message
        });
    }
};

/**
 * Update an item
 * PUT /items/:id
 */
exports.updateItem = (req, res) => {
    try {
        const item = Item.update(req.params.id, req.body);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item updated successfully',
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update item',
            message: error.message
        });
    }
};

/**
 * Delete an item
 * DELETE /items/:id
 */
exports.deleteItem = (req, res) => {
    try {
        const deleted = Item.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete item',
            message: error.message
        });
    }
};
