# 🔄 Como Limpar o Cache do Navegador

## Problema
O navegador está mostrando a versão antiga (com botão de Analytics) porque está usando o **cache**.

## ✅ Solução Rápida

### **Opção 1: Hard Refresh (Mais Rápido)**
Pressione no navegador:

- **Windows/Linux**: `Ctrl + Shift + R` ou `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### **Opção 2: Limpar Cache Completo**

#### Chrome/Edge/Brave:
1. Pressione `Ctrl + Shift + Delete` (ou `Cmd + Shift + Delete` no Mac)
2. Selecione "Imagens e arquivos em cache"
3. Período: "Última hora" ou "Sempre"
4. Clique em "Limpar dados"

#### Firefox:
1. Pressione `Ctrl + Shift + Delete`
2. Marque "Cache"
3. Clique em "Limpar agora"

### **Opção 3: Modo Anônimo/Privado**
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)
- Acesse `http://localhost:3000`

---

## 🎯 Verificar se Funcionou

Depois de limpar o cache:

1. ✅ **Favicon**: Deve aparecer o ícone roxo/azul com link no separador
2. ✅ **Analytics removido**: Não deve aparecer botão "📊 Ver Analytics Detalhado"
3. ✅ **Hero**: Deve ter o ícone de link no topo da página

---

## 🔧 Se Ainda Não Funcionar

Execute no terminal:
```bash
cd /home/msousa/Projetos/Encurtador_links
rm -rf node_modules/.vite
npm run dev
```

Isso força o Vite a reconstruir tudo do zero.
