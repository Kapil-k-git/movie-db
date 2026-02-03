import { Router } from 'express';
import { searchMovies } from '../controllers/movie.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, searchMovies);

export default router;
