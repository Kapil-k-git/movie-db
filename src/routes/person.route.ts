import { Router } from 'express';
import { searchPeople } from '../controllers/person.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, searchPeople);

export default router;
