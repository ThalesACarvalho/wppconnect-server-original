# 📊 Sistema de Logs do Chatwoot

## ✅ Implementação Concluída

Foi adicionado um sistema completo de logs para monitorar a conexão e operações do Chatwoot.

## 🔍 Logs Implementados

### 1. **Inicialização do Chatwoot Client**

Quando uma sessão é iniciada com configuração do Chatwoot, você verá:

```
ℹ️  [Chatwoot:minha_sessao] 🔗 Chatwoot Client inicializado para sessão: minha_sessao
ℹ️  [Chatwoot:minha_sessao] 📍 Base URL: https://app.chatwoot.com
ℹ️  [Chatwoot:minha_sessao] 🏢 Account ID: 1
ℹ️  [Chatwoot:minha_sessao] 📥 Inbox ID: 2
ℹ️  [Chatwoot:minha_sessao] 📱 Mobile: WPPConnect (5511999999999)
```

### 2. **Teste de Conexão (Automático)**

Logo após a inicialização, o sistema testa a conexão automaticamente:

#### ✅ Sucesso:
```
ℹ️  [Chatwoot:minha_sessao] 🔍 Testando conexão com Chatwoot...
✅ [Chatwoot:minha_sessao] ✓ Conexão estabelecida com sucesso!
✅ [Chatwoot:minha_sessao] ✓ Conta: Minha Empresa
✅ [Chatwoot:minha_sessao] ✓ Status: Online
```

#### ❌ Falha (Token Inválido):
```
ℹ️  [Chatwoot:minha_sessao] 🔍 Testando conexão com Chatwoot...
❌ [Chatwoot:minha_sessao] ✗ Falha ao conectar com Chatwoot
❌ [Chatwoot:minha_sessao] ✗ Status: 401
❌ [Chatwoot:minha_sessao] ✗ Mensagem: Unauthorized
❌ [Chatwoot:minha_sessao] ✗ Token de API inválido ou expirado
```

#### ❌ Falha (Account ID Inválido):
```
ℹ️  [Chatwoot:minha_sessao] 🔍 Testando conexão com Chatwoot...
❌ [Chatwoot:minha_sessao] ✗ Falha ao conectar com Chatwoot
❌ [Chatwoot:minha_sessao] ✗ Status: 404
❌ [Chatwoot:minha_sessao] ✗ Mensagem: Not Found
❌ [Chatwoot:minha_sessao] ✗ Account ID não encontrado
```

#### ❌ Falha (Erro de Rede):
```
ℹ️  [Chatwoot:minha_sessao] 🔍 Testando conexão com Chatwoot...
❌ [Chatwoot:minha_sessao] ✗ Falha ao conectar com Chatwoot
❌ [Chatwoot:minha_sessao] ✗ Erro de conexão: Não foi possível alcançar o servidor Chatwoot
❌ [Chatwoot:minha_sessao] ✗ Verifique se a URL está correta: https://app.chatwoot.com
```

### 3. **Criação/Busca de Contatos**

#### Contato Existente:
```
ℹ️  [Chatwoot:minha_sessao] ✓ Contato encontrado: João Silva (+5511999999999)
```

#### Novo Contato:
```
ℹ️  [Chatwoot:minha_sessao] 📝 Criando novo contato: Maria Santos (+5511888888888)
✅ [Chatwoot:minha_sessao] ✓ Contato criado com sucesso: Maria Santos
```

#### Erro ao Criar Contato:
```
❌ [Chatwoot:minha_sessao] ✗ Erro ao criar contato: João Silva
```

### 4. **Criação/Busca de Conversações**

#### Conversação Existente:
```
ℹ️  [Chatwoot:minha_sessao] ✓ Conversação existente encontrada: ID 12345
```

#### Nova Conversação:
```
ℹ️  [Chatwoot:minha_sessao] 📝 Criando nova conversação para contato Maria Santos
✅ [Chatwoot:minha_sessao] ✓ Conversação criada com sucesso: ID 12346
```

### 5. **Envio de Mensagens**

#### Mensagem de Texto:
```
✅ [Chatwoot:minha_sessao] ✓ Mensagem enviada para Chatwoot
```

#### Mensagem com Mídia:
```
✅ [Chatwoot:minha_sessao] ✓ Mídia enviada para Chatwoot (image): 1638360000.jpg
```

#### Erro ao Enviar:
```
❌ [Chatwoot:minha_sessao] ✗ Erro ao enviar mensagem para Chatwoot
❌ [Chatwoot:minha_sessao] ✗ Status: 500
```

## 📝 Exemplo de Fluxo Completo

Quando você inicia uma sessão e recebe uma mensagem, verá algo assim:

```
ℹ️  [Chatwoot:vendas01] 🔗 Chatwoot Client inicializado para sessão: vendas01
ℹ️  [Chatwoot:vendas01] 📍 Base URL: https://app.chatwoot.com
ℹ️  [Chatwoot:vendas01] 🏢 Account ID: 1
ℹ️  [Chatwoot:vendas01] 📥 Inbox ID: 2
ℹ️  [Chatwoot:vendas01] 📱 Mobile: Atendimento WhatsApp (5511999999999)
ℹ️  [Chatwoot:vendas01] 🔍 Testando conexão com Chatwoot...
✅ [Chatwoot:vendas01] ✓ Conexão estabelecida com sucesso!
✅ [Chatwoot:vendas01] ✓ Conta: Viper Chat
✅ [Chatwoot:vendas01] ✓ Status: Online

... (sessão conecta ao WhatsApp) ...

ℹ️  [Chatwoot:vendas01] 📝 Criando novo contato: João Cliente (+5511987654321)
✅ [Chatwoot:vendas01] ✓ Contato criado com sucesso: João Cliente
ℹ️  [Chatwoot:vendas01] 📝 Criando nova conversação para contato João Cliente
✅ [Chatwoot:vendas01] ✓ Conversação criada com sucesso: ID 789
✅ [Chatwoot:vendas01] ✓ Mensagem enviada para Chatwoot
```

## 🔧 Como Visualizar os Logs

### Em Desenvolvimento (Yarn):
```bash
yarn dev
```

Os logs aparecem no console com emojis e cores.

### Em Produção (Docker):
```bash
docker logs -f nome_do_container
```

### Em Produção (PM2):
```bash
pm2 logs wppconnect-server
```

## 📊 Níveis de Log

Os logs usam o sistema de logging do WPPConnect:
- **Info** (ℹ️): Informações gerais de operação
- **Success** (✅): Operações bem-sucedidas
- **Error** (❌): Erros e falhas

## 🐛 Troubleshooting com Logs

### Problema: "Token de API inválido ou expirado"

**Log:**
```
❌ [Chatwoot:sessao] ✗ Token de API inválido ou expirado
```

**Solução:**
1. Verifique se o token está correto
2. Gere um novo token no Chatwoot: Settings → Applications → API Access Tokens

### Problema: "Account ID não encontrado"

**Log:**
```
❌ [Chatwoot:sessao] ✗ Account ID não encontrado
```

**Solução:**
1. Verifique o Account ID na URL do Chatwoot
2. URL exemplo: `https://app.chatwoot.com/app/accounts/1/` (Account ID = 1)

### Problema: "Erro de conexão"

**Log:**
```
❌ [Chatwoot:sessao] ✗ Erro de conexão: Não foi possível alcançar o servidor Chatwoot
```

**Solução:**
1. Verifique se a `baseURL` está correta
2. Teste a URL no navegador
3. Verifique firewall/proxy
4. Confirme que o Chatwoot está online

### Problema: "Falha ao criar/buscar contato"

**Log:**
```
❌ [Chatwoot:sessao] ✗ Falha ao criar/buscar contato no Chatwoot
```

**Solução:**
1. Verifique se o Inbox ID está correto
2. Confirme que a inbox aceita o canal API
3. Verifique permissões do token

## ✨ Benefícios do Sistema de Logs

1. ✅ **Diagnóstico Rápido**: Identifique problemas de conexão imediatamente
2. ✅ **Monitoramento**: Acompanhe todas as operações em tempo real
3. ✅ **Debugging**: Logs detalhados para resolver problemas
4. ✅ **Auditoria**: Rastreie todas as mensagens enviadas/recebidas
5. ✅ **Proativo**: Detecte falhas antes que afetem os usuários

## 📋 Checklist de Validação

Ao iniciar uma sessão com Chatwoot, verifique:

- [ ] ✅ Log de inicialização aparece com configurações corretas
- [ ] ✅ Teste de conexão é executado automaticamente
- [ ] ✅ Mensagem de sucesso "Conexão estabelecida com sucesso!"
- [ ] ✅ Nome da conta do Chatwoot é exibido
- [ ] ❌ Se houver erro, mensagem clara indica o problema
- [ ] ✅ Mensagens são enviadas e logs confirmam o sucesso
- [ ] ✅ Contatos e conversações são criados com logs

## 🚀 JSON de Exemplo

```json
{
  "waitQrCode": true,
  "chatWoot": {
    "sendQrCode": true,
    "sendStatus": true,
    "baseURL": "https://app.chatwoot.com",
    "token": "seu_token_aqui",
    "account_id": "1",
    "inbox_id": "2",
    "mobile_name": "Atendimento WhatsApp",
    "mobile_number": "5511999999999"
  }
}
```

## 📊 Formato dos Logs

Todos os logs seguem o padrão:
```
[EMOJI] [Chatwoot:SESSAO] MENSAGEM
```

Exemplo:
```
✅ [Chatwoot:vendas01] ✓ Conexão estabelecida com sucesso!
```

Onde:
- **EMOJI**: Indica o tipo (ℹ️ Info, ✅ Sucesso, ❌ Erro)
- **Chatwoot**: Identifica que é do módulo Chatwoot
- **vendas01**: Nome da sessão
- **MENSAGEM**: Descrição da operação

---

**Desenvolvido por:** Cursor AI Assistant  
**Data:** 2025-12-01  
**Versão:** 2.0

