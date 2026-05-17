import { Router } from 'express';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/ArticleController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getArticles); // Livre
router.post('/', authenticateToken, createArticle); // Restrito
router.put('/:id', authenticateToken, updateArticle); // Restrito
router.delete('/:id', authenticateToken, deleteArticle); // Restrito

export default router;