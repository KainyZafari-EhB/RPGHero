/**
 * Validation Middleware
 * Uses express-validator for comprehensive input validation
 * Source: https://express-validator.github.io/
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validation rules for creating a hero
 * - name: required, no numbers allowed
 * - class: required, must be valid class
 * - level: optional, must be 1-100
 * - health, mana, strength, intelligence: required, must be positive numbers
 */
const validateHeroCreate = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .matches(/^[a-zA-Z\s\-\']+$/).withMessage('Name cannot contain numbers or special characters'),

    body('class')
        .trim()
        .notEmpty().withMessage('Class is required')
        .isIn(['warrior', 'mage', 'rogue', 'healer']).withMessage('Class must be one of: warrior, mage, rogue, healer'),

    body('level')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Level must be between 1 and 100'),

    body('health')
        .notEmpty().withMessage('Health is required')
        .isInt({ min: 1 }).withMessage('Health must be a positive number'),

    body('mana')
        .notEmpty().withMessage('Mana is required')
        .isInt({ min: 0 }).withMessage('Mana must be a non-negative number'),

    body('strength')
        .notEmpty().withMessage('Strength is required')
        .isInt({ min: 0 }).withMessage('Strength must be a non-negative number'),

    body('intelligence')
        .notEmpty().withMessage('Intelligence is required')
        .isInt({ min: 0 }).withMessage('Intelligence must be a non-negative number'),

    handleValidationErrors
];

/**
 * Validation rules for updating a hero (all fields optional)
 */
const validateHeroUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .matches(/^[a-zA-Z\s\-\']+$/).withMessage('Name cannot contain numbers or special characters'),

    body('class')
        .optional()
        .trim()
        .isIn(['warrior', 'mage', 'rogue', 'healer']).withMessage('Class must be one of: warrior, mage, rogue, healer'),

    body('level')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Level must be between 1 and 100'),

    body('health')
        .optional()
        .isInt({ min: 1 }).withMessage('Health must be a positive number'),

    body('mana')
        .optional()
        .isInt({ min: 0 }).withMessage('Mana must be a non-negative number'),

    body('strength')
        .optional()
        .isInt({ min: 0 }).withMessage('Strength must be a non-negative number'),

    body('intelligence')
        .optional()
        .isInt({ min: 0 }).withMessage('Intelligence must be a non-negative number'),

    handleValidationErrors
];

/**
 * Validation rules for creating a quest
 * - title, description: required
 * - difficulty: required, must be valid difficulty
 * - reward_gold, reward_xp: required, must be non-negative
 * - min_level: optional, must be 1-100
 * - start_date, end_date: optional, end_date must be after start_date
 */
const validateQuestCreate = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),

    body('difficulty')
        .trim()
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['easy', 'medium', 'hard', 'legendary']).withMessage('Difficulty must be one of: easy, medium, hard, legendary'),

    body('reward_gold')
        .notEmpty().withMessage('Reward gold is required')
        .isInt({ min: 0 }).withMessage('Reward gold must be a non-negative number'),

    body('reward_xp')
        .notEmpty().withMessage('Reward XP is required')
        .isInt({ min: 0 }).withMessage('Reward XP must be a non-negative number'),

    body('min_level')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Minimum level must be between 1 and 100'),

    body('start_date')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),

    body('end_date')
        .optional()
        .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
        .custom((endDate, { req }) => {
            if (req.body.start_date && endDate) {
                if (new Date(endDate) <= new Date(req.body.start_date)) {
                    throw new Error('End date must be after start date');
                }
            }
            return true;
        }),

    handleValidationErrors
];

/**
 * Validation rules for updating a quest (all fields optional)
 */
const validateQuestUpdate = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty'),

    body('description')
        .optional()
        .trim()
        .notEmpty().withMessage('Description cannot be empty'),

    body('difficulty')
        .optional()
        .trim()
        .isIn(['easy', 'medium', 'hard', 'legendary']).withMessage('Difficulty must be one of: easy, medium, hard, legendary'),

    body('reward_gold')
        .optional()
        .isInt({ min: 0 }).withMessage('Reward gold must be a non-negative number'),

    body('reward_xp')
        .optional()
        .isInt({ min: 0 }).withMessage('Reward XP must be a non-negative number'),

    body('min_level')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Minimum level must be between 1 and 100'),

    body('start_date')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),

    body('end_date')
        .optional()
        .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
        .custom((endDate, { req }) => {
            if (req.body.start_date && endDate) {
                if (new Date(endDate) <= new Date(req.body.start_date)) {
                    throw new Error('End date must be after start date');
                }
            }
            return true;
        }),

    body('is_active')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('is_active must be 0 or 1'),

    handleValidationErrors
];

module.exports = {
    validateHeroCreate,
    validateHeroUpdate,
    validateQuestCreate,
    validateQuestUpdate
};
