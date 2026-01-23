---
description: Validar gate de qualidade da fase atual (sem avançar)
---

# /mcp-gate - Validar Gate MCP

$ARGUMENTS

---

## Objetivo

Validar checklist de qualidade da fase atual SEM avançar para próxima fase. Útil para verificar antes de chamar `/mcp-next`.

---

## Quando Usar

- **Antes de `/mcp-next`**: Verificar se entregável passará no gate
- **Durante desenvolvimento**: Check iterativo de qualidade
- **Gate bloqueado**: Forçar aprovação manual (apenas usuário)

---

## Sub-comandos

```
/mcp-gate                   → Validar gate da fase atual
/mcp-gate [arquivo]         → Validar gate com entregável específico
/mcp-gate approve [motivo]  → ⚠️ Aprovar manualmente (APENAS USUÁRIO)
```

---

## Fluxo de Execução

### Modo 1: Validação Apenas (/mcp-gate)

```typescript
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

const resultado = await mcp_maestro_validar_gate({
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

**Saída:**

```markdown
🔍 **Validação de Gate**

**Fase:** [numero] - [nome]
**Score:** [score]/100
**Tier:** [Essencial / Base / Avançado]

---

## Checklist ([itens_validados]/[total_itens])

### ✅ Itens Validados ([count])

${itens_validados.map(item => `- ✅ ${item.nome}`).join('\n')}

${itens_pendentes.length > 0 ? `
### ❌ Itens Pendentes ([count])

${itens_pendentes.map(item => `
- ❌ **${item.nome}**
  - Motivo: ${item.motivo}
  - Sugestão: ${item.sugestao}
`).join('\n')}
` : ''}

---

## 📊 Resultado

${score >= 70 ? `
✅ **Gate Aprovado** (Score: ${score}/100)

Você pode avançar para a próxima fase com:
\`/mcp-next [arquivo]\`

${pendencias.length > 0 ? `
⚠️ **Atenção:** Existem ${pendencias.length} pendências menores.
Considere corrigir, mas não bloqueia o avanço.
` : ''}
` : `
🔴 **Gate Bloqueado** (Score: ${score}/100)

Para avançar, você precisa:
1. **Corrigir pendências** e executar \`/mcp-gate\` novamente
2. **Aprovar manualmente** (se tiver justificativa)

Para aprova manual (apenas usuário):
\`/mcp-gate approve "[sua justificativa]"\`
`}
```

---

### Modo 2: Validação com Arquivo (/mcp-gate [arquivo])

```
/mcp-gate docs/02-requisitos/requisitos.md
```

**Comportamento:**

1. Lê arquivo fornecido
2. Valida contra checklist da fase atual
3. Retorna score e pendências
4. **NÃO avança** a fase

---

### Modo 3: Aprovação Manual (/mcp-gate approve)

> [!CAUTION]
> **APENAS O USUÁRIO pode chamar este comando!**
> 
> A IA **NUNCA** deve chamar `/mcp-gate approve` automaticamente.

```
/mcp-gate approve "MVP inicial, vamos refinar depois"
```

**Fluxo:**

```typescript
// APENAS se usuário explicitamente escreveu o comando

const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

await mcp_maestro_aprovar_gate({
  acao: "aprovar",
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

**Saída:**

```markdown
⚠️ **Gate Aprovado Manualmente**

**Fase:** [numero] - [nome]
**Score Original:** [score]/100 (Bloqueado)
**Motivo:** [justificativa do usuário]

---

**Registro:**
- Data: [timestamp]
- Gate forçado: Fase [numero]
- Pendências ignoradas: [lista]

Agora você pode avançar com:
`/mcp-next`

> [!WARNING]
> Lembre-se de corrigir as pendências posteriormente!
```

---

## Checklist por Tier de Gate

### Tier Essencial (POC, Script)

**Foco: Funciona?**

```markdown
Checklist Mínimo:
- [ ] Código executa sem erros
- [ ] Funcionalidade principal implementada
- [ ] README com instruções de uso
```

### Tier Base (Internal, Product Simples)

**Foco: Padrão indústria**

```markdown
Checklist Base:
- [ ] Todos itens Essencial ✅
- [ ] Testes unitários (>60% cobertura)
- [ ] Lint sem erros
- [ ] Documentação técnica
- [ ] Segurança básica (OWASP Top 10)
- [ ] Validação de inputs
```

### Tier Avançado (Product Complexo)

**Foco: Estado da arte**

```markdown
Checklist Avançado:
- [ ] Todos itens Base ✅
- [ ] Testes E2E
- [ ] Observabilidade (logs, métricas, traces)
- [ ] Performance otimizada
- [ ] Compliance (LGPD, SOC2, etc)
- [ ] Documentação de arquitetura (ADRs)
- [ ] Disaster recovery plan
```

---

## Exemplos de Uso

### Exemplo 1: Verificar Antes de Avançar

```
User: /mcp-gate docs/02-requisitos/requisitos.md

AI: 🔍 Validação de Gate
    
    Fase: 2 - Requisitos
    Score: 85/100
    Tier: Base
    
    Checklist (5/6):
    ✅ Requisitos funcionais com IDs únicos
    ✅ Requisitos não-funcionais definidos
    ✅ Critérios de aceite em Gherkin
    ✅ Priorização (MoSCoW)
    ❌ Matriz de rastreabilidade iniciada
       - Sugestão: Crie tabela RF → User Story
    ✅ Requisitos validados com stakeholder
    
    ---
    
    ✅ Gate Aprovado (Score: 85/100)
    
    Você pode avançar:
    `/mcp-next docs/02-requisitos/requisitos.md`
    
    ⚠️ 1 pendência menor: matriz de rastreabilidade

User: OK, vou adicionar a matriz antes

[Usuário atualiza arquivo]

User: /mcp-gate docs/02-requisitos/requisitos.md

AI: Score: 100/100 ✅ Perfeito!
    Avançar: `/mcp-next`
```

### Exemplo 2: Gate Bloqueado → Aprovação Manual

```
User: /mcp-gate

AI: 🔍 Validação de Gate
    
    Fase: 5 - Arquitetura
    Score: 55/100
    Tier: Avançado
    
    Checklist (4/8):
    ✅ Diagrama C4 (nível 1 e 2)
    ✅ ADRs para decisões principais
    ❌ Análise de performance
    ❌ Estratégia de observabilidade
    ❌ Disaster recovery plan
    ❌ Plano de escalabilidade
    ✅ Segurança revisada
    ✅ Padrões de design documentados
    
    ---
    
    🔴 Gate Bloqueado (Score: 55/100)
    
    Para avançar:
    1. Corrigir as 4 pendências
    2. Ou aprovar manualmente (se justificado)

User: É MVP, quero avançar e fazer isso depois

User: /mcp-gate approve "MVP inicial, itens avançados serão feitos na v2"

AI: ⚠️ Gate Aprovado Manualmente
    
    Motivo: MVP inicial, itens avançados serão feitos na v2
    
    Registro salvo em .maestro/gates-forcados.log
    
    Você pode avançar com `/mcp-next`
```

### Exemplo 3: Check Iterativo

```
# Durante desenvolvimento, verificar múltiplas vezes

User: /mcp-gate
AI: Score: 40/100 🔴

[Corrige 2 itens]

User: /mcp-gate
AI: Score: 65/100 🔴

[Corrige mais 1 item]

User: /mcp-gate
AI: Score: 75/100 ✅ Pode avançar!

User: /mcp-next
```

---

## Histórico de Gates Forçados

Quando gates são aprovados manualmente, o MCP registra em:

```
.maestro/gates-forcados.log
```

**Formato:**

```
[2026-01-23 15:30:00] Fase 5 - Arquitetura
Score: 55/100
Motivo: MVP inicial, itens avançados serão feitos na v2
Pendências ignoradas:
  - Análise de performance
  - Estratégia de observabilidade
  - Disaster recovery plan
  - Plano de escalabilidade
---
```

---

## Comandos Relacionados

```
/mcp-gate                   → Validar gate atual
/mcp-gate [arquivo]         → Validar com entregável
/mcp-gate approve [motivo]  → Aprovar manualmente (USUÁRIO)
/mcp-next                   → Avançar (valida automaticamente)
/mcp-status                 → Ver score do último gate
```

---

## Gate Protection Protocol

> [!IMPORTANT]
> **Regras de Proteção de Gates:**
> 
> 1. ✅ IA pode chamar `/mcp-gate` livremente (validação)
> 2. ❌ IA **NUNCA** pode chamar `/mcp-gate approve`
> 3. ⚠️ Score < 70 → Bloqueia avanço automático
> 4. 📝 Aprovações manuais são registradas em log
> 5. 🔄 Validação sempre usa checklist do tier do projeto

---

## Ajustar Tier de Gate

Se o tier estiver muito rigoroso ou flexível:

```
# Reclassificar projeto
/mcp-start reclassificar

# Escolher novo tier:
# - Essencial (apenas funcionalidade)
# - Base (padrão indústria)
# - Avançado (estado da arte)
```

---

## Troubleshooting

### Score Sempre Baixo

**Causa:** Tier muito alto para o tipo de projeto

**Solução:** Reclassificar para tier adequado

### Validação Falha com Erro

**Causa:** Entregável não encontrado ou formato inválido

**Solução:**

```
# Verificar se arquivo existe
ls docs/[fase]/[arquivo]

# Validar com caminho absoluto
/mcp-gate /caminho/completo/arquivo.md
```

### Aprovação Manual Não Funciona

**Causa:** IA tentou aprovar (não permitido)

**Solução:** Usuário deve digitar o comando diretamente:

```
/mcp-gate approve "minha justificativa"
```
