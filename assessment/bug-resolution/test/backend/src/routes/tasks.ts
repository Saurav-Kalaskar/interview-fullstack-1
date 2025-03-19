import express from 'express';
import { Task } from '../models/Task';

const router = express.Router();

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

router.get('/tasks', async (req, res) => {
  const tasks = await Task.find({});
  for (const task of tasks) {
    task.user = await task.populate('user');
  }
  res.json(tasks);
});

router.patch('/tasks/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  
  res.status(200).send();
});

export default router; 