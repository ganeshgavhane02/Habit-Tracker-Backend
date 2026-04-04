const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all habits for user
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.findByUserId(req.user.id);
        res.json({
            success: true,
            data: { habits }
        });
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch habits'
        });
    }
});

// Create new habit
router.post('/', [
    body('name').trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('frequency').isArray({ min: 1 }),
    body('category').optional().trim().isLength({ max: 50 }),
    body('goal').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const habitData = {
            ...req.body,
            user_id: req.user.id
        };

        const habit = await Habit.create(habitData);

        res.status(201).json({
            success: true,
            message: 'Habit created successfully',
            data: { habit }
        });
    } catch (error) {
        console.error('Create habit error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create habit'
        });
    }
});

// Get specific habit
router.get('/:id', async (req, res) => {
    try {
        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        res.json({
            success: true,
            data: { habit }
        });
    } catch (error) {
        console.error('Get habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch habit'
        });
    }
});

// Update habit
router.put('/:id', [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('frequency').optional().isArray({ min: 1 }),
    body('category').optional().trim().isLength({ max: 50 }),
    body('goal').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        const updatedHabit = await habit.update(req.body);

        res.json({
            success: true,
            message: 'Habit updated successfully',
            data: { habit: updatedHabit }
        });
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update habit'
        });
    }
});

// Delete habit
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        await habit.delete();

        res.json({
            success: true,
            message: 'Habit deleted successfully'
        });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete habit'
        });
    }
});

// Log habit completion
router.post('/:id/log', [
    body('date').isISO8601(),
    body('status').isIn(['completed', 'missed', 'skipped']),
    body('notes').optional().trim().isLength({ max: 500 })
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { date, status, notes } = req.body;

        // Verify habit belongs to user
        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        const log = await Habit.logCompletion(req.params.id, req.user.id, date, status, notes);

        res.json({
            success: true,
            message: 'Habit log recorded successfully',
            data: { log }
        });
    } catch (error) {
        console.error('Log habit error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to log habit'
        });
    }
});

// Get habit logs
router.get('/:id/logs', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Verify habit belongs to user
        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        const logs = await Habit.getLogs(
            req.params.id,
            req.user.id,
            startDate || '2020-01-01',
            endDate || new Date().toISOString().split('T')[0]
        );

        res.json({
            success: true,
            data: { logs }
        });
    } catch (error) {
        console.error('Get habit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch habit logs'
        });
    }
});

// Get habit statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        // Verify habit belongs to user
        const habit = await Habit.findByIdAndUserId(req.params.id, req.user.id);
        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        const stats = await Habit.getStats(req.params.id, req.user.id, days);

        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get habit stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch habit statistics'
        });
    }
});

module.exports = router;