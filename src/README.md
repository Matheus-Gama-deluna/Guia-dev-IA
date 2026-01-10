# MCP Maestro

Servidor MCP (Model Context Protocol) para o Maestro - Guia de Desenvolvimento Assistido por IA.

## 🌐 Servidor Público

O MCP Maestro está disponível publicamente em:

```
https://maestro.deluna.dev.br
```

### Verificar Status

```bash
curl https://maestro.deluna.dev.br/health
# Retorna: {"status":"ok","server":"mcp-maestro","version":"1.0.0"}
```

---

## 🔧 Configuração para IDEs e Clientes MCP

### Gemini / Antigravity (SSE Transport)

Adicione ao seu `mcp_config.json`:

```json
{
  "mcpServers": {
    "maestro": {
      "serverUrl": "https://maestro.deluna.dev.br/mcp"
    }
  }
}
```

> **Nota:** Este servidor suporta Streamable HTTP (SSE) para clientes que requerem conexão persistente.

### VS Code / Cursor / Windsurf

Adicione ao seu arquivo de configuração MCP (`mcp_config.json` ou equivalente):

```json
{
  "mcpServers": {
    "maestro": {
      "url": "https://maestro.deluna.dev.br/mcp",
      "transport": "http"
    }
  }
}
```

### Cline / Claude Desktop

Adicione ao seu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "maestro": {
      "command": "curl",
      "args": ["-X", "POST", "https://maestro.deluna.dev.br/mcp"]
    }
  }
}
```

### Chamada HTTP Direta

```bash
curl -X POST https://maestro.deluna.dev.br/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "status",
      "arguments": {}
    }
  }'
```

---

## 📡 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Informações do servidor |
| `/health` | GET | Health check |
| `/mcp` | POST | Endpoint MCP JSON-RPC |
| `/resources` | GET | Lista resources disponíveis |
| `/tools` | GET | Lista tools disponíveis |

---

## 🛠️ Tools Disponíveis

| Tool | Descrição |
|------|-----------|
| `iniciar_projeto` | Inicia um novo projeto com classificação |
| `proximo` | Salva entregável e avança para próxima fase |
| `status` | Retorna status atual do projeto |
| `validar_gate` | Valida checklist antes de avançar fase |
| `contexto` | Obtém contexto completo do projeto |
| `salvar` | Salva artefatos do projeto |
| `nova_feature` | Fluxo para adicionar nova feature |
| `corrigir_bug` | Fluxo para correção de bugs |
| `refatorar` | Fluxo para refatoração de código |

---

## 📚 Resources Disponíveis

| URI | Descrição |
|-----|-----------|
| `maestro://especialista/{nome}` | Especialistas de IA |
| `maestro://template/{nome}` | Templates de documentos |
| `maestro://guia/{nome}` | Guias práticos |
| `maestro://prompt/{categoria}/{nome}` | Prompts especializados |
| `maestro://system-prompt` | System prompt do Maestro |

---

## 💻 Desenvolvimento Local

### Instalação

```bash
cd mcp-server
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build e Produção

```bash
npm run build
npm start
```

### Docker

```bash
# Produção
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## 📋 Exemplo de Fluxo Completo

```bash
# 1. Iniciar projeto
curl -X POST https://maestro.deluna.dev.br/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "iniciar_projeto",
      "arguments": {
        "nome": "meu-projeto",
        "classificacao": "mvp"
      }
    }
  }'

# 2. Ver status
curl https://maestro.deluna.dev.br/tools

# 3. Listar especialistas disponíveis
curl https://maestro.deluna.dev.br/resources
```
