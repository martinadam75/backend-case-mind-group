import { Request, Response } from 'express';
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
    const { titulo, conteudo, imagem_banner, resumo, categoria, tags } = req.body;
    const autor_id = req.user?.id; 

    if (!titulo || !conteudo) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
    }

    const tagsString = tags ? JSON.stringify(tags) : null;

    const [result]: any = await pool.query(
      'INSERT INTO articles (titulo, conteudo, autor_id, imagem_banner, resumo, categoria, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, conteudo, autor_id, imagem_banner || null, resumo || null, categoria || null, tagsString]
    );

    return res.status(201).json({ message: 'Artigo criado com sucesso!', articleId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar artigo.' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, imagem_banner, resumo, categoria, tags } = req.body;
    
    const tagsString = tags ? JSON.stringify(tags) : null;

    const [result]: any = await pool.query(
      'UPDATE articles SET titulo = ?, conteudo = ?, imagem_banner = ?, resumo = ?, categoria = ?, tags = ? WHERE id = ?',
      [titulo, conteudo, imagem_banner || null, resumo || null, categoria || null, tagsString, id]
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

// Buscar comentários de um artigo
export const getComments = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const [comments] = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.nome as autor_nome 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.article_id = ? 
       ORDER BY c.created_at ASC`,
      [id]
    );
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar comentários' });
  }
};

// Criar um novo comentário
export const addComment = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params; 
  const { content } = req.body;
  const user_id = req.user?.id; 

  if (!content) return res.status(400).json({ message: 'Conteúdo vazio.' });

  try {
    await pool.query(
      'INSERT INTO comments (article_id, user_id, content) VALUES (?, ?, ?)',
      [id, user_id, content]
    );
    return res.status(201).json({ message: 'Comentário publicado!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao publicar comentário.' });
  }
};