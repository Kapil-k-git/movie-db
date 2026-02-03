import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db';
import movieRoutes from './routes/movie.route';
import personRoutes from './routes/person.route';
import authRoute from './routes/auth.route'

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

connectDB();

// routes
app.use('/api/auth', authRoute)
app.use('/api/movies', movieRoutes);
app.use('/api/people', personRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
