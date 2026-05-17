import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import pool from '../config/database';

export const getArticles = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // Traz os artigos junto com o nome do autor
    const [articles]: any = await pool.query(`
      SELECT a.*, u.nome as autor_nome 
      FROM articles a 
      JOIN users u ON a.autor_id = u.id 
      ORDER BY a.data_publicacao DESC
    `);
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar artigos.' });
  }
};

export const createArticle = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { titulo, conteudo, imagem_banner } = req.body;
    const autor_id = req.user?.id;

    if (!titulo || !conteudo) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO articles (titulo, conteudo, autor_id, imagem_banner) VALUES (?, ?, ?, ?)',
      [titulo, conteudo, autor_id, imagem_banner || null]
    );

    return res.status(201).json({ message: 'Artigo criado com sucesso!', articleId: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar artigo.' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, imagem_banner } = req.body;

    const [result]: any = await pool.query(
      'UPDATE articles SET titulo = ?, conteudo = ?, imagem_banner = ? WHERE id = ?',
      [titulo, conteudo, imagem_banner || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    return res.status(200).json({ message: 'Artigo atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar artigo.' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const [result]: any = await pool.query('DELETE FROM articles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    return res.status(200).json({ message: 'Artigo deletado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar artigo.' });
  }
};