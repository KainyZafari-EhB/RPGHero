/**
 * Hero Routes
 * Defines all routes for hero endpoints
 */

const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { validateHeroCreate, validateHeroUpdate } = require('../middleware/validation');

// Search endpoint (must be before /:id to avoid conflicts)
router.get('/search', heroController.searchHeroes);

// CRUD routes
router.get('/', heroController.getAllHeroes);
router.get('/:id', heroController.getHeroById);
router.post('/', validateHeroCreate, heroController.createHero);
router.put('/:id', validateHeroUpdate, heroController.updateHero);
router.delete('/:id', heroController.deleteHero);

// Inventory routes
router.get('/:id/inventory', heroController.getHeroInventory);
router.post('/:id/inventory', heroController.addItemToInventory);

module.exports = router;

