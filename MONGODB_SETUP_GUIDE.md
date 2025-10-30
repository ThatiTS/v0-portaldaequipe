# 🚀 Guia de Configuração MongoDB - Portal da Equipe

## ✅ Credenciais Configuradas

- **Cluster:** cluster0.suk3y4n.mongodb.net
- **Usuário:** di01
- **Senha:** 0hSNqpUXuR9jAtED
- **Database:** PortalDaEquipe

## 📋 Passo a Passo

### 1. Instalar Dependências

\`\`\`bash
npm install mongodb bcryptjs
npm install -D @types/bcryptjs tsx
\`\`\`

### 2. Testar Conexão

\`\`\`bash
npx tsx scripts/testConnection.ts
\`\`\`

**Resultado esperado:**
\`\`\`
✅ Conectado ao MongoDB Atlas!
✅ Ping bem-sucedido!
📚 Databases disponíveis
\`\`\`

### 3. Inicializar Database

\`\`\`bash
npx tsx scripts/initMongoDB.ts
\`\`\`

**Isso vai criar:**
- ✅ Collection `users` (usuários do sistema)
- ✅ Collection `chamados` (tickets TEI/RH/Financeiro)
- ✅ Collection `eventos` (calendário)
- ✅ Collection `salas` (agendamento de salas)
- ✅ Collection `reservas` (reservas de salas)
- ✅ Collection `cursos` (treinamentos)

### 4. Verificar no MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Vá em **Database** → **Browse Collections**
3. Selecione o database **PortalDaEquipe**
4. Você verá todas as collections criadas

## 🎯 Próximos Passos

### Opção A: Popular com Dados de Teste

Criar um script `seedData.ts` para adicionar usuários e dados de exemplo.

### Opção B: Integrar com Componentes React

Substituir `localStorage` por chamadas ao MongoDB nos componentes:

**Exemplo - Antes (localStorage):**
\`\`\`typescript
const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
\`\`\`

**Exemplo - Depois (MongoDB):**
\`\`\`typescript
const response = await fetch('/api/eventos');
const eventos = await response.json();
\`\`\`

## 📁 Arquivos Criados

- ✅ `/lib/mongodb.ts` - Conexão singleton com MongoDB
- ✅ `/scripts/initMongoDB.ts` - Inicializar collections e índices
- ✅ `/scripts/testConnection.ts` - Testar conexão
- ✅ `/.env.local` - Variáveis de ambiente

## 🔧 Troubleshooting

### Erro: "MongoServerError: bad auth"
- Verifique usuário e senha no MongoDB Atlas
- Vá em **Database Access** e confirme as credenciais

### Erro: "MongoServerError: IP not whitelisted"
- Vá em **Network Access** no MongoDB Atlas
- Adicione seu IP ou use `0.0.0.0/0` (todos os IPs)

### Erro: "Cannot find module 'mongodb'"
\`\`\`bash
npm install mongodb
\`\`\`

## 📊 Status Atual

| Item | Status |
|------|--------|
| Conexão MongoDB | ✅ Configurada |
| Collections | ⏳ Executar initMongoDB.ts |
| Dados de teste | ⏳ Opcional |
| Integração React | ⏳ Próximo passo |

## 🎉 Conclusão

Sua integração MongoDB está **configurada e pronta**! 

Execute os comandos acima para inicializar o banco de dados.
