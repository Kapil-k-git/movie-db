import { Router } from 'express';
import { getPersonList, searchPeople } from '../controllers/person.controller';

const router = Router();

router.get('/', searchPeople);
router.get('/list', getPersonList);

export default router;
