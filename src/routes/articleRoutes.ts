import { Router } from 'express';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/ArticleController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getComments, addComment } from '../controllers/ArticleController';

const router = Router();

router.get('/', getArticles); // Livre
router.post('/', authenticateToken, createArticle); // Restrito
router.put('/:id', authenticateToken, updateArticle); // Restrito
router.delete('/:id', authenticateToken, deleteArticle); // Restrito
router.get('/:id/comments', getComments);
router.post('/:id/comments', authenticateToken, addComment);

export default router;