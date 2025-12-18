# Especificação Técnica: MCP Guia-dev-IA

Documento detalhado para criação do MCP Server que automatiza o uso do Guia-dev-IA.

---

## 1. Visão Geral

### O que é MCP?

**Model Context Protocol (MCP)** é um protocolo aberto que permite que LLMs acessem contexto externo (arquivos, APIs, ferramentas) de forma estruturada. É suportado nativamente pelo Claude Desktop e pode ser integrado a outras ferramentas.

### Objetivo do MCP Guia-dev-IA

Criar um servidor MCP que:
1. **Guia o desenvolvedor** pelo fluxo correto de desenvolvimento
2. **Injeta contexto** dos especialistas automaticamente
3. **Persiste entregáveis** em estrutura organizada
4. **Mantém estado** do projeto entre sessões

---

## 2. Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (IDE/Claude)                    │
├─────────────────────────────────────────────────────────────┤
│                              │                              │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    MCP SERVER                         │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │  RESOURCES  │  │    TOOLS    │  │   PROMPTS   │   │ │
│  │  │             │  │             │  │             │   │ │
│  │  │ • guia://   │  │ • iniciar   │  │ • discovery │   │ │
│  │  │   especial- │  │ • proximo   │  │ • requisitos│   │ │
│  │  │   ista/{n}  │  │ • salvar    │  │ • arquitet. │   │ │
│  │  │ • guia://   │  │ • status    │  │             │   │ │
│  │  │   contexto  │  │ • contexto  │  │             │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  │                         │                             │ │
│  │                         ▼                             │ │
│  │  ┌───────────────────────────────────────────────────┐│ │
│  │  │              STATE MANAGER                        ││ │
│  │  │  • Fase atual do projeto                          ││ │
│  │  │  • Entregáveis gerados                            ││ │
│  │  │  • Contexto acumulado                             ││ │
│  │  └───────────────────────────────────────────────────┘│ │
│  │                         │                             │ │
│  │                         ▼                             │ │
│  │  ┌───────────────────────────────────────────────────┐│ │
│  │  │              FILE SYSTEM                          ││ │
│  │  │  • Guia-dev-IA (especialistas, guias)             ││ │
│  │  │  • Projeto do usuário (docs/, src/)               ││ │
│  │  └───────────────────────────────────────────────────┘│ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estrutura do Projeto

```
mcp-guia-dev-ia/
├── src/
│   ├── index.ts                 # Entry point do MCP Server
│   ├── server.ts                # Configuração do servidor
│   │
│   ├── resources/               # Handlers de Resources
│   │   ├── index.ts
│   │   ├── especialistas.ts     # Lê especialistas do guia
│   │   ├── guias.ts             # Lê guias do guia
│   │   ├── prompts.ts           # Lê templates de prompts
│   │   └── contexto.ts          # Lê contexto do projeto
│   │
│   ├── tools/                   # Handlers de Tools
│   │   ├── index.ts
│   │   ├── iniciar-projeto.ts   # Inicia novo projeto
│   │   ├── nova-feature.ts      # Inicia fluxo de feature
│   │   ├── corrigir-bug.ts      # Inicia fluxo de debug
│   │   ├── refatorar.ts         # Inicia fluxo de refatoração
│   │   ├── proximo.ts           # Avança para próxima fase
│   │   ├── status.ts            # Retorna status atual
│   │   ├── salvar.ts            # Salva entregável
│   │   └── contexto.ts          # Retorna contexto completo
│   │
│   ├── prompts/                 # Prompts dinâmicos
│   │   ├── index.ts
│   │   └── templates.ts
│   │
│   ├── flows/                   # Definição dos fluxos
│   │   ├── index.ts
│   │   ├── novo-projeto.ts      # 10 fases
│   │   ├── nova-feature.ts      # 6 fases
│   │   ├── corrigir-bug.ts      # 5 fases
│   │   └── refatorar.ts         # 6 fases
│   │
│   ├── state/                   # Gerenciamento de estado
│   │   ├── index.ts
│   │   ├── projeto.ts           # Estado do projeto
│   │   └── storage.ts           # Persistência em JSON
│   │
│   ├── templates/               # Templates de documentos
│   │   ├── prd.md
│   │   ├── requisitos.md
│   │   ├── arquitetura.md
│   │   └── contexto.md
│   │
│   └── utils/                   # Utilitários
│       ├── files.ts             # Manipulação de arquivos
│       └── markdown.ts          # Parser de markdown
│
├── guia/                        # Symlink para Guia-dev-IA
│
├── tests/                       # Testes
│   ├── tools.test.ts
│   └── flows.test.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Especificação das Resources

### 4.1 guia://especialista/{nome}

Retorna conteúdo de um especialista.

```typescript
// URI: guia://especialista/gestao-de-produto
// Retorna: Conteúdo do arquivo Especialista em Gestão de Produto.md
```

### 4.2 guia://guia/{nome}

Retorna conteúdo de um guia.

```typescript
// URI: guia://guia/debugging
// Retorna: Conteúdo do arquivo Guia de Debugging com IA.md
```

### 4.3 guia://prompt/{area}/{nome}

Retorna template de prompt.

```typescript
// URI: guia://prompt/produto/discovery
// Retorna: Conteúdo de 05-prompts/produto/discovery-inicial.txt
```

### 4.4 guia://projeto/contexto

Retorna contexto atual do projeto.

```typescript
// URI: guia://projeto/contexto
// Retorna: Conteúdo de .guia/contexto.md do projeto atual
```

### 4.5 guia://projeto/estado

Retorna estado do fluxo.

```typescript
// URI: guia://projeto/estado
// Retorna: JSON com fase atual, entregáveis, etc.
```

---

## 5. Especificação das Tools

### 5.1 iniciar_projeto

Inicia um novo projeto com fluxo de 10 fases.

```typescript
interface IniciarProjetoInput {
  nome: string;           // Nome do projeto
  descricao: string;      // Descrição da ideia
  diretorio?: string;     // Diretório do projeto (default: cwd)
}

interface IniciarProjetoOutput {
  projeto_id: string;
  fase_atual: number;
  total_fases: number;
  especialista: string;   // Conteúdo do especialista da fase 1
  prompt_sugerido: string;
  entregavel_esperado: string;
}
```

**Ações:**
1. Cria estrutura `.guia/` e `docs/` no diretório
2. Inicializa `estado.json` com fase 1
3. Retorna contexto do Especialista em Gestão de Produto

### 5.2 nova_feature

Inicia fluxo de nova funcionalidade em projeto existente.

```typescript
interface NovaFeatureInput {
  descricao: string;      // Descrição da feature
}

interface NovaFeatureOutput {
  contexto_projeto: string;  // Resumo do projeto existente
  analise_impacto: string;   // Entidades/endpoints afetados
  fase_atual: number;
  especialista: string;
}
```

**Ações:**
1. Lê `.guia/contexto.md` para entender o projeto
2. Lê `docs/04-modelo/modelo-dominio.md` para entidades
3. Analisa impacto da feature
4. Inicia fluxo de 6 fases

### 5.3 corrigir_bug

Inicia fluxo de debugging.

```typescript
interface CorrigirBugInput {
  descricao: string;      // Descrição do bug
  stack_trace?: string;   // Stack trace se disponível
  arquivo?: string;       // Arquivo com problema
}

interface CorrigirBugOutput {
  contexto_projeto: string;
  especialista: string;   // Guia de Debugging
  prompt_analise: string;
}
```

### 5.4 proximo

Avança para a próxima fase do fluxo.

```typescript
interface ProximoInput {
  entregavel?: string;    // Conteúdo do entregável (opcional, se não salvo)
}

interface ProximoOutput {
  fase_anterior: number;
  fase_atual: number;
  total_fases: number;
  especialista: string;   // Novo especialista
  prompt_sugerido: string;
  entregavel_esperado: string;
  contexto_acumulado: string;  // Resumo das fases anteriores
}
```

**Ações:**
1. Valida se fase atual está completa
2. Salva entregável se fornecido
3. Atualiza `estado.json`
4. Atualiza `contexto.md` com resumo
5. Carrega próximo especialista

### 5.5 status

Retorna status atual do projeto.

```typescript
interface StatusOutput {
  projeto: string;
  tipo_fluxo: "novo_projeto" | "feature" | "bug" | "refatoracao";
  fase_atual: number;
  total_fases: number;
  fases_completas: number[];
  entregaveis: Record<string, string>;  // nome -> caminho
  proxima_acao: string;
}
```

### 5.6 salvar

Salva entregável da fase atual.

```typescript
interface SalvarInput {
  conteudo: string;       // Conteúdo do entregável
  nome_arquivo?: string;  // Nome (usa default da fase se não informado)
}

interface SalvarOutput {
  caminho: string;        // Caminho onde foi salvo
  fase_completa: boolean;
}
```

### 5.7 contexto

Retorna contexto completo para injeção em prompts.

```typescript
interface ContextoOutput {
  resumo: string;         // Resumo do projeto
  stack: string;          // Stack tecnológica
  modelo: string;         // Entidades principais
  arquitetura: string;    // Visão arquitetural
  fase_atual: string;     // Fase e expectativa
}
```

---

## 6. Definição dos Fluxos

### 6.1 Fluxo: Novo Projeto (10 fases)

```typescript
const FLUXO_NOVO_PROJETO = [
  {
    fase: 1,
    nome: "Definição do Produto",
    especialista: "Especialista em Gestão de Produto.md",
    entregavel: "docs/01-produto/PRD.md",
    template: "templates/prd.md",
    prompt: "prompts/produto/discovery-inicial.txt"
  },
  {
    fase: 2,
    nome: "Engenharia de Requisitos",
    especialista: "Especialista em Engenharia de Requisitos com IA.md",
    entregavel: "docs/02-requisitos/requisitos.md",
    contexto_necessario: ["docs/01-produto/PRD.md"]
  },
  {
    fase: 3,
    nome: "Design de UX",
    especialista: "Especialista em UX Design.md",
    entregavel: "docs/03-ux/design-doc.md",
    contexto_necessario: ["docs/01-produto/PRD.md", "docs/02-requisitos/requisitos.md"]
  },
  {
    fase: 4,
    nome: "Modelagem de Domínio",
    especialista: "Especialista em Modelagem e Arquitetura de Domínio com IA.md",
    entregavel: "docs/04-modelo/modelo-dominio.md",
    contexto_necessario: ["docs/02-requisitos/requisitos.md"]
  },
  {
    fase: 5,
    nome: "Arquitetura de Software",
    especialista: "Especialista em Arquitetura de Software.md",
    entregavel: "docs/05-arquitetura/arquitetura.md",
    contexto_necessario: ["docs/02-requisitos/requisitos.md", "docs/04-modelo/modelo-dominio.md"]
  },
  {
    fase: 6,
    nome: "Segurança",
    especialista: "Especialista em Segurança da Informação.md",
    entregavel: "docs/06-seguranca/checklist-seguranca.md",
    contexto_necessario: ["docs/05-arquitetura/arquitetura.md"]
  },
  {
    fase: 7,
    nome: "Plano de Testes",
    especialista: "Especialista em Análise de Testes.md",
    entregavel: "docs/07-testes/plano-testes.md",
    contexto_necessario: ["docs/02-requisitos/requisitos.md"]
  },
  {
    fase: 8,
    nome: "Plano de Execução",
    especialista: "Especialista em Plano de Execução com IA.md",
    entregavel: "docs/08-backlog/backlog.md",
    contexto_necessario: ["docs/02-requisitos/requisitos.md", "docs/05-arquitetura/arquitetura.md"]
  },
  {
    fase: 9,
    nome: "Implementação",
    especialista: "Especialista em Desenvolvimento e Vibe Coding Estruturado.md",
    entregavel: "src/",
    contexto_necessario: ["docs/04-modelo/modelo-dominio.md", "docs/05-arquitetura/arquitetura.md", "docs/08-backlog/backlog.md"]
  },
  {
    fase: 10,
    nome: "DevOps e Deploy",
    especialista: "Especialista em DevOps e Infraestrutura.md",
    entregavel: [".github/workflows/", "Dockerfile", "infra/"],
    contexto_necessario: ["docs/05-arquitetura/arquitetura.md"]
  }
];
```

### 6.2 Fluxo: Nova Feature (6 fases)

```typescript
const FLUXO_NOVA_FEATURE = [
  { fase: 1, nome: "Análise de Impacto", especialista: "Guia de Adição de Novas Funcionalidades.md" },
  { fase: 2, nome: "Refinamento de Requisitos", especialista: "Especialista em Engenharia de Requisitos com IA.md" },
  { fase: 3, nome: "Atualização de Modelo", especialista: "Especialista em Modelagem e Arquitetura de Domínio com IA.md" },
  { fase: 4, nome: "Implementação", especialista: "Especialista em Desenvolvimento e Vibe Coding Estruturado.md" },
  { fase: 5, nome: "Testes", especialista: "Especialista em Análise de Testes.md" },
  { fase: 6, nome: "Deploy", especialista: "Especialista em DevOps e Infraestrutura.md" }
];
```

### 6.3 Fluxo: Correção de Bug (5 fases)

```typescript
const FLUXO_CORRIGIR_BUG = [
  { fase: 1, nome: "Coleta de Contexto", especialista: "Guia de Debugging com IA.md" },
  { fase: 2, nome: "Análise de Causa", especialista: "Guia de Debugging com IA.md" },
  { fase: 3, nome: "Implementação do Fix", especialista: "Especialista em Desenvolvimento e Vibe Coding Estruturado.md" },
  { fase: 4, nome: "Teste de Regressão", especialista: "Especialista em Análise de Testes.md" },
  { fase: 5, nome: "Validação de Segurança", especialista: "Especialista em Segurança da Informação.md" }
];
```

### 6.4 Fluxo: Refatoração (6 fases)

```typescript
const FLUXO_REFATORAR = [
  { fase: 1, nome: "Análise do Legado", especialista: "Guia de Refatoração de Código Legado com IA.md" },
  { fase: 2, nome: "Testes de Caracterização", especialista: "Especialista em Análise de Testes.md" },
  { fase: 3, nome: "Arquitetura Alvo", especialista: "Especialista em Arquitetura de Software.md" },
  { fase: 4, nome: "Refatoração Incremental", especialista: "Especialista em Desenvolvimento e Vibe Coding Estruturado.md" },
  { fase: 5, nome: "Validação de Segurança", especialista: "Especialista em Segurança da Informação.md" },
  { fase: 6, nome: "Deploy", especialista: "Especialista em DevOps e Infraestrutura.md" }
];
```

---

## 7. Estado do Projeto

### 7.1 Estrutura do estado.json

```json
{
  "projeto_id": "uuid",
  "nome": "meu-saas",
  "tipo_fluxo": "novo_projeto",
  "criado_em": "2024-12-18T17:00:00Z",
  "atualizado_em": "2024-12-18T18:30:00Z",
  "fase_atual": 5,
  "fases": [
    {
      "numero": 1,
      "nome": "Definição do Produto",
      "status": "completa",
      "entregavel": "docs/01-produto/PRD.md",
      "completado_em": "2024-12-18T17:15:00Z"
    },
    {
      "numero": 2,
      "nome": "Engenharia de Requisitos",
      "status": "completa",
      "entregavel": "docs/02-requisitos/requisitos.md",
      "completado_em": "2024-12-18T17:45:00Z"
    }
  ],
  "contexto": {
    "stack": "Node.js + NestJS + PostgreSQL",
    "descricao": "Sistema de agendamento para salões de beleza",
    "entidades_principais": ["Usuario", "Agendamento", "Servico", "Profissional"]
  }
}
```

### 7.2 Estrutura do contexto.md

```markdown
# Contexto: [Nome do Projeto]

## Visão Geral
[Resumo de 2-3 linhas gerado automaticamente do PRD]

## Stack Tecnológica
- Backend: [ex: NestJS]
- Frontend: [ex: Next.js]
- Banco: [ex: PostgreSQL]
- Infra: [ex: Docker + AWS]

## Modelo de Domínio
| Entidade | Campos Principais |
|---|---|
| Usuario | id, nome, email, role |
| Agendamento | id, usuarioId, servicoId, dataHora, status |

## Arquitetura
[Resumo ou link para docs/05-arquitetura/arquitetura.md]

## Fase Atual
- Fluxo: Novo Projeto
- Fase: 5/10 - Arquitetura de Software
- Última atualização: 2024-12-18

## Entregáveis Completos
- [x] PRD: docs/01-produto/PRD.md
- [x] Requisitos: docs/02-requisitos/requisitos.md
- [x] UX: docs/03-ux/design-doc.md
- [x] Modelo: docs/04-modelo/modelo-dominio.md
- [ ] Arquitetura: docs/05-arquitetura/arquitetura.md
```

---

## 8. Implementação

### 8.1 Dependências

```json
{
  "name": "mcp-guia-dev-ia",
  "version": "1.0.0",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### 8.2 Entry Point (index.ts)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";

const server = new Server(
  { name: "guia-dev-ia", version: "1.0.0" },
  { capabilities: { resources: {}, tools: {}, prompts: {} } }
);

// Registra handlers
registerResources(server);
registerTools(server);
registerPrompts(server);

// Inicia servidor
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 8.3 Exemplo de Tool (iniciar-projeto.ts)

```typescript
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { v4 as uuid } from "uuid";
import { createProjectStructure, saveState } from "../state/projeto.js";
import { loadEspecialista, loadPromptTemplate } from "../utils/files.js";
import { FLUXO_NOVO_PROJETO } from "../flows/novo-projeto.js";

export async function handleIniciarProjeto(args: {
  nome: string;
  descricao: string;
  diretorio?: string;
}) {
  const { nome, descricao, diretorio = process.cwd() } = args;
  
  // Cria estrutura de pastas
  await createProjectStructure(diretorio);
  
  // Inicializa estado
  const estado = {
    projeto_id: uuid(),
    nome,
    tipo_fluxo: "novo_projeto",
    criado_em: new Date().toISOString(),
    fase_atual: 1,
    fases: [],
    contexto: { descricao }
  };
  await saveState(diretorio, estado);
  
  // Carrega especialista da fase 1
  const fase = FLUXO_NOVO_PROJETO[0];
  const especialista = await loadEspecialista(fase.especialista);
  const prompt = await loadPromptTemplate(fase.prompt);
  
  return {
    content: [{
      type: "text",
      text: `
📍 PROJETO INICIADO: ${nome}

FASE 1/${FLUXO_NOVO_PROJETO.length}: ${fase.nome}
${"━".repeat(50)}

📁 Entregável esperado: ${fase.entregavel}

## Contexto do Especialista

${especialista}

## Prompt Sugerido

${prompt.replace("[COLE TEXTO]", descricao)}

---
Use /proximo quando terminar esta fase.
      `.trim()
    }]
  };
}
```

---

## 9. Configuração do Cliente

### 9.1 Claude Desktop (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "guia-dev-ia": {
      "command": "node",
      "args": ["/caminho/para/mcp-guia-dev-ia/dist/index.js"],
      "env": {
        "GUIA_PATH": "/caminho/para/Guia-dev-IA"
      }
    }
  }
}
```

### 9.2 Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `GUIA_PATH` | Caminho para o Guia-dev-IA | `./guia` |
| `PROJETO_PATH` | Caminho do projeto atual | `cwd()` |

---

## 10. Roadmap de Desenvolvimento

| Semana | Tarefa | Entregável |
|---|---|---|
| 1 | Setup + Resources | Leitura de especialistas/guias |
| 1 | Tool: iniciar_projeto | Fluxo novo projeto funcional |
| 2 | Tools: proximo, status, salvar | Navegação entre fases |
| 2 | State management | Persistência em JSON |
| 3 | Tools: nova_feature, corrigir_bug | Fluxos secundários |
| 3 | Atualização de contexto.md | Auto-update após cada fase |
| 4 | Testes + refinamento | Cobertura de testes |
| 4 | Documentação | README completo |

---

## 11. Testes

### 11.1 Testes de Tools

```typescript
import { describe, it, expect } from "vitest";
import { handleIniciarProjeto } from "../src/tools/iniciar-projeto.js";

describe("iniciar_projeto", () => {
  it("deve criar estrutura de pastas", async () => {
    const result = await handleIniciarProjeto({
      nome: "test-project",
      descricao: "Projeto de teste",
      diretorio: "/tmp/test"
    });
    
    expect(result.content[0].text).toContain("FASE 1/10");
    expect(fs.existsSync("/tmp/test/.guia")).toBe(true);
    expect(fs.existsSync("/tmp/test/docs")).toBe(true);
  });
});
```

---

## 12. Próximos Passos

1. Criar repositório `mcp-guia-dev-ia`
2. Configurar projeto TypeScript
3. Implementar Resources básicos
4. Implementar Tool `iniciar_projeto`
5. Testar com Claude Desktop
6. Iterar e expandir
