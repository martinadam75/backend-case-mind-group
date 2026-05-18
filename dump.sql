CREATE DATABASE IF NOT EXISTS mind_blog;
USE mind_blog;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop de tabelas antigas para garantir um fresh install limpo
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- TABELA: users
-- ==========================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  foto_url VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- TABELA: articles
-- ==========================================
CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  resumo VARCHAR(255) DEFAULT NULL,
  categoria VARCHAR(100) DEFAULT NULL,
  tags JSON DEFAULT NULL,
  imagem_banner VARCHAR(255) DEFAULT NULL,
  autor_id INT NOT NULL,
  data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (autor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- TABELA: comments
-- ==========================================
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- POPULANDO A TABELA DE USUÁRIOS
-- ==========================================
INSERT INTO users (id, nome, email, password, foto_url, bio, created_at) VALUES
(1, 'Martin Adam', 'martin@teste.com', '$2b$10$X7bB9C4vI6Mh9.b7U8P3OuxB9f9jU7I1WpEaZkYg2hR3mNlKa.GeK', NULL, 'Engenheiro de Software focado em arquitetura web, compiladores e otimização de infraestrutura em nuvem.', '2025-11-15 10:00:00'),
(2, 'John Doe', 'john.doe@email.com', '$2b$10$X7bB9C4vI6Mh9.b7U8P3OuxB9f9jU7I1WpEaZkYg2hR3mNlKa.GeK', '/john-doe.png', 'Especialista em Cloud Computing, FinOps e automação de arquiteturas distribuídas robustas.', '2025-12-01 14:30:00'),
(3, 'Marie Smith', 'marie.smith@email.com', '$2b$10$X7bB9C4vI6Mh9.b7U8P3OuxB9f9jU7I1WpEaZkYg2hR3mNlKa.GeK', '/marie-smith.png', 'Desenvolvedora Frontend Sênior e entusiasta de CSS modular, Design Systems e UI reativa.', '2025-12-05 09:15:00');


-- ==========================================
-- POPULANDO A TABELA DE ARTIGOS (10 ARTIGOS TOTAIS)
-- ==========================================
INSERT INTO articles (titulo, conteudo, resumo, categoria, tags, imagem_banner, autor_id, data_publicacao) VALUES
-- --- ARTIGOS DE MARTIN ADAM (2) ---
(
  'Construindo um Analisador Léxico do Zero',
  '## O Papel da Análise Léxica\n\nA criação de compiladores modernos exige o entendimento profundo de como transformar strings de texto puro em representações estruturadas de tokens. Na implementação da linguagem uZig, por exemplo, mapear os lexemas de forma eficiente reduz consideravelmente os gargalos das fases sintáticas posteriores.\n\n## Conclusão\n\nCompreender o motor léxico nos dá controle total sobre otimização de sintaxe e manipulação de baixo nível de código.',
  'Aprenda os conceitos práticos de análise léxica em Python aplicados no desenvolvimento de compiladores.',
  'Desenvolvimento web',
  '["Python", "Compilers", "Software Architecture"]',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
  1,
  '2026-04-10 16:20:00'
),
(
  'Estratégias de FinOps e Automação de Recursos em Nuvem',
  '## Reduzindo Custos sem Perder Performance\n\nGerenciar recursos de infraestrutura AWS sem uma estratégia rígida de monitoramento financeiro é receita para o prejuízo. Automações focadas em identificar e corrigir orquestrações ociosas são fundamentais.\n\n## Implementando Auto-Fix\n\nCriar scripts que monitoram o uso de instâncias EC2 e desligam ambientes de testes fora do horário comercial pode economizar até 35% do faturamento de nuvem mensal de um projeto de médio porte.\n\n## Conclusão\n\nFinOps não é sobre gastar menos, é sobre gastar certo e otimizar margens.',
  'Como aplicar conceitos de engenharia de custos e scripts automatizados para otimizar os recursos do seu ecossistema AWS.',
  'DevOps',
  '["AWS", "FinOps", "Cloud", "Automation"]',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
  1,
  '2026-04-15 11:00:00'
),
-- --- ARTIGOS DE JOHN DOE (4) ---
(
  'Otimização de Custos na AWS: Estratégias de FinOps para 2026',
  '## O Papel do FinOps na Nuvem\n\nCom o crescimento exponencial da infraestrutura, o controle de custos tornou-se o maior desafio das equipes de engenharia. Implementar práticas de FinOps na AWS não é apenas cortar gastos, mas maximizar o valor de cada dólar investido.',
  'Descubra como práticas de FinOps e automação na AWS podem reduzir drasticamente os custos da sua infraestrutura em nuvem.',
  'DevOps',
  '["AWS", "FinOps", "Cloud"]',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
  2,
  '2026-05-18 01:20:00'
),
(
  'Arquitetura Frontend Moderna com Deco.cx',
  '## O que é o Deco.cx?\n\nCriar experiências web ultrarrápidas exige ferramentas que unam performance e flexibilidade. A plataforma Deco.cx traz uma abordagem inovadora para construção de sites e e-commerces, focando no edge.',
  'Uma visão técnica sobre como a plataforma Deco.cx está revolucionando a entrega de performance e flexibilidade no frontend.',
  'Desenvolvimento web',
  '["Frontend", "Deco.cx", "Performance"]',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
  2,
  '2026-05-18 01:25:00'
),
(
  'Dominando o Gerenciamento de Estado no Frontend em 2026',
  '## O Cenário Atual do Estado Global\n\nGerenciar estado em aplicações modernas vai muito além de escolher entre Redux, Zustand ou Context API. A grande virada de chave está na granularidade e no uso de abordagens baseadas em sinais.',
  'Uma análise profunda sobre a evolução do estado reativo no ecossistema Javascript moderno e os novos padrões arquiteturais.',
  'Desenvolvimento web',
  '["Javascript", "Frontend", "Zustand"]',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=60',
  2,
  '2026-05-17 21:10:00'
),
(
  'Desmistificando a IA Generativa no Backend com Node.js',
  '## Integrando LLMs na sua API Estável\n\nAdicionar inteligência artificial ao seu ecossistema backend não significa necessariamente reescrever sua infraestrutura em Python. O ecossistema Node.js hoje conta com SDKs excepcionais.',
  'Aprenda como plugar modelos de inteligência artificial diretamente na sua API Express usando práticas de streaming reativo.',
  'IA',
  '["Node.js", "Backend", "IA"]',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60',
  2,
  '2026-05-16 18:40:00'
),
-- --- ARTIGOS DE MARIE SMITH (4) ---
(
  'Vue.js 3: Dominando a Composition API',
  '## Por que mudar da Options API?\n\nA Composition API nos permite extrair e reutilizar a lógica de estado de forma muito mais elegante do que os antigos mixins. O código fica perfeitamente agrupado por funcionalidade e legibilidade.',
  'Entenda de uma vez por todas as vantagens da Composition API no Vue.js 3 para componentização e reuso de lógica complexa.',
  'Desenvolvimento web',
  '["Vue.js", "Frontend", "Javascript"]',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
  3,
  '2026-05-18 01:30:00'
),
(
  'Microsserviços com Java e Maven: Melhores Práticas',
  '## O Ecossistema Java Moderno\n\nO desenvolvimento Java atual, com gerenciamento de dependências afiado com Maven, é altamente produtivo e voltado para a nuvem. Entenda o uso estratégico de BOMs para padronizar microsserviços.',
  'Práticas essenciais para estruturar, construir e gerenciar projetos de microsserviços modernos utilizando Java e o build system Maven.',
  'DevOps',
  '["Java", "Maven", "Backend"]',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
  3,
  '2026-05-15 14:00:00'
),
(
  'Guia Prático de Tailwind CSS: Clean Code nas suas Classes',
  '## Mantendo as classes limpas\n\nA melhor forma de manter o Tailwind limpo e reaproveitável é componentizar agressivamente ou usar ferramentas auxiliares.',
  'Dicas e padrões arquiteturais para evitar o espaguete de classes e manter seus componentes Next.js limpos e legíveis.',
  'Desenvolvimento web',
  '["Tailwind", "Frontend", "Clean Code"]',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
  3,
  '2026-05-12 10:22:00'
),
(
  'Arquitetura de CSS para Sistemas de Design Escalonáveis',
  '## Estruturando Design Tokens\n\nMapeie suas variáveis de forma semântica. Vincular elementos a tokens de marca facilita manutenções futuras e a implementação nativa de Dark/Light mode no CSS.',
  'Como estruturar seus design tokens, variáveis e temas escalonáveis para construir interfaces pixel-perfect.',
  'Desenvolvimento web',
  '["CSS", "Design System", "Figma"]',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
  3,
  '2026-05-10 09:00:00'
);


-- ==========================================
-- POPULANDO A TABELA DE COMENTÁRIOS
-- ==========================================
INSERT INTO comments (article_id, user_id, content, created_at) VALUES
(1, 2, 'Texto cirúrgico sobre compiladores, Martin! Facilitou demais o entendimento da arquitetura léxica.', '2026-04-11 09:30:00'),
(1, 3, 'Excelente artigo! A legibilidade do código com essa abordagem fica impecável.', '2026-04-11 11:15:00'),
(2, 2, 'FinOps é o futuro da cultura de nuvem. Automações de desligamento de instâncias salvam orçamentos.', '2026-04-16 14:22:00'),
(3, 1, 'Muito bom John! Esse foco em automação serverless e instâncias spot resolve grandes gargalos.', '2026-05-18 02:00:00');