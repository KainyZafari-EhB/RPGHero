/**
 * Hero Routes
 * Defines all routes for hero endpoints
 */

const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// Search endpoint (must be before /:id to avoid conflicts)
router.get('/search', heroController.searchHeroes);

// CRUD routes
router.get('/', heroController.getAllHeroes);
router.get('/:id', heroController.getHeroById);
router.post('/', heroController.createHero);
router.put('/:id', heroController.updateHero);
router.delete('/:id', heroController.deleteHero);

module.exports = router;
