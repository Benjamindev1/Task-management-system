import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pathToFileURL } from 'node:url';
import tasksRouter from './routes/tasks.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/tasks', tasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const isLocalRun =
  process.env.VERCEL === undefined &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isLocalRun) {
  app.listen(port, () => {
    console.log(`Task API listening on http://localhost:${port}`);
  });
}

export default app;
