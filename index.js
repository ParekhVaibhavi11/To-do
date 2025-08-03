// index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Correctly using process.env.PORT

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Task Schema and Model
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Low', 'High', 'Urgent'],
        default: 'Low'
    }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
// 1. Get all tasks (Read)
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        const alertMessage = req.query.alert;
        res.render('index', { tasks: tasks, alert: alertMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. Add a new task (Create)
app.post('/tasks', async (req, res) => {
    const { title, priority } = req.body;
    if (!title || title.trim() === '') {
        return res.redirect('/?alert=Task title cannot be empty!');
    }
    try {
        const newTask = new Task({ title: title.trim(), priority: priority || 'Low' });
        await newTask.save();
        res.redirect('/?alert=Task added successfully!');
    } catch (err) {
        console.error(err);
        res.redirect('/?alert=Failed to add task.');
    }
});

// 3. Update an existing task (Update)
app.post('/tasks/edit/:id', async (req, res) => {
    const { title, priority } = req.body;
    const taskId = req.params.id;
    if (!title || title.trim() === '') {
        return res.redirect(`/?alert=Task title cannot be empty!`);
    }
    try {
        await Task.findByIdAndUpdate(taskId, { title: title.trim(), priority: priority });
        res.redirect('/?alert=Task updated successfully!');
    } catch (err) {
        console.error(err);
        res.redirect('/?alert=Failed to update task.');
    }
});

// 4. Delete a task (Delete)
app.post('/tasks/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/?alert=Task deleted successfully!');
    } catch (err) {
        console.error(err);
        res.redirect('/?alert=Failed to delete task.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});