import { Router } from 'express';
import { list, create, update, toggleComplete, remove } from '../controllers/todoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/complete', toggleComplete);
router.delete('/:id', remove);

export default router;
