# 🔗 LinkCurto - Encurtador de URLs

> Sistema completo e seguro de encurtamento de URLs com React, Express.js e Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://encurtador-links.vercel.app)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/msousa200/Encurtador_links)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Funcionalidades

- 🚀 **Encurtamento Instantâneo** - URLs curtas em milissegundos
- 🔒 **Segurança Máxima** - Rate limiting, anti-SSRF, sanitização de inputs
- 📱 **QR Code Automático** - Gerado para cada link encurtado
- 📊 **Estatísticas em Tempo Real** - Acompanhe cliques e links criados
- 🎯 **URLs Personalizadas** - Crie aliases customizados (opcional)
- 🌓 **Dark/Light Mode** - Interface adaptável
- ⚡ **Performance** - Built com Vite e otimizações modernas
- 📈 **100% Gratuito** - Sem limites de uso

## 🛠️ Stack Tecnológica

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React QR Code

**Backend:**
- Node.js + Express
- Better SQLite3
- Nanoid
- Rate Limiting & Security

## 🚀 Início Rápido

### Pré-requisitos
- Node.js >= 18.x
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/msousa200/Encurtador_links.git
cd Encurtador_links

# Instale as dependências
npm install

# Inicie em modo desenvolvimento
npm run dev
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Estrutura do Projeto

```
├── server/
│   └── index.js              # API Express com segurança
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Cabeçalho com dark mode
│   │   ├── Hero.jsx          # Banner com estatísticas
│   │   ├── UrlShortener.jsx  # Formulário principal
│   │   ├── ResultCard.jsx    # Resultado com QR code
│   │   ├── Features.jsx      # Grid de funcionalidades
│   │   └── Footer.jsx        # Rodapé com contatos
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── link-icon.svg         # Favicon
├── vercel.json               # Config Vercel
└── package.json
```

## 🔌 API Reference

### POST `/api/shorten`
Encurta uma URL.

```json
// Request
{
  "originalUrl": "https://exemplo.com/url-muito-longa",
  "customAlias": "meu-link"  // opcional
}

// Response
{
  "shortUrl": "https://encurtador-links.vercel.app/abc123",
  "originalUrl": "https://exemplo.com/url-muito-longa",
  "shortCode": "abc123",
  "qrCode": "data:image/png;base64,...",
  "clicks": 0,
  "createdAt": "2025-10-18T14:30:00.000Z"
}
```

### GET `/api/stats`
Retorna estatísticas gerais.

```json
{
  "totalUrls": 150,
  "totalClicks": 2500,
  "todayUrls": 25
}
```

### GET `/:shortCode`
Redireciona para a URL original (301).

## 🔒 Segurança

- ✅ **Rate Limiting**: 10 requisições/minuto por IP
- ✅ **Anti-SSRF**: Bloqueia URLs de redes privadas
- ✅ **Sanitização**: Proteção contra SQL injection e XSS
- ✅ **Validação**: URLs verificadas antes de encurtar
- ✅ **CORS**: Configurado para produção
- ✅ **Headers de Segurança**: CSP, X-Frame-Options, etc.

```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Miguel Sousa**
- GitHub: [@msousa200](https://github.com/msousa200)
- LinkedIn: [Miguel Sousa](https://www.linkedin.com/in/miguel-sousa-264629134/)
- Email: msousa200@gmail.com

---


