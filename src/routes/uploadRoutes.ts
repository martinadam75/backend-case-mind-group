import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configura onde e como o arquivo será salvo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Salva na pasta uploads na raiz do back
  },
  filename: (req, file, cb) => {
    // Gera um nome único com a data atual para não ter conflito de nomes
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage });

// Rota que recebe a imagem do front
router.post('/upload', upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  const fileUrl = `http://localhost:3333/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl });
});