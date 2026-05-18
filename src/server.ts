import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database';
import authRoutes from './routes/authRoutes';
import articleRoutes from './routes/articleRoutes';
import path from 'path';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Teste servidor
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});