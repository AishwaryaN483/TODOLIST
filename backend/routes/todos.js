const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'in_progress'
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (req.body.title) todo.title = req.body.title;
        if (req.body.description) todo.description = req.body.description;
        if (req.body.status) {
            if (!['in_progress', 'completed'].includes(req.body.status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            todo.status = req.body.status;
        }
        
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get todos by status
router.get('/status/:status', async (req, res) => {
    try {
        const status = req.params.status;
        if (!['in_progress', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const todos = await Todo.find({ status }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
