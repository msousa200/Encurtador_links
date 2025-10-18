// ============================================
// EXEMPLOS DE USO DA API - LinkCurto
// ============================================

// ============================================
// 1. ENCURTAR URL SIMPLES
// ============================================

const encurtarUrlSimples = async () => {
  const response = await fetch('http://localhost:5000/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalUrl: 'https://www.exemplo.com/pagina-muito-longa/com-parametros?id=123&ref=newsletter'
    })
  });
  
  const data = await response.json();
  console.log('URL encurtada:', data.shortUrl);
  console.log('QR Code:', data.qrCode);
};

// ============================================
// 2. ENCURTAR COM ALIAS CUSTOMIZADO
// ============================================

const encurtarComAlias = async () => {
  const response = await fetch('http://localhost:5000/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalUrl: 'https://www.meusite.com/promocao-especial',
      customAlias: 'promo-natal'
    })
  });
  
  const data = await response.json();
  console.log('URL customizada:', data.shortUrl);
  // Resultado: http://localhost:5000/promo-natal
};

// ============================================
// 3. OBTER ESTATÍSTICAS GERAIS
// ============================================

const obterEstatisticas = async () => {
  const response = await fetch('http://localhost:5000/api/stats');
  const data = await response.json();
  
  console.log('Total de URLs:', data.totalUrls);
  console.log('Total de cliques:', data.totalClicks);
  console.log('URLs criadas hoje:', data.todayUrls);
};

// ============================================
// 4. OBTER ANALYTICS DE UM LINK ESPECÍFICO
// ============================================

const obterAnalytics = async (shortCode) => {
  const response = await fetch(`http://localhost:5000/api/analytics/${shortCode}`);
  const data = await response.json();
  
  console.log('URL original:', data.originalUrl);
  console.log('Total de cliques:', data.totalClicks);
  console.log('Criado em:', data.createdAt);
  console.log('Último acesso:', data.lastAccessed);
  console.log('Acessos recentes:', data.recentAccesses);
};

// ============================================
// 5. TRATAMENTO DE ERROS
// ============================================

const encurtarComTratamento = async (url) => {
  try {
    const response = await fetch('http://localhost:5000/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao encurtar URL');
    }
    
    return data;
    
  } catch (error) {
    console.error('Erro:', error.message);
    return null;
  }
};

// ============================================
// 6. EXEMPLO COMPLETO COM REACT
// ============================================

import { useState } from 'react';

function EncurtadorComponent() {
  const [url, setUrl] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleEncurtar = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResultado(data);
        setUrl('');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleEncurtar}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole sua URL aqui..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Encurtando...' : 'Encurtar'}
        </button>
      </form>
      
      {resultado && (
        <div>
          <p>URL encurtada: {resultado.shortUrl}</p>
          <button onClick={() => navigator.clipboard.writeText(resultado.shortUrl)}>
            Copiar
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// 7. EXEMPLO COM AXIOS
// ============================================

import axios from 'axios';

const encurtarComAxios = async () => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/shorten', {
      originalUrl: 'https://exemplo.com/url-longa',
      customAlias: 'meu-link'
    });
    
    console.log('Sucesso:', data);
    return data;
    
  } catch (error) {
    if (error.response) {
      console.error('Erro:', error.response.data.error);
    } else {
      console.error('Erro de rede:', error.message);
    }
  }
};

// ============================================
// 8. EXEMPLO COM FETCH API (Vanilla JS)
// ============================================

document.getElementById('formEncurtar').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const urlInput = document.getElementById('urlInput');
  const resultDiv = document.getElementById('resultado');
  
  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: urlInput.value })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      resultDiv.innerHTML = `
        <p>URL encurtada: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
        <button onclick="navigator.clipboard.writeText('${data.shortUrl}')">Copiar</button>
        <img src="${data.qrCode}" alt="QR Code" />
      `;
      urlInput.value = '';
    } else {
      resultDiv.innerHTML = `<p class="erro">${data.error}</p>`;
    }
    
  } catch (error) {
    resultDiv.innerHTML = `<p class="erro">Erro: ${error.message}</p>`;
  }
});

// ============================================
// 9. EXEMPLO COM DEBOUNCE (usando Radash)
// ============================================

import { debounce } from 'radash';

// Debounce para evitar múltiplas requisições
const encurtarDebounced = debounce({ delay: 300 }, async (url) => {
  const response = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl: url })
  });
  
  return response.json();
});

// Uso:
// encurtarDebounced('https://exemplo.com');

// ============================================
// 10. EXEMPLO DE INTEGRAÇÃO COMPLETA
// ============================================

class LinkShortenerAPI {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }
  
  async shorten(originalUrl, customAlias = null) {
    const response = await fetch(`${this.baseUrl}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl, customAlias })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    return response.json();
  }
  
  async getStats() {
    const response = await fetch(`${this.baseUrl}/api/stats`);
    return response.json();
  }
  
  async getAnalytics(shortCode) {
    const response = await fetch(`${this.baseUrl}/api/analytics/${shortCode}`);
    
    if (!response.ok) {
      throw new Error('Link não encontrado');
    }
    
    return response.json();
  }
}

// Uso:
const api = new LinkShortenerAPI();

// Encurtar
const result = await api.shorten('https://exemplo.com');
console.log(result.shortUrl);

// Estatísticas
const stats = await api.getStats();
console.log(stats);

// Analytics
const analytics = await api.getAnalytics('abc123');
console.log(analytics);

// ============================================
// CURL EXAMPLES (para terminal)
// ============================================

/*
# Encurtar URL
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://google.com"}'

# Encurtar com alias
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://google.com", "customAlias": "meu-link"}'

# Obter estatísticas
curl http://localhost:5000/api/stats

# Obter analytics
curl http://localhost:5000/api/analytics/abc123

# Testar redirecionamento
curl -L http://localhost:5000/abc123
*/
