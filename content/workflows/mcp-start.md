---
description: Iniciar projeto MCP com classificação automática e wizard interativo
---

# /mcp-start - Iniciar Projeto MCP Maestro

$ARGUMENTS

---

## Objetivo

Iniciar novo projeto usando o sistema MCP Maestro com classificação automática de complexidade, seleção de tier de gates, e opção de prototipagem com Stitch.

---

## Protocolo Stateless MCP (CRÍTICO)

> [!IMPORTANT]
> **ANTES de chamar QUALQUER tool MCP:**
> 1. Ler `.maestro/estado.json` (se existir)
> 2. Parsear conteúdo para variável `estado_json`
> 3. Passar `estado_json` como argumento em TODOS os tools MCP
> 4. NUNCA confiar em memória de conversação

---

## Fluxo de Execução

### Passo 1: Coleta de Informações

**Perguntar ao usuário:**

```
🎯 **Iniciando Projeto MCP Maestro**

1. Qual o nome do projeto?
2. Descreva brevemente o projeto (problema, solução, público-alvo):
```

**Se usuário forneceu argumentos:**
- `/mcp-start NomeProjeto` → Usar nome, pedir descrição
- `/mcp-start` → Pedir nome e descrição

---

### Passo 2: Análise e Classificação Automática

**Chamar MCP tool:**

```typescript
await mcp_maestro_iniciar_projeto({
  nome: "[nome fornecido]",
  descricao: "[descrição fornecida]",
  diretorio: process.cwd()
});
```

**MCP retorna:**
- Classificação sugerida: `tipo_artefato` (poc/script/internal/product)
- Nível de complexidade: `nivel_complexidade` (simples/medio/complexo)
- Tier de gates: `tier_gate` (essencial/base/avancado)
- Número de fases resultante
- Justificativa da classificação

---

### Passo 3: Apresentar Classificação ao Usuário

```markdown
📊 **Classificação Automática**

Analisei sua descrição e sugiro:

- **Tipo de Artefato:** [POC/Script/Internal/Product]
- **Complexidade:** [Simples/Médio/Complexo]
- **Número de Fases:** [7/13/17]
- **Tier de Gates:** [Essencial/Base/Avançado]

**Justificativa:**
- [motivo 1]
- [motivo 2]
- [motivo 3]

**Isso significa:**
- [O que o tier de gate valida]
- [Quais especialistas serão usados]

Confirmar classificação? (Y/N)
Se quiser ajustar, responda: "reclassificar para [simples/medio/complexo]"
```

---

### Passo 4: Confirmação ou Reclassificação

**Se usuário confirmar (Y):**

```typescript
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

await mcp_maestro_confirmar_projeto({
  nome: "[nome]",
  diretorio: process.cwd(),
  tipo_artefato: "[tipo sugerido]",
  nivel_complexidade: "[nivel sugerido]"
});
```

**Se usuário quiser reclassificar:**

```typescript
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

await mcp_maestro_classificar({
  nivel: "[simples/medio/complexo]",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

// Após reclassificação, confirmar:
await mcp_maestro_confirmar_classificacao({
  nivel: "[novo nivel]",
  tipo_artefato: "[tipo]",
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

---

### Passo 5: Opção de Prototipagem com Stitch (Opcional)

```markdown
🎨 **Prototipagem com Google Stitch**

Deseja incluir uma fase de **Prototipagem Rápida com Google Stitch**?

Isso adiciona uma fase após UX Design para:
- Gerar prompts otimizados para Stitch
- Criar protótipos HTML/CSS validados
- Exportar código para produção

Usar Stitch? (Y/N)
```

**Se Y:**

```typescript
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

await mcp_maestro_confirmar_stitch({
  usar_stitch: true,
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

---

### Passo 6: Apresentar Fase Inicial

```markdown
✅ **Projeto Iniciado com Sucesso**

📁 **Diretório:** [diretorio]
📋 **Fase 1/[total]:** Produto
🤖 **Especialista:** Gestão de Produto
📄 **Entregável Esperado:** PRD.md

---

## 🎯 Fase 1: Visão de Produto

Como **Especialista em Gestão de Produto**, vou ajudá-lo a definir:

1. **Problema** - Que dor estamos resolvendo?
2. **Solução** - Como vamos resolver?
3. **Público-alvo** - Quem são os usuários?
4. **MVP** - O que entra na primeira versão?
5. **Métricas** - Como medir sucesso (North Star Metric)?

Vamos começar. Qual o **principal problema** que este produto resolve?
```

**Carregar especialista:**

```typescript
const especialista = await fetch('maestro://especialista/gestao-de-produto');
// Aplicar persona e instruções do especialista
```

---

## Estrutura Criada

Após execução bem-sucedida, o projeto terá:

```
[nome-projeto]/
├── .maestro/
│   ├── estado.json       # ⭐ Fonte da verdade (STATE)
│   └── resumo.json       # Cache de contexto
└── docs/
    └── 01-produto/       # Criado quando salvar PRD
```

---

## Comandos Relacionados

```
/mcp-start              → Wizard completo (recomendado)
/mcp-start MeuProjeto   → Inicia com nome, pede descrição
/mcp-status             → Ver status após criação
/mcp-next               → Avançar para próxima fase
```

---

## Exemplos de Uso

### Exemplo 1: SaaS Simples

```
User: /mcp-start

AI: Qual o nome do projeto?
User: TaskFlow

AI: Descreva brevemente o projeto:
User: Gerenciador de tarefas para times pequenos, até 10 usuários

AI: 📊 Classificação Automática
    - Tipo: Internal
    - Complexidade: Simples (7 fases)
    - Tier: Base
    - Justificativa: Escala pequena, sem integrações complexas

User: Y

AI: Usar Stitch?
User: N

AI: ✅ Projeto iniciado! Fase 1: Produto...
```

### Exemplo 2: Fintech Complexo

```
User: /mcp-start

AI: Qual o nome do projeto?
User: PaySecure

AI: Descreva brevemente o projeto:
User: Plataforma de pagamentos com multi-tenancy, compliance PCI-DSS, 100k+ usuários

AI: 📊 Classificação Automática
    - Tipo: Product
    - Complexidade: Complexo (17 fases)
    - Tier: Avançado
    - Justificativa: 
      - Multi-tenancy detectado
      - Compliance rigoroso (PCI-DSS)
      - Alta escala (100k+ usuários)

User: Y

AI: Usar Stitch?
User: Y

AI: ✅ Projeto iniciado! Fase Stitch incluída após UX...
```

---

## Regras Críticas

1. ✅ **SEMPRE** ler `estado.json` antes de chamar tools MCP
2. ✅ **SEMPRE** passar `estado_json` como argumento
3. ✅ **AGUARDAR** confirmação do usuário antes de `confirmar_projeto`
4. ❌ **NUNCA** assumir classificação sem mostrar ao usuário
5. ❌ **NUNCA** pular wizard, sempre fazer perguntas
6. ❌ **NUNCA** avançar automaticamente para Fase 2 (usar `/mcp-next`)

---

## Troubleshooting

### Erro: "estado.json not found"

**Causa:** Tool MCP esperava estado mas projeto não foi criado ainda.

**Solução:** Normal no primeiro `iniciar_projeto`. Ignorar e continuar.

### Classificação Parece Errada

**Solução:** Perguntar ao usuário se quer reclassificar:

```
A classificação parece adequada? Se quiser ajustar, diga:
"reclassificar para [simples/medio/complexo]"
```
