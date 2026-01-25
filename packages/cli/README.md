# @maestro-ai/cli

CLI para inicializar projetos **Maestro File System** - Orquestrador chat-first com workflows inteligentes.

## 🚀 Uso Rápido

```bash
npx @maestro-ai/cli
```

Só isso! O comando injeta automaticamente todos os arquivos do Maestro na pasta atual.

---

## ⚙️ Opções

| Opção | Descrição |
|-------|-----------|
| `--force` | Sobrescreve arquivos existentes |
| `--minimal` | Instala apenas workflows + rules |
| `--ide <ide>` | IDE alvo: `windsurf`, `cursor`, `antigravity`, `all` (default: `windsurf`) |

### Exemplos

```bash
# Instalação completa (Windsurf - padrão)
npx @maestro-ai/cli

# Apenas para Cursor
npx @maestro-ai/cli --ide cursor

# Apenas para Antigravity/Gemini
npx @maestro-ai/cli --ide antigravity

# Sobrescrever arquivos existentes
npx @maestro-ai/cli --force

# Instalação mínima
npx @maestro-ai/cli --minimal
```

---

## 📁 Estrutura Criada

```
projeto/
├── .maestro/
│   ├── config.json          # Configuração do projeto
│   ├── history/             # Histórico de conversas
│   └── content/             # Especialistas, templates, guides, prompts
├── .windsurf/
│   ├── skills/              # Skills especializadas
│   └── workflows/           # Workflows inteligentes
└── .windsurfrules           # Regras da IA para Windsurf
```

### Arquivos por IDE

| IDE | Estrutura Gerada |
|-----|------------------|
| Windsurf | `.windsurf/workflows/` + `.windsurf/skills/` + `.windsurfrules` |
| Cursor | `.cursor/commands/` + `.cursor/skills/` + `.cursorrules` |
| Antigravity | `.agent/workflows/` + `.agent/skills/` + `.gemini/GEMINI.md` |

---

## 🎯 Fluxo de Trabalho

O Maestro File System opera 100% localmente com workflows chat-first:

```mermaid
graph LR
    A[/maestro] --> B{Estado do projeto}
    B -->|Novo| C[/iniciar-projeto]
    B -->|Em andamento| D[/continuar-fase]
    B -->|Pronto| E[/avancar-fase]
    C --> F[Fase 1: Produto]
    D --> G[Retoma fase atual]
    E --> H[Próxima fase]
```

### Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `/maestro` | Workflow universal inteligente que detecta estado |
| `/iniciar-projeto` | Inicia novo projeto com classificação automática |
| `/continuar-fase` | Retoma a fase atual do ponto exato |
| `/avancar-fase` | Valida quality gates e avança para próxima fase |
| `/status-projeto` | Mostra progresso completo e métricas |

### Workflows de Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `/nova-feature` | Adiciona funcionalidades (fluxo 6 fases) |
| `/corrigir-bug` | Debugging estruturado (fluxo 4 fases) |
| `/refatorar-codigo` | Refatoração segura com testes |
| `/brainstorm` | Exploração estruturada de ideias |
| `/deploy` | Deploy em produção com checklist |
| `/testar` | Geração e execução de testes |

---

## 🔄 Como Funciona

1. **Estado Centralizado**: `.maestro/estado.json` mantém toda a evolução do projeto
2. **Workflows Inteligentes**: Cada workflow carrega especialistas, prompts e templates adequados
3. **Quality Gates**: Validações automáticas entre fases com regras específicas
4. **Multi-IDE**: Suporte nativo para Windsurf, Cursor e Antigravity

---

## 📋 Comandos CLI

### `init` (padrão)

```bash
npx @maestro-ai/cli init
npx @maestro-ai/cli init --ide cursor
npx @maestro-ai/cli init --force
```

### `update`

Atualiza content para a última versão:

```bash
npx @maestro-ai/cli update
npx @maestro-ai/cli update --force  # Sobrescreve arquivos modificados
```

---

## 🎨 Exemplo de Uso

```bash
# 1. Inicializar projeto
npx @maestro-ai/cli

# 2. No Windsurf/Cursor, iniciar projeto
/maestro
# → Detecta projeto não inicializado
# → Sugere /iniciar-projeto

# 3. Iniciar projeto
/iniciar-projeto
# → Coleta informações
# → Classifica complexidade
# → Cria estado inicial
# → Prepara Fase 1

# 4. Desenvolver
/continuar-fase
# → Carrega especialista de Gestão de Produto
# → Abre templates PRD.md
# → Orienta preenchimento

# 5. Avançar quando pronto
/avancar-fase
# → Valida quality gate
# → Atualiza estado
# → Prepara Fase 2
```

---

## 🛠️ Desenvolvimento

```bash
cd packages/cli
npm install
npm run build
npm run dev -- init --ide windsurf  # Testar localmente
```

---

## 📦 Publicação

```bash
npm version patch  # ou minor/major
npm publish
```

---

## 📄 Licença

MIT
