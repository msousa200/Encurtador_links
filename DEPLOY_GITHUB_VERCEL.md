# 🚀 Deploy no Vercel via GitHub

## ✅ Código já está no GitHub!

Repositório: https://github.com/msousa200/Encurtador_links

---

## 📋 Passos para Deploy no Vercel

### **1. Acesse o Vercel**
🔗 https://vercel.com

- Faça login com sua conta GitHub (msousa200)

### **2. Import Project**
1. Clique em **"Add New..."** → **"Project"**
2. Selecione **"Import Git Repository"**
3. Escolha: `msousa200/Encurtador_links`
4. Clique em **"Import"**

### **3. Configurar Build Settings**

#### ✅ Framework Preset:
- Selecione: **Vite**

#### ✅ Build Command:
```bash
npm run build
```

#### ✅ Output Directory:
```
dist
```

#### ✅ Install Command:
```bash
npm install
```

### **4. Environment Variables (IMPORTANTE!)**

Adicione esta variável:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |

### **5. Deploy!**

Clique em **"Deploy"** e aguarde 2-3 minutos.

---

## 🎯 Depois do Deploy

Você receberá uma URL tipo:
- `https://encurtador-links.vercel.app`
- ou `https://encurtador-links-xxx.vercel.app`

### ✅ Verificar se funciona:

1. **Abra a URL** do Vercel
2. **Teste encurtar** uma URL
3. **Teste o QR Code** no telemóvel
4. **Verifique** se o redirecionamento funciona

---

## 🔧 Configuração Automática

O Vercel já vai:
- ✅ Detectar `vercel.json` (já configurado)
- ✅ Usar SQLite em memória (fallback automático)
- ✅ Configurar CORS e headers de segurança
- ✅ Ativar rate limiting
- ✅ Gerar QR codes com URL correta

---

## 🔄 Deploy Automático

A partir de agora, **SEMPRE** que você fizer:

```bash
git add .
git commit -m "Nova feature"
git push
```

O Vercel **automaticamente faz deploy** da nova versão! 🚀

---

## 🆘 Se Algo Der Errado

1. Verifique os **Logs** no Vercel Dashboard
2. Confira se `vercel.json` está correto
3. Teste localmente com `npm run build` antes de fazer push

---

## 📱 Testar QR Code no Telemóvel

1. Acesse a URL do Vercel no PC
2. Encurte uma URL qualquer
3. **Aponte o telemóvel** para o QR Code
4. Deve abrir a URL original

---

## 🎉 Pronto!

Depois do deploy, você terá:
- ✅ Site no ar 24/7
- ✅ SSL grátis (HTTPS)
- ✅ Deploy automático a cada commit
- ✅ URL personalizada (pode configurar domínio próprio depois)
- ✅ Analytics do Vercel

**Bom deploy!** 🚀
