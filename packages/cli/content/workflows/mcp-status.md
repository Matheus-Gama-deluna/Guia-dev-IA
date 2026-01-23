---
description: Visualizar status completo do projeto MCP com métricas e progresso
---

# /mcp-status - Status do Projeto MCP

$ARGUMENTS

---

## Objetivo

Visualizar estado completo do projeto MCP Maestro: fase atual, progresso, gates, stack tecnológica e próximos passos.

---

## Execução

### Verificar Contexto MCP

```typescript
if (!fs.existsSync('.maestro/estado.json')) {
  return `
❌ **Nenhum projeto MCP ativo**

Para iniciar um projeto, use:
\`/mcp-start\`
  `;
}

const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

await mcp_maestro_status({
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

---

## Formato de Saída

```markdown
# 📊 Status MCP Maestro

## 📁 Projeto

- **Nome:** [nome do projeto]
- **Diretório:** [caminho absoluto]
- **Tipo de Artefato:** [POC / Script / Internal / Product]
- **Complexidade:** [Simples / Médio / Complexo]
- **Tier de Gates:** [Essencial / Base / Avançado]

---

## 🎯 Progresso

**Fase Atual:** [numero]/[total] - [nome da fase]

```
[▓▓▓▓▓▓▓▓▓░░░░░░] 60% completo
```

**Fases:**
1. ✅ Produto (100%)
2. ✅ Requisitos (100%)
3. ✅ UX Design (100%)
4. 🔄 Modelagem de Domínio (em andamento)
5. ⏳ Arquitetura de Software (pendente)
6. ⏳ ... (pendente)

---

## 🤖 Especialista Atual

**Nome:** [Especialista em Modelagem de Domínio]
**Papel:** [Definir entidades, relacionamentos, agregados e eventos de domínio]
**Entregável Esperado:** `modelo-dominio.md`

---

## 🏗️ Stack Tecnológica

- **Framework:** [Next.js 14 / Laravel 11 / NestJS / etc]
- **Database:** [PostgreSQL / MySQL / MongoDB]
- **Linguagem:** [TypeScript / PHP / Java]
- **Cloud:** [AWS / GCP / Azure / Vercel]

---

## 🚦 Último Gate

**Fase:** [numero] - [nome]
**Score:** [score]/100
**Status:** [✅ Aprovado / ⚠️ Aprovado com pendências / 🔴 Bloqueado]

${score < 100 ? `
**Pendências:**
${pendencias.map(p => `- ${p}`).join('\n')}
` : ''}

---

## 📈 Métricas

- **Fases Concluídas:** [numero]/[total] ([percentual]%)
- **Entregáveis Salvos:** [numero]
- **Gates Validados:** [numero_aprovados]/[numero_total]
- **Tempo no Projeto:** [dias desde inicio]

---

## 📋 Próximos Passos

1. **Completar Fase Atual:** [nome da fase]
   - Criar: `[entregável esperado]`
   - Validação: [checklist resumido]

2. **Avançar:** Use `/mcp-next [arquivo]`

3. **Próxima Fase:** [numero+1] - [nome]
   - Especialista: [nome]
   - Template: [template.md]

---

## 🔗 Comandos Úteis

\`\`\`
/mcp-next [arquivo]         → Avançar para próxima fase
/mcp-gate                   → Validar gate atual
/mcp-feature [descrição]    → Adicionar nova feature
/mcp-debug [descrição]      → Corrigir bug
\`\`\`
```

---

## Variações de Comando

### Status Básico

```
/mcp-status
```

→ Saída completa acima

### Status Resumido

```
/mcp-status --short
```

→ Saída:

```
📊 RestaurantePro - Product Médio (Fase 4/13)
🎯 Modelagem de Domínio [▓▓▓▓▓▓░░░░░░░] 46%
📄 Entregável: modelo-dominio.md
```

### Status com Histórico

```
/mcp-status --history
```

→ Adiciona seção:

```markdown
## 📜 Histórico de Fases

| Fase | Nome | Concluída em | Score | Duração |
|------|------|--------------|-------|---------|
| 1 | Produto | 2026-01-20 | 95/100 | 2h |
| 2 | Requisitos | 2026-01-21 | 85/100 | 3h |
| 3 | UX Design | 2026-01-22 | 90/100 | 4h |
| 4 | Modelagem | Em andamento | - | 1h até agora |
```

---

## Exemplos de Saída

### Exemplo 1: Projeto no Meio (Fase 4/13)

```markdown
# 📊 Status MCP Maestro

## 📁 Projeto

- **Nome:** RestaurantePro
- **Tipo:** Product
- **Complexidade:** Médio (13 fases)
- **Tier:** Base

---

## 🎯 Progresso

**Fase Atual:** 4/13 - Modelagem de Domínio

[▓▓▓▓▓░░░░░░░░] 31% completo

**Fases:**
1. ✅ Produto
2. ✅ Requisitos
3. ✅ UX Design
4. 🔄 Modelagem de Domínio (em andamento)
5. ⏳ Banco de Dados
6. ⏳ Arquitetura de Software
...

---

## 🤖 Especialista Atual

**Nome:** Especialista em Modelagem de Domínio
**Entregável:** `modelo-dominio.md`

---

## 🏗️ Stack

- Framework: Next.js 14
- Database: PostgreSQL
- Linguagem: TypeScript

---

## 🚦 Último Gate

**Fase:** 3 - UX Design
**Score:** 90/100 ✅
**Pendências:**
- Protótipos de alta fidelidade (opcional para tier Base)

---

## 📋 Próximos Passos

1. Completar modelo de domínio (Entidades, Agregados, Eventos)
2. Avançar: `/mcp-next docs/04-modelo/modelo-dominio.md`
3. Próxima: Fase 5 - Banco de Dados
```

### Exemplo 2: Projeto Concluído

```markdown
# 📊 Status MCP Maestro

## 📁 Projeto

- **Nome:** TaskFlow
- **Tipo:** Internal
- **Complexidade:** Simples (7 fases)
- **Tier:** Base

---

## 🎯 Progresso

**Status:** ✅ **PROJETO CONCLUÍDO**

[▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% completo

**Todas as 7 fases finalizadas:**
1. ✅ Produto
2. ✅ Requisitos
3. ✅ UX Design
4. ✅ Modelagem
5. ✅ Arquitetura
6. ✅ Desenvolvimento
7. ✅ Deploy

---

## 🏆 Resumo Final

- **Tempo Total:** 5 dias
- **Entregáveis:** 7 documentos
- **Score Médio dos Gates:** 87/100
- **Deploy:** https://taskflow.example.com

---

## 📋 Próximos Passos

🎉 Projeto concluído!

Para adicionar features:
- `/mcp-feature [descrição]`

Para manutenção:
- `/mcp-debug [bug]`
- `/mcp-refactor [área]`
```

### Exemplo 3: Nenhum Projeto Ativo

```
❌ **Nenhum projeto MCP ativo**

Para iniciar um projeto, use:
`/mcp-start`

Ou, se já existe um projeto:
`cd [diretorio-do-projeto]`
`/mcp-status`
```

---

## Status em Contexto de Feature/Bug

Se estiver em um fluxo de feature ou bug, mostra ambos:

```markdown
# 📊 Status MCP Maestro

## 📁 Projeto Principal

[status normal do projeto]

---

## 🆕 Feature em Andamento

**ID:** FEAT-001
**Descrição:** Sistema de notificações push
**Fase:** 3/6 - Design
**Progresso:** [▓▓▓▓░░] 50%

Use `/mcp-next` para avançar a feature

---

## 🐛 Bug em Correção

**ID:** BUG-002
**Descrição:** Timeout no carregamento de imagens
**Severidade:** Alta
**Fase:** 2/4 - Análise de Causa Raiz

Use `/mcp-next` para continuar o debug
```

---

## Integração com Dashboard Visual (Futuro)

O status pode ser exportado para dashboards:

```
/mcp-status --export json > status.json
/mcp-status --export html > dashboard.html
```

---

## Comandos Relacionados

```
/mcp-status                 → Status completo
/mcp-status --short         → Resumo de uma linha
/mcp-status --history       → Com histórico de fases
/mcp-next                   → Avançar fase
/mcp-start                  → Iniciar novo projeto
```

---

## Troubleshooting

### Status Desatualizado

**Sintoma:** Status mostra fase antiga

**Causa:** Cache de `resumo.json`

**Solução:**

```bash
# Forçar reload do estado.json
/mcp-status --reload
```

### Múltiplos Projetos

**Sintoma:** Status do projeto errado

**Solução:**

```bash
cd /caminho/do/projeto/correto
/mcp-status
```

O status sempre usa `.maestro/estado.json` do diretório atual.
