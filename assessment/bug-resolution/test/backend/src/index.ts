import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import taskRouter from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 2. Global middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());       // ← parse JSON bodies

// 3. API routes
app.use('/api', taskRouter);

// Add before the 404 handler
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

// 4. 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 5. Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// 6. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});