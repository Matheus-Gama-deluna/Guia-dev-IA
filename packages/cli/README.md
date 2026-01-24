# @maestro-ai/cli

CLI para inicializar projetos com Maestro - Desenvolvimento assistido por IA.

## Uso Rápido

```bash
npx @maestro-ai/cli
```

Só isso! O comando injeta automaticamente todos os arquivos na pasta atual.

## Opções

```bash
npx @maestro-ai/cli              # Instalação completa
npx @maestro-ai/cli --minimal    # Apenas workflows + GEMINI.md
npx @maestro-ai/cli --force      # Sobrescreve arquivos existentes
```

**O que é criado:**
- `.maestro/config.json` - Configuração do projeto
- `.maestro/content/` - Especialistas, templates, guides, prompts
- `.agent/skills/` - Skills para a IA
- `.agent/workflows/` - Workflows automatizados
- `GEMINI.md` - Rules para a IA

## Comandos Alternativos

### `init` (explícito)

```bash
npx @maestro-ai/cli init
npx @maestro-ai/cli init --force
```

### `update`

Atualiza content para a última versão:

```bash
npx @maestro-ai/cli update
npx @maestro-ai/cli update --force  # Sobrescreve arquivos modificados
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
