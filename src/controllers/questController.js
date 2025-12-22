/**
 * Quest Controller
 * Handles HTTP request/response logic for quest endpoints
 */

const Quest = require('../models/Quest');

/**
 * Get all quests with pagination and sorting
 * GET /quests
 */
exports.getAllQuests = (req, res) => {
    try {
        const { limit, offset, sort, order } = req.query;

        const quests = Quest.findAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            sort: sort || 'id',
            order: order || 'asc'
        });

        const total = Quest.count();

        res.json({
            success: true,
            data: quests,
            pagination: {
                total,
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch quests',
            message: error.message
        });
    }
};

/**
 * Get a single quest by ID
 * GET /quests/:id
 */
exports.getQuestById = (req, res) => {
    try {
        const quest = Quest.findById(req.params.id);

        if (!quest) {
            return res.status(404).json({
                success: false,
                error: 'Quest not found'
            });
        }

        res.json({
            success: true,
            data: quest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch quest',
            message: error.message
        });
    }
};

/**
 * Search quests by various criteria
 * GET /quests/search
 */
exports.searchQuests = (req, res) => {
    try {
        const { title, difficulty, minReward, activeOnly, limit, offset } = req.query;

        const quests = Quest.search({
            title,
            difficulty,
            minReward: parseInt(minReward) || undefined,
            activeOnly: activeOnly === 'true',
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0
        });

        res.json({
            success: true,
            data: quests,
            count: quests.length
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
 * Create a new quest
 * POST /quests
 */
exports.createQuest = (req, res) => {
    try {
        const quest = Quest.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Quest created successfully',
            data: quest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create quest',
            message: error.message
        });
    }
};

/**
 * Update an existing quest
 * PUT /quests/:id
 */
exports.updateQuest = (req, res) => {
    try {
        const quest = Quest.update(req.params.id, req.body);

        if (!quest) {
            return res.status(404).json({
                success: false,
                error: 'Quest not found'
            });
        }

        res.json({
            success: true,
            message: 'Quest updated successfully',
            data: quest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update quest',
            message: error.message
        });
    }
};

/**
 * Delete a quest
 * DELETE /quests/:id
 */
exports.deleteQuest = (req, res) => {
    try {
        const deleted = Quest.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Quest not found'
            });
        }

        res.json({
            success: true,
            message: 'Quest deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete quest',
            message: error.message
        });
    }
};
