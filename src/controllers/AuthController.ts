import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se os campos vieram na requisição
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    // Verifica se o email já existe no banco
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }

    // Criptografa a senha com bcrypt (10 rounds de salt)
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Insere o usuário no banco de dados
    const [result]: any = await pool.query(
      'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    return res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário pelo email
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Compara a senha enviada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // Token expira em 1 dia
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id; // Capturado pelo middleware de autenticação
    const [rows]: any = await pool.query(
      'SELECT id, nome, email, foto_url, bio, created_at FROM users WHERE id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar perfil no banco de dados.' });
  }
};

// Atualizar os dados do perfil diretamente no banco
export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { nome, foto_url, bio } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'O nome é obrigatório.' });
    }

    await pool.query(
      'UPDATE users SET nome = ?, foto_url = ?, bio = ? WHERE id = ?',
      [nome, foto_url || null, bio || null, userId]
    );

    return res.json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
};