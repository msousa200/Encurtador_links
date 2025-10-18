# 🚀 DEPLOY MANUAL - PASSO A PASSO

## ✅ **O QUE JÁ ESTÁ PRONTO**

- ✅ Servidor com segurança completa (rate limiting, anti-SSRF, sanitização)
- ✅ Frontend com validações client-side
- ✅ Build do projeto funcionando (dist/ criado)
- ✅ QR Codes com detecção automática de URL
- ✅ Todas as proteções implementadas

---

## 🌐 **MÉTODO RECOMENDADO: Deploy via GitHub + Vercel**

### Passo 1: Criar repositório no GitHub

```bash
# Inicializar Git (se ainda não estiver)
git init
git add .
git commit -m "feat: Encurtador de URLs seguro com React + Express"
```

### Passo 2: Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `encurtador-links`
3. **NÃO** inicialize com README (já tens ficheiros)
4. Clique em "Create repository"

### Passo 3: Push para GitHub

```bash
# Substitua SEU_USUARIO pelo teu username do GitHub
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/encurtador-links.git
git push -u origin main
```

### Passo 4: Importar no Vercel

1. Acede a: https://vercel.com/new
2. Clica em **"Import Git Repository"**
3. Seleciona o repositório `encurtador-links`
4. Clica em **"Import"**

### Passo 5: Configurar Build

**Vercel vai detectar automaticamente**, mas confirma:

- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Passo 6: Environment Variables (Opcional)

Em **"Environment Variables"**, adiciona (OPCIONAL):

```
NODE_ENV=production
```

### Passo 7: Deploy

1. Clica em **"Deploy"**
2. Aguarda 2-3 minutos
3. Verás: ✅ **Deployment Complete**

### Passo 8: Testar

URL do projeto: `https://encurtador-links-xxxx.vercel.app`

1. Abre a URL
2. Cola um link longo
3. Clica em "Encurtar URL"
4. Ver QR Code
5. Escaneia com o telemóvel

---

## 📱 **TESTAR QR CODE**

### No telemóvel:

1. Abre a câmara
2. Aponta para o QR Code na tela do PC
3. Clica no link que aparece
4. Deve abrir a URL original ✅

---

## ⚠️ **PROBLEMA CONHECIDO: SQLite no Vercel**

O Vercel tem **filesystem efêmero** - o banco SQLite será limpo a cada deploy.

### **Soluções:**

#### **Opção 1: Vercel Postgres** (Recomendado)
```bash
# No dashboard do Vercel:
# Storage → Create Database → Postgres
# Copiar DATABASE_URL para Environment Variables
```

#### **Opção 2: Vercel KV** (Redis - Mais simples)
```bash
# No dashboard do Vercel:
# Storage → Create Database → KV
# Automaticamente configura variáveis
```

#### **Opção 3: Supabase** (Gratuito, fácil)
1. Criar conta em https://supabase.com
2. Criar projeto
3. Copiar Connection String
4. Adicionar em Environment Variables do Vercel

---

## 🔒 **VERIFICAR SEGURANÇA**

Após o deploy, testa:

### Teste 1: URL Normal
```bash
curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://google.com"}'
```

✅ Deve retornar: `{"success":true,"shortUrl":"https://..."}`

### Teste 2: URL Maliciosa (deve bloquear)
```bash
curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"http://localhost/admin"}'
```

✅ Deve retornar: `{"error":"URLs de redes privadas não são permitidas"}`

### Teste 3: Rate Limiting
```bash
# Fazer 15 requests rápidos
for i in {1..15}; do
  curl -X POST https://SEU_PROJETO.vercel.app/api/shorten \
    -H "Content-Type: application/json" \
    -d '{"originalUrl":"https://google.com"}' &
done
```

✅ Após 10 requests deve retornar: `{"error":"🚫 Muitos pedidos. Aguarde 1 minuto."}`

---

## 📊 **MONITORIZAÇÃO**

### Logs em tempo real:
```bash
npx vercel logs
```

### Analytics:
https://vercel.com/SEU_USUARIO/encurtador-links/analytics

### Uptime:
https://vercel.com/SEU_USUARIO/encurtador-links

---

## 🎯 **CUSTOM DOMAIN** (Opcional)

1. No Vercel Dashboard: **Settings → Domains**
2. Adiciona domínio (ex: `encurta.com`)
3. No teu DNS provider:
   - **Type**: `CNAME`
   - **Name**: `@`
   - **Value**: `cname.vercel-dns.com`
4. Aguarda propagação (até 48h)

---

## 🐛 **TROUBLESHOOTING**

### Erro: "Build Failed"
```bash
# Rebuildar localmente para ver o erro
npm run build
```

### Erro: "Module not found"
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### QR Code não funciona:
- Confirma que o deploy terminou
- Usa a URL pública do Vercel (https://...)
- Testa abrindo o link curto manualmente primeiro

### Database vazio após deploy:
- Normal! SQLite é efêmero no Vercel
- Migrar para Vercel Postgres ou Vercel KV

---

## ✅ **CHECKLIST FINAL**

- [ ] Código no GitHub
- [ ] Deploy no Vercel concluído
- [ ] URL pública funciona
- [ ] Encurtar URL funciona
- [ ] QR Code gerado
- [ ] QR Code funciona no telemóvel
- [ ] Rate limiting ativado
- [ ] URLs maliciosas bloqueadas
- [ ] Analytics funcionam

---

## 📞 **SUPORTE**

- Docs Vercel: https://vercel.com/docs
- Suporte Vercel: https://vercel.com/support
- GitHub Issues: https://github.com/SEU_USUARIO/encurtador-links/issues

---

**🎉 TUDO PRONTO! O PROJETO ESTÁ SEGURO E NO AR!**
