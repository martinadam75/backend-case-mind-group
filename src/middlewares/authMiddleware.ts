import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendendo a tipagem do Request para aceitar o ID do usuário
export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Pega o token depois da palavra "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; email: string };
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};