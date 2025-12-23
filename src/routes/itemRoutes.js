/**
 * Item Routes
 * Defines all routes for item endpoints
 */

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
// const { validateItemCreate, validateItemUpdate } = require('../middleware/validation'); // To be implemented

// Search endpoint (must be before /:id)
router.get('/search', itemController.searchItems);

// CRUD routes
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem); // Add validation later
router.put('/:id', itemController.updateItem); // Add validation later
router.delete('/:id', itemController.deleteItem);

module.exports = router;
