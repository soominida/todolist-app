import { Router } from 'express';
import { list, create, update, remove } from '../controllers/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
