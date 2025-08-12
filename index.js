const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // For CSS/JS files if needed

require('dotenv').config();

// MongoDB Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Could not connect to MongoDB Atlas", err));

// MongoDB Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['urgent', 'low', 'high'],
    default: 'low'
  }
});

const Task = mongoose.model('Task', taskSchema);

// GET all tasks (Read)
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('index', { tasks: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST a new task (Create)
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('<script>alert("Task title cannot be empty!"); window.location.href="/";</script>');
  }
  try {
    const newTask = new Task({
      title: title,
      priority: 'low' // Default priority
    });
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// PUT to update a task (Update)
app.post('/tasks/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  try {
    await Task.findByIdAndUpdate(id, { priority });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST to delete a task (Delete)
app.post('/tasks/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});