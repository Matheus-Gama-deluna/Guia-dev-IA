# @maestro/cli

CLI para inicializar projetos com Maestro - Desenvolvimento assistido por IA.

## Instalação

```bash
npx @maestro init
```

## Comandos

### `init`

Inicializa Maestro no projeto atual:

```bash
npx @maestro init          # Instalação completa
npx @maestro init --minimal # Apenas workflows + GEMINI.md
npx @maestro init --force   # Sobrescreve arquivos existentes
```

**O que é criado:**
- `.maestro/config.json` - Configuração do projeto
- `content/` - Especialistas, templates, guides
- `.agent/workflows/` - Workflows automatizados
- `GEMINI.md` - Rules para a IA

### `update`

Atualiza content para a última versão:

```bash
npx @maestro update
npx @maestro update --force  # Sobrescreve arquivos modificados
```

## Após Inicialização

Configure o MCP na sua IDE:

```json
{
  "mcpServers": {
    "maestro": {
      "serverUrl": "https://maestro.deluna.dev.br/mcp"
    }
  }
}
```

## Desenvolvimento

```bash
cd packages/cli
npm install
npm run build
npm run dev -- init  # Testar localmente
```
