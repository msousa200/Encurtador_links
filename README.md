# 🔗 LinkCurto - Encurtador de URLs

Sistema completo de encurtamento de URLs com React, Express.js, Tailwind CSS e SQLite.

![LinkCurto](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalidades

### Core Features
- ✅ **Encurtamento Instantâneo** - URLs curtas em milissegundos
- ✅ **Redirecionamento 301** - SEO friendly
- ✅ **Validação de URLs** - Verifica URLs válidas antes de encurtar
- ✅ **Tratamento de Erros** - Mensagens claras e amigáveis

### Features Avançadas
- 🎯 **URLs Customizadas** - Crie aliases personalizados (ex: `/meu-negocio`)
- 📊 **Analytics Completo** - Rastreie cliques, origem, dispositivos
- 📱 **QR Code Automático** - Gerado para cada link
- 🌓 **Dark/Light Mode** - Tema adaptável
- 🎨 **Animações Suaves** - Microinterações e transições
- 📈 **Estatísticas em Tempo Real** - Dashboard ao vivo

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Estilização utility-first
- **Vite** - Build tool ultrarrápido
- **Canvas Confetti** - Efeitos visuais
- **React QR Code** - Geração de QR codes

### Backend
- **Node.js + Express** - Servidor API
- **Better SQLite3** - Banco de dados embutido
- **Nanoid** - Geração de IDs únicos
- **QRCode** - Geração de QR codes no servidor
- **Radash** - Utilitários JavaScript
- **CORS** - Middleware de segurança

## 📋 Pré-requisitos

- Node.js >= 18.x
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/msousa200/Encurtador_links.git
cd encurtador-links
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` conforme necessário:
```env
PORT=5000
BASE_URL=http://localhost:5000
NODE_ENV=development
DATABASE_PATH=./database.db
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Isso iniciará:
- **Frontend (Vite)** em `http://localhost:3000`
- **Backend (Express)** em `http://localhost:5000`

### 5. Build para produção
```bash
npm run build
```

### 6. Execute em produção
```bash
npm start
```

## 📁 Estrutura do Projeto

```
encurtador-links/
├── server/
│   └── index.js              # Servidor Express
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Cabeçalho com dark mode
│   │   ├── Hero.jsx          # Seção hero com stats
│   │   ├── UrlShortener.jsx  # Formulário principal
│   │   ├── ResultCard.jsx    # Card de resultado
│   │   ├── Features.jsx      # Grid de features
│   │   └── Footer.jsx        # Rodapé
│   ├── App.jsx               # Componente raiz
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globais + Tailwind
├── public/                   # Assets estáticos
├── .env                      # Variáveis de ambiente
├── package.json              # Dependências
├── vite.config.js            # Config Vite
├── tailwind.config.js        # Config Tailwind
└── postcss.config.js         # Config PostCSS
```

## 🔌 API Endpoints

### POST `/api/shorten`
Encurta uma URL.

**Body:**
```json
{
  "originalUrl": "https://exemplo.com/url-longa",
  "customAlias": "meu-link" // opcional
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "originalUrl": "https://exemplo.com/url-longa",
  "shortCode": "abc123",
  "qrCode": "data:image/png;base64,...",
  "analyticsUrl": "http://localhost:5000/api/analytics/abc123",
  "clicks": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api/stats`
Retorna estatísticas gerais.

**Response:**
```json
{
  "totalUrls": 150,
  "totalClicks": 2500,
  "todayUrls": 25
}
```

### GET `/api/analytics/:shortCode`
Retorna analytics detalhado de um link.

**Response:**
```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "originalUrl": "https://exemplo.com/url-longa",
  "totalClicks": 45,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastAccessed": "2024-01-20T15:45:00.000Z",
  "recentAccesses": [...]
}
```

### GET `/:shortCode`
Redireciona para a URL original.

## 🎨 Paleta de Cores

```css
--primary: #2563eb;    /* Azul profissional */
--secondary: #7c3aed;  /* Roxo criativo */
--accent: #06d6a0;     /* Verde sucesso */
--dark: #1e293b;       /* Escuro elegante */
--light: #f8fafc;      /* Fundo claro */
```

## 🔧 Banco de Dados

O projeto usa **SQLite** com as seguintes tabelas:

### `urls`
```sql
CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  custom_alias TEXT,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  last_accessed DATETIME
);
```

### `analytics`
```sql
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (short_code) REFERENCES urls(short_code)
);
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Configure o projeto:
```bash
vercel
```

3. Configure as variáveis de ambiente na dashboard da Vercel:
- `BASE_URL`
- `NODE_ENV=production`

4. Deploy:
```bash
vercel --prod
```

### Outras Plataformas
- **Render**: Suporta Node.js + SQLite
- **Railway**: Deploy direto do GitHub
- **Fly.io**: Ideal para apps full-stack

## 📝 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (frontend + backend)
npm run server   # Apenas backend
npm run client   # Apenas frontend
npm run build    # Build de produção
npm run preview  # Preview do build
npm start        # Produção
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Criado com ❤️ por [Seu Nome]

## 🙏 Agradecimentos

- React Team
- Tailwind Labs
- Express.js Community
- Todos os contribuidores open-source

---

⭐ Se este projeto foi útil, considere dar uma estrela!
