import { Router } from 'express';
import { getMovieList, searchMovies } from '../controllers/movie.controller';

const router = Router();

router.get('/', searchMovies);
router.get('/list', getMovieList);

export default router;
