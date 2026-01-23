---
description: Avançar fase MCP com validação de gates e salvamento de entregável
---

# /mcp-next - Avançar Fase MCP

$ARGUMENTS

---

## Objetivo

Salvar entregável da fase atual, validar gates de qualidade, e avançar para próxima fase do fluxo MCP Maestro.

---

## Protocolo Stateless MCP (CRÍTICO)

> [!IMPORTANT]
> **OBRIGATÓRIO antes de QUALQUER tool MCP:**
> ```typescript
> const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');
> // Passar estadoJson em TODOS os tools
> ```

---

## Fluxo de Execução

### Passo 1: Verificar Contexto MCP

```typescript
// Verificar se existe projeto MCP
if (!fs.existsSync('.maestro/estado.json')) {
  return "❌ Nenhum projeto MCP ativo. Use /mcp-start para iniciar.";
}

// Ler estado
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');
const estado = JSON.parse(estadoJson);

// Mostrar contexto
console.log(`
📋 **Fase Atual:** ${estado.fase_atual} - ${estado.fases[estado.fase_atual - 1].nome}
📄 **Entregável Esperado:** ${estado.fases[estado.fase_atual - 1].template}
`);
```

---

### Passo 2: Coletar Entregável

**Se usuário forneceu arquivo como argumento:**

```bash
/mcp-next docs/01-produto/PRD.md
```

**Ler arquivo:**

```typescript
const entregavel = await fs.readFile(argumentoArquivo, 'utf-8');
```

**Se NÃO forneceu argumento:**

```markdown
📝 **Entregável da Fase [numero]**

Como deseja fornecer o entregável?

1. Colar conteúdo diretamente
2. Informar caminho do arquivo

Escolha (1/2):
```

**Se opção 1:**
```
Cole o conteúdo do entregável abaixo:
```

**Se opção 2:**
```
Qual o caminho do arquivo?
Exemplo: docs/01-produto/PRD.md
```

---

### Passo 3: Validar Gate

```typescript
const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');

const resultado = await mcp_maestro_validar_gate({
  entregavel: entregavel,
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

**MCP retorna:**
- `valido`: boolean
- `score`: 0-100
- `checklist`: array de itens
- `pendencias`: array de strings

---

### Passo 4: Apresentar Resultado da Validação

#### Cenário A: Score >= 70 (Aprovado ✅)

```markdown
✅ **Gate Aprovado** (Score: ${score}/100)

**Checklist da Fase:**
${checklist.map(item => `${item.validado ? '✅' : '⚠️'} ${item.nome}`).join('\n')}

${pendencias.length > 0 ? `
**Pendências Menores:**
${pendencias.map(p => `- ${p}`).join('\n')}

(Pode avançar, mas considere corrigir depois)
` : ''}

Avançando para próxima fase...
```

**Chamar proximo automaticamente:**

```typescript
await mcp_maestro_proximo({
  entregavel: entregavel,
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

#### Cenário B: Score < 70 (Bloqueado 🔴)

```markdown
🔴 **Gate Bloqueado** (Score: ${score}/100)

**Itens Validados** ✅:
${checklist.filter(i => i.validado).map(i => `- ${i.nome}`).join('\n')}

**Itens Pendentes** ❌:
${checklist.filter(i => !i.validado).map(i => `- ${i.nome}`).join('\n')}

**Sugestões de Correção:**
${pendencias.map(p => `- ${p}`).join('\n')}

---

**Opções:**

1. **Corrigir pendências** → Atualize o entregável e execute `/mcp-next [arquivo]` novamente
2. **Aprovar manualmente** → Se tiver motivo justificado, posso informar como forçar

Qual opção? (1/2)
```

**Se usuário escolher opção 2:**

> [!CAUTION]
> **NUNCA** chamar `aprovar_gate` automaticamente!
> 
> Apenas **INFORMAR** ao usuário:

```markdown
⚠️ **Aprovação Manual de Gate**

Para aprovar este gate manualmente, você (usuário) precisa:

1. Entender os riscos de avançar com pendências
2. Ter justificativa documentada
3. Executar: `/mcp-gate approve [justificativa]`

**Exemplo:**
/mcp-gate approve "MVP inicial, vamos refinar depois"

❌ **Eu (IA) NÃO posso aprovar gates automaticamente.**
```

---

### Passo 5: Apresentar Próxima Fase

**Após avançar com sucesso:**

```typescript
// Recarregar estado atualizado
const novoEstadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');
const novoEstado = JSON.parse(novoEstadoJson);

// Carregar especialista da próxima fase
const proximaFase = novoEstado.fases[novoEstado.fase_atual - 1];
const especialista = await fetch(`maestro://especialista/${proximaFase.especialista}`);
```

**Apresentar:**

```markdown
✅ **Entregável Salvo:** docs/${faseConcluida.numero}-${faseConcluida.slug}/${arquivo}

---

🎯 **Fase ${proximaFase.numero}/${totalFases}: ${proximaFase.nome}**
🤖 **Especialista:** ${proximaFase.especialista}
📄 **Entregável Esperado:** ${proximaFase.template}

---

## 🎯 ${proximaFase.nome}

${especialista.introducao}

${especialista.perguntas_iniciais}
```

---

## Comandos

```
/mcp-next                    → Wizard (pede entregável)
/mcp-next [arquivo]          → Usa arquivo como entregável
/mcp-next --force [arquivo]  → ❌ NÃO SUPORTADO (usar /mcp-gate approve)
```

---

## Exemplos de Uso

### Exemplo 1: Gate Aprovado Automaticamente

```
User: /mcp-next docs/01-produto/PRD.md

AI: Validando gate da Fase 1...

    ✅ Gate Aprovado (Score: 95/100)
    
    Checklist:
    ✅ Problema claramente definido
    ✅ Personas identificadas
    ✅ MVP com funcionalidades listadas
    ✅ North Star Metric definida
    
    Avançando para próxima fase...
    
    ✅ PRD Salvo: docs/01-produto/PRD.md
    
    🎯 Fase 2/13: Requisitos
    🤖 Especialista: Engenharia de Requisitos
    
    Vamos elaborar os requisitos funcionais e não-funcionais...
```

### Exemplo 2: Gate Bloqueado

```
User: /mcp-next docs/02-requisitos/requisitos.md

AI: Validando gate da Fase 2...

    🔴 Gate Bloqueado (Score: 60/100)
    
    Itens Validados ✅:
    - Requisitos funcionais com IDs únicos
    - Requisitos não-funcionais definidos
    
    Itens Pendentes ❌:
    - Critérios de aceite em Gherkin
    - Matriz de rastreabilidade iniciada
    
    Sugestões:
    - Adicione cenários Gherkin para cada RF (Dado/Quando/Então)
    - Crie tabela mapeando RF → User Story
    
    ---
    
    Opções:
    1. Corrigir pendências
    2. Aprovar manualmente
    
    Qual? (1/2)

User: 1

AI: Certo! Atualize o arquivo `docs/02-requisitos/requisitos.md` 
    e execute `/mcp-next` novamente quando estiver pronto.
```

### Exemplo 3: Wizard Interativo

```
User: /mcp-next

AI: 📋 Fase Atual: 3 - UX Design
    📄 Entregável Esperado: design-doc.md
    
    Como deseja fornecer o entregável?
    1. Colar conteúdo
    2. Informar arquivo
    
    Escolha: 

User: 2

AI: Qual o caminho do arquivo?

User: docs/03-ux/design-doc.md

AI: Validando gate...
    [continua validação]
```

---

## Regras Críticas

### ✅ SEMPRE Fazer:

1. Ler `.maestro/estado.json` ANTES de qualquer tool MCP
2. Passar `estado_json` em TODOS os tools
3. Validar gate ANTES de chamar `proximo`
4. Apresentar resultado de validação ao usuário
5. Carregar especialista da próxima fase

### ❌ NUNCA Fazer:

1. Chamar `proximo` sem validar gate antes
2. Chamar `aprovar_gate` automaticamente
3. Usar `forcar: true` sem aprovação explícita do usuário
4. Avançar com score < 70 sem mostrar pendências
5. Assumir que arquivo existe sem verificar

---

## Gate Protection Protocol

> [!CAUTION]
> **Quando `validar_gate` retorna `valido: false`:**
> 
> 1. 🛑 **PARAR** - Não chamar `proximo()`
> 2. 📊 **MOSTRAR** - Itens pendentes ao usuário
> 3. 💡 **SUGERIR** - Correções baseadas em checklist
> 4. ⏸️ **AGUARDAR** - Decisão do usuário
> 
> **NUNCA:**
> - ❌ Chamar `aprovar_gate` automaticamente
> - ❌ Usar `forcar: true` sem aprovação explícita
> - ❌ Ignorar gates ou pular validações

---

## Troubleshooting

### Erro: "estado.json not found"

```
❌ Nenhum projeto MCP ativo.

Use `/mcp-start` para iniciar um novo projeto.
```

### Erro: "Fase já concluída"

```
⚠️ Esta fase já foi concluída.

Use `/mcp-status` para ver a fase atual.
```

### Score Sempre < 70

**Causa:** Tier de gate muito rigoroso para o tipo de projeto.

**Solução:** Reclassificar projeto:

```
/mcp-start reclassificar
```

Ou aprovar manualmente com justificativa.
