# MCP Maestro

Servidor **MCP (Model Context Protocol)** para desenvolvimento assistido por IA.

[![Status](https://img.shields.io/badge/status-online-success)](https://maestro.deluna.dev.br/health)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Servidor Público

```
https://maestro.deluna.dev.br
```

```bash
# Verificar status
curl https://maestro.deluna.dev.br/health
```

---

## 🔧 Configuração

### Gemini / Antigravity

```json
{
  "mcpServers": {
    "maestro": {
      "serverUrl": "https://maestro.deluna.dev.br/mcp"
    }
  }
}
```

### VS Code / Cursor / Windsurf

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

### HTTP Direto

```bash
curl -X POST https://maestro.deluna.dev.br/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'
```

---

## 📡 Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Info do servidor |
| `/health` | GET | Health check |
| `/mcp` | GET | SSE connection (Streamable HTTP) |
| `/mcp` | POST | JSON-RPC endpoint |
| `/resources` | GET | Lista resources |
| `/tools` | GET | Lista tools |

---

## 🛠️ Tools Disponíveis

| Tool | Descrição |
|------|-----------|
| `iniciar_projeto` | Inicia novo projeto com classificação |
| `proximo` | Salva entregável e avança fase |
| `status` | Retorna status do projeto |
| `validar_gate` | Valida checklist da fase |
| `contexto` | Obtém contexto completo |
| `salvar` | Salva artefatos |
| `nova_feature` | Fluxo para nova feature |
| `corrigir_bug` | Fluxo para correção de bugs |
| `refatorar` | Fluxo para refatoração |

---

## 📚 Resources

| URI | Descrição |
|-----|-----------|
| `maestro://especialista/{nome}` | Especialistas de IA |
| `maestro://template/{nome}` | Templates de documentos |
| `maestro://guia/{nome}` | Guias práticos |
| `maestro://prompt/{categoria}/{nome}` | Prompts especializados |
| `maestro://system-prompt` | System prompt do Maestro |

---

## 📁 Estrutura do Projeto

```
├── src/                    # Código do servidor MCP
│   ├── src/               # Código fonte TypeScript
│   ├── package.json
│   └── tsconfig.json
│
├── content/               # Conteúdo para IA
│   ├── playbook/         # Playbook de desenvolvimento
│   ├── specialists/      # Especialistas de IA
│   ├── guides/           # Guias práticos
│   ├── prompts/          # Prompts especializados
│   └── templates/        # Templates de documentos
│
├── docs/                  # Documentação técnica
│
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
cd src && npm install

# Desenvolvimento
npm run dev

# Build
npm run build && npm start
```

### Docker

```bash
# Produção
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## 📖 Documentação

- [Quickstart](docs/QUICKSTART.md)
- [Instruções de Uso](docs/INSTRUCOES_DE_USO.md)
- [Especificação MCP](docs/MCP_ESPECIFICACAO.md)
- [Guia de Desenvolvimento MCP](docs/MCP_GUIA_DESENVOLVIMENTO.md)

---

## 🤝 Contribuição

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 Licença

MIT License
