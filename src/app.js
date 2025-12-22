/**
 * RPG Hero API
 * Main Express application entry point
 * 
 * A database-driven REST API for managing RPG heroes and quests
 */

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import routes
const heroRoutes = require('./routes/heroRoutes');
const questRoutes = require('./routes/questRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - extra feature for security
// Source: https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    }
});
app.use('/heroes', limiter);
app.use('/quests', limiter);

// Serve static files for documentation
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/heroes', heroRoutes);
app.use('/quests', questRoutes);

// Root route - serve documentation page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: {
            documentation: 'GET /',
            heroes: 'GET /heroes',
            quests: 'GET /quests'
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║           🗡️  RPG Hero API Server  🗡️              ║
    ╠═══════════════════════════════════════════════════╣
    ║  Server running on: http://localhost:${PORT}          ║
    ║  Documentation:     http://localhost:${PORT}/          ║
    ║  Heroes API:        http://localhost:${PORT}/heroes    ║
    ║  Quests API:        http://localhost:${PORT}/quests    ║
    ╚═══════════════════════════════════════════════════╝
    `);
});

module.exports = app;
