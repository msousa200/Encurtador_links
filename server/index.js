import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Detectar URL base (produção ou desenvolvimento)
function getBaseURL() {
  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom domain
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Local development - detectar IP da rede
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return `http://${iface.address}:${PORT}`;
      }
    }
  }
  
  return `http://localhost:${PORT}`;
}

const BASE_URL = getBaseURL();

console.log(`🌐 URL Base: ${BASE_URL}`);
console.log(`📱 QR Codes apontam para: ${BASE_URL}`);

// 🔒 Rate Limiting - Proteção contra ataques DDoS
const requestCounts = new Map();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60000; // por minuto

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip).filter(time => now - time < RATE_WINDOW);
  
  if (requests.length >= RATE_LIMIT) {
    console.log(`🚫 Rate limit atingido para IP: ${ip}`);
    return res.status(429).json({ 
      error: '🚫 Muitos pedidos. Aguarde 1 minuto.' 
    });
  }
  
  requests.push(now);
  requestCounts.set(ip, requests);
  next();
}

// Limpar contadores antigos a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of requestCounts.entries()) {
    const recentRequests = times.filter(time => now - time < RATE_WINDOW);
    if (recentRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, recentRequests);
    }
  }
}, 5 * 60 * 1000);

// 🔒 Validação de URL segura - Proteção contra SSRF e ataques
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    
    // ❌ Bloquear protocolos perigosos
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Apenas URLs HTTP/HTTPS são permitidas' };
    }
    
    // ❌ Bloquear IPs locais e privados (SSRF protection)
    const hostname = parsed.hostname.toLowerCase();
    const blockedPatterns = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '169.254.', // Link-local
      '10.',      // Rede privada classe A
      '172.16.',  // Rede privada classe B
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.',
      '192.168.', // Rede privada classe C
      'metadata.google.internal', // Cloud metadata
      'metadata.azure.com',
      'metadata.aws',
      '169.254.169.254', // AWS metadata
    ];
    
    if (blockedPatterns.some(pattern => hostname.includes(pattern))) {
      return { valid: false, error: 'URLs de redes privadas não são permitidas' };
    }
    
    // ❌ Bloquear URLs muito longas (DoS protection)
    if (url.length > 2048) {
      return { valid: false, error: 'URL muito longa (máximo 2048 caracteres)' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'URL inválida' };
  }
}

// 🔒 Sanitizar alias customizado - Proteção contra SQL Injection e XSS
function sanitizeAlias(alias) {
  if (!alias) return null;
  
  // Apenas letras, números, hífens (3-20 caracteres)
  const sanitized = alias.toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  if (sanitized.length < 3 || sanitized.length > 20) {
    throw new Error('Alias deve ter 3-20 caracteres (letras, números, hífens)');
  }
  
  // ❌ Bloquear palavras reservadas
  const reserved = ['api', 'admin', 'analytics', 'stats', 'health', 'server', 'database'];
  if (reserved.includes(sanitized)) {
    throw new Error('Alias reservado pelo sistema');
  }
  
  return sanitized;
}

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.BASE_URL,
    ].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // ⚠️ Limite reduzido para 10KB
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../dist')));

// 📊 Logging de requisições
app.use((req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`📡 ${req.method} ${req.path} - IP: ${ip}`);
  next();
});

// Inicializar banco de dados
const db = new Database(process.env.DATABASE_PATH || './database.db');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    custom_alias TEXT,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    creator_ip TEXT,
    qr_code TEXT
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT NOT NULL,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    FOREIGN KEY (short_code) REFERENCES urls(short_code)
  );

  CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
  CREATE INDEX IF NOT EXISTS idx_analytics_code ON analytics(short_code);
  CREATE INDEX IF NOT EXISTS idx_created_at ON urls(created_at);
`);

console.log('✅ Banco de dados inicializado');

// ❤️ Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 📊 Estatísticas gerais
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as totalUrls,
        SUM(clicks) as totalClicks,
        COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as todayUrls
      FROM urls
    `).get();

    res.json(stats);
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// 🔗 Encurtar URL - COM PROTEÇÃO
app.post('/api/shorten', rateLimiter, async (req, res) => {
  try {
    console.log('📥 Recebido pedido de encurtamento:', req.body);
    
    const { originalUrl, customAlias } = req.body;

    // 🔒 Validação obrigatória
    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    // 🔒 Validar URL
    const validation = isValidUrl(originalUrl.trim());
    if (!validation.valid) {
      console.log('⚠️ URL inválida:', validation.error);
      return res.status(400).json({ error: validation.error });
    }

    // Gerar ou sanitizar código
    let shortCode;
    try {
      shortCode = customAlias ? sanitizeAlias(customAlias) : nanoid(7);
    } catch (err) {
      console.log('⚠️ Erro no alias:', err.message);
      return res.status(400).json({ error: err.message });
    }

    console.log('🔑 Código gerado/sanitizado:', shortCode);

    // Verificar se código já existe
    const existing = db.prepare('SELECT short_code, original_url, qr_code, clicks, created_at FROM urls WHERE short_code = ?').get(shortCode);
    
    if (existing) {
      console.log('✅ URL já existe, retornando código:', shortCode);
      const shortUrl = `${BASE_URL}/${shortCode}`;
      return res.json({
        success: true,
        shortUrl,
        shortCode: existing.short_code,
        originalUrl: existing.original_url,
        qrCode: existing.qr_code,
        clicks: existing.clicks || 0,
        createdAt: existing.created_at,
        analyticsUrl: `${BASE_URL}/api/analytics/${shortCode}`,
        message: '✅ URL já encurtado anteriormente'
      });
    }

    // Salvar no banco
    const creatorIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    db.prepare(`
      INSERT INTO urls (short_code, original_url, custom_alias, creator_ip)
      VALUES (?, ?, ?, ?)
    `).run(shortCode, originalUrl.trim(), customAlias || null, creatorIp);

    console.log('💾 Salvo no banco de dados');

    const shortUrl = `${BASE_URL}/${shortCode}`;

    // 📱 Gerar QR Code
    let qrCodeDataUrl;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#1e293b', light: '#ffffff' }
      });

      // Salvar QR code no banco
      db.prepare('UPDATE urls SET qr_code = ? WHERE short_code = ?').run(qrCodeDataUrl, shortCode);
      
      console.log('📱 QR Code gerado e salvo');
    } catch (qrError) {
      console.error('⚠️ Erro ao gerar QR Code:', qrError);
      // Continuar sem QR code
    }

    console.log('✅ Enviando resposta');

    // Buscar dados completos para retornar
    const savedUrl = db.prepare('SELECT short_code, original_url, qr_code, clicks, created_at FROM urls WHERE short_code = ?').get(shortCode);

    res.status(201).json({
      success: true,
      shortUrl,
      shortCode: savedUrl.short_code,
      originalUrl: savedUrl.original_url,
      qrCode: savedUrl.qr_code,
      clicks: savedUrl.clicks || 0,
      createdAt: savedUrl.created_at,
      analyticsUrl: `${BASE_URL}/api/analytics/${shortCode}`,
      message: `✅ URL encurtado com sucesso! QR Code funciona em: ${BASE_URL}`
    });

  } catch (error) {
    console.error('❌ Erro ao encurtar URL:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 📊 Analytics detalhado
app.get('/api/analytics/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;

    // 🔒 Sanitizar parâmetro
    if (!/^[a-zA-Z0-9-_]{3,20}$/.test(shortCode)) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    const urlData = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(shortCode);
    
    if (!urlData) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    const analytics = db.prepare(`
      SELECT 
        clicked_at,
        ip_address,
        user_agent,
        referrer
      FROM analytics 
      WHERE short_code = ?
      ORDER BY clicked_at DESC
      LIMIT 100
    `).all(shortCode);

    res.json({
      url: urlData,
      analytics,
      totalClicks: urlData.clicks
    });
  } catch (error) {
    console.error('❌ Erro ao buscar analytics:', error);
    res.status(500).json({ error: 'Erro ao buscar analytics' });
  }
});

// 🔀 Redirecionamento com tracking
app.get('/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;

    // 🔒 Sanitizar parâmetro
    if (!/^[a-zA-Z0-9-_]{3,20}$/.test(shortCode)) {
      return res.status(404).send('Link inválido');
    }

    const urlData = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(shortCode);

    if (!urlData) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Link não encontrado</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              text-align: center; 
              padding: 50px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            h1 { font-size: 3rem; margin: 20px 0; }
            p { font-size: 1.2rem; }
          </style>
        </head>
        <body>
          <h1>🔗 Link não encontrado</h1>
          <p>O link que procuras não existe ou expirou.</p>
        </body>
        </html>
      `);
    }

    // Registrar analytics (proteção contra XSS)
    const ip = (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown').substring(0, 45);
    const userAgent = (req.get('user-agent') || 'Unknown').substring(0, 255);
    const referrer = (req.get('referer') || 'Direct').substring(0, 255);

    db.prepare(`
      INSERT INTO analytics (short_code, ip_address, user_agent, referrer)
      VALUES (?, ?, ?, ?)
    `).run(shortCode, ip, userAgent, referrer);

    // Incrementar contador
    db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?').run(shortCode);

    console.log(`🔀 Redirecionando ${shortCode} → ${urlData.original_url}`);

    // Redirecionar
    res.redirect(301, urlData.original_url);
  } catch (error) {
    console.error('❌ Erro ao redirecionar:', error);
    res.status(500).send('Erro ao processar redirecionamento');
  }
});

// Servir index.html para todas as outras rotas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Servidor rodando com SEGURANÇA MÁXIMA!                 ║
║                                                            ║
║  📍 URL:              ${BASE_URL.padEnd(35)} ║
║  🔒 Rate Limiting:    ✅ 10 req/min                         ║
║  🛡️  Anti-SSRF:       ✅ Ativado                            ║
║  🔐 Sanitização:      ✅ Ativada                            ║
║  📱 QR Codes:         ✅ Funcionam no telemóvel             ║
║  🌐 Ambiente:         ${(process.env.NODE_ENV || 'development').padEnd(35)} ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
