---
description: Exploração estruturada de ideias, integrada ao estado do Maestro.
---

# /brainstorm - Exploração Estruturada de Ideias

$ARGUMENTS

---

## Pré-requisitos e conexão com o Maestro

1. Execute `/maestro` para validar o estado atual e detectar fase/artefatos focos.
2. Carregue `.maestro/estado.json` para contextualizar o brainstorming com o problema/fase em andamento:
   ```javascript
   const estado = lerJson('.maestro/estado.json');
   const faseAtual = estado.fases?.[estado.faseAtual];
   ```
3. Registre no histórico (`estado.historico`) o evento `brainstorm_executado`, indicando o tópico e os caminhos escolhidos. Chame `salvarEstado(estado)` após concluir.
4. Use `content/guides/fases-mapeamento.md` para puxar especialistas/prompts relacionados (ex.: fase 1 → Gestão de Produto, fase 3 → UX).

---

## Purpose

This command activates BRAINSTORM mode for structured idea exploration. Use when you need to explore options before committing to an implementation and quer salvar as conclusões no estado do Maestro.

---

## Behavior

When `/brainstorm` is triggered:

1. **Understand the goal**
   - What problem are we solving?
   - Who is the user?
   - What constraints exist?
   - Relacione com `faseAtual.nome` e `faseAtual.especialista` para manter alinhamento.

2. **Generate options**
   - Provide at least 3 different approaches
   - Each with pros and cons
   - Consider unconventional solutions

3. **Compare and recommend**
   - Summarize tradeoffs
   - Give a recommendation with reasoning

---

## Output Format (registrar em `docs/brainstorm/<slug>.md` e anexar ao estado)

```markdown
## 🧠 Brainstorm: [Topic]

### Context
[Brief problem statement]

---

### Option A: [Name]
[Description]

✅ **Pros:**
- [benefit 1]
- [benefit 2]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

### Option B: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]
- [drawback 2]

📊 **Effort:** Low | Medium | High

---

### Option C: [Name]
[Description]

✅ **Pros:**
- [benefit 1]

❌ **Cons:**
- [drawback 1]

📊 **Effort:** Low | Medium | High

---

## 💡 Recommendation

**Option [X]** because [reasoning].

What direction would you like to explore?
```

---

## Examples

```
/brainstorm authentication system (fase 2 – requisitos)
/brainstorm redesign para dashboard (fase 3 – UX)
/brainstorm integrações com ERP (fase 6 – Integração)
/brainstorm caching strategy para escala
```

---

## Key Principles

- **No code** - this is about ideas, not implementation
- **Visual when helpful** - use diagrams for architecture
- **Honest tradeoffs** - don't hide complexity
- **Defer to user** - present options, let them decide
