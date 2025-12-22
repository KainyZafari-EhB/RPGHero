/**
 * Quest Routes
 * Defines all routes for quest endpoints
 */

const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const { validateQuestCreate, validateQuestUpdate } = require('../middleware/validation');

// Search endpoint (must be before /:id to avoid conflicts)
router.get('/search', questController.searchQuests);

// CRUD routes
router.get('/', questController.getAllQuests);
router.get('/:id', questController.getQuestById);
router.post('/', validateQuestCreate, questController.createQuest);
router.put('/:id', validateQuestUpdate, questController.updateQuest);
router.delete('/:id', questController.deleteQuest);

module.exports = router;

