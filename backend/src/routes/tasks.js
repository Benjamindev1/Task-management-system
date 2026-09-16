import express from 'express';
import { createTask, deleteTask, findTaskById, listTasks, updateTask } from '../models/taskModel.js';
import { validateTaskBody, validateTaskUpdate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { status, priority, q, page, limit } = req.query;
    const result = await listTasks({ status, priority, q, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateTaskBody, async (req, res, next) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateTaskUpdate, async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.body);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteTask(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
