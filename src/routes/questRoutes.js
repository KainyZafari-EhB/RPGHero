/**
 * Quest Routes
 * Defines all routes for quest endpoints
 */

const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');

// Search endpoint (must be before /:id to avoid conflicts)
router.get('/search', questController.searchQuests);

// CRUD routes
router.get('/', questController.getAllQuests);
router.get('/:id', questController.getQuestById);
router.post('/', questController.createQuest);
router.put('/:id', questController.updateQuest);
router.delete('/:id', questController.deleteQuest);

module.exports = router;
