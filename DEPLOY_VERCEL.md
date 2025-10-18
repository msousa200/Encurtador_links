# 🚀 GUIA DE DEPLOY NO VERCEL

## 📋 Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Vercel CLI instalado: `npm i -g vercel`
3. Projeto no GitHub (opcional, mas recomendado)

---

## 🔐 SEGURANÇA IMPLEMENTADA

✅ **Rate Limiting** - 10 requests/minuto por IP  
✅ **Anti-SSRF** - Bloqueia URLs de redes privadas e metadata  
✅ **Sanitização** - Remove caracteres perigosos de alias  
✅ **Validação de URLs** - Aceita apenas http/https  
✅ **Limite de tamanho** - Máximo 2048 caracteres por URL  
✅ **SQL Injection Protection** - Prepared statements  
✅ **XSS Protection** - Sanitização de inputs  
✅ **Headers de segurança** - X-Frame-Options, CSP, etc  
✅ **QR Codes funcionam** - URLs públicas do Vercel  

---

## 📦 MÉTODO 1: Deploy via CLI (Recomendado)

### Passo 1: Login no Vercel
```bash
vercel login
```

### Passo 2: Deploy
```bash
# Na raiz do projeto
vercel

# Responda às perguntas:
# - Set up and deploy? Yes
# - Which scope? [Sua conta]
# - Link to existing project? No
# - Project name? encurtador-links (ou outro nome)
# - Directory? ./
# - Override settings? No
```

### Passo 3: Deploy em Produção
```bash
vercel --prod
```

### Passo 4: Verificar
O Vercel irá retornar a URL, exemplo:
```
https://encurtador-links.vercel.app
```

---

## 🌐 MÉTODO 2: Deploy via GitHub (Automático)

### Passo 1: Criar repositório no GitHub
```bash
git init
git add .
git commit -m "Initial commit - Encurtador de URLs seguro"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/encurtador-links.git
git push -u origin main
```

### Passo 2: Conectar no Vercel
1. Acesse https://vercel.com/new
2. Import Git Repository
3. Selecione seu repositório
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Passo 3: Deploy
- Clique em "Deploy"
- Aguarde a build (2-3 minutos)
- URL disponível em: `https://SEU_PROJETO.vercel.app`

---

## ⚙️ VARIÁVEIS DE AMBIENTE (Opcional)

No dashboard do Vercel, vá em:
**Settings → Environment Variables**

Adicione (opcional):
```
BASE_URL=https://SEU_DOMINIO.vercel.app
NODE_ENV=production
```

**NOTA**: O `BASE_URL` é detectado automaticamente via `VERCEL_URL`, não é obrigatório.

---

## 📱 TESTAR QR CODE NO TELEMÓVEL

### Passo 1: Deploy concluído
Aguarde o deploy finalizar

### Passo 2: Criar um link curto
Acesse: `https://SEU_PROJETO.vercel.app`

Cole uma URL longa, exemplo:
```
https://github.com/facebook/react/blob/main/README.md
```

### Passo 3: Ver QR Code
Clique em "Ver QR Code"

### Passo 4: Escanear no telemóvel
Use a câmera do telemóvel para escanear

### Resultado Esperado
✅ O telemóvel deve abrir a URL original  
✅ O contador de cliques deve aumentar  
✅ Analytics são registados  

---

## 🔍 VERIFICAR SEGURANÇA

### Teste 1: Rate Limiting
```bash
# Fazer 15 requests rápidos
for i in {1..15}; do
  curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
    -H "Content-Type: application/json" \
    -d '{"originalUrl":"https://google.com"}' &
done

# Deve bloquear após 10 requests
```

### Teste 2: URLs Maliciosas
```bash
# Tentar URL de rede privada (deve ser bloqueado)
curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"http://localhost/admin"}'

# Resposta esperada: 400 Bad Request
# {"error":"URLs de redes privadas não são permitidas"}
```

### Teste 3: SSRF Protection
```bash
# Tentar acessar metadata (deve ser bloqueado)
curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"http://169.254.169.254/latest/meta-data"}'

# Resposta esperada: 400 Bad Request
```

### Teste 4: Alias Injection
```bash
# Tentar SQL injection (deve ser sanitizado)
curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://google.com","customAlias":"test;DROP TABLE urls;"}'

# Resposta esperada: Alias sanitizado para "testdroptableurls"
```

---

## 📊 MONITORIZAÇÃO

### Logs em Tempo Real
```bash
vercel logs SEU_PROJETO.vercel.app
```

### Analytics do Vercel
https://vercel.com/SEU_USUARIO/SEU_PROJETO/analytics

### Health Check
```bash
curl https://SEU_PROJETO.vercel.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T...",
  "baseUrl": "https://...",
  "environment": "production"
}
```

---

## 🎯 CUSTOM DOMAIN (Opcional)

### Passo 1: No Vercel Dashboard
1. Vá em **Settings → Domains**
2. Adicione seu domínio (ex: `encurta.com`)

### Passo 2: No seu DNS provider
Adicione registro:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### Passo 3: Aguardar propagação
Pode levar até 48h

---

## 🐛 TROUBLESHOOTING

### Erro: "Build failed"
```bash
# Limpar cache e rebuildar
vercel --force
```

### Erro: "Function too large"
- O limite do Vercel é 50MB por função
- Nosso projeto está bem abaixo disso

### QR Code não funciona no telemóvel
1. Verifique se o deploy foi concluído
2. Confirme que está usando URL pública (`https://...vercel.app`)
3. Teste abrindo a URL curta manualmente primeiro

### Database errors
⚠️ **IMPORTANTE**: SQLite não funciona bem no Vercel (filesystem efêmero)

**Solução**: Migrar para Vercel Postgres ou Vercel KV:
```bash
vercel storage create
```

---

## 📚 PRÓXIMOS PASSOS

1. ✅ Deploy concluído
2. ✅ QR Codes funcionam
3. ✅ Segurança ativada
4. 📊 Configurar Vercel Analytics (gratuito)
5. 🗄️ Migrar para Vercel Postgres (opcional)
6. 🔐 Adicionar autenticação (opcional)
7. 📧 Notificações de uso excessivo (opcional)

---

## 📞 SUPORTE

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Este projeto: GitHub Issues

---

**🎉 TUDO PRONTO! SEU ENCURTADOR ESTÁ SEGURO E FUNCIONANDO!**
