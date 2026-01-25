---
description: Inicia novo projeto Maestro com classificação automática e setup inteligente
---

# 🚀 Workflow de Iniciação - /iniciar-projeto

## 1. Coleta de informações

Pergunte ao usuário (ou utilize argumentos) para obter:
- Nome do projeto
- Descrição curta (problema, público, solução)

## 2. Classificação automática

1. Carregue o template em `templates/estado-template.json` e os fluxos definidos em `src/src/flows/types.ts` (funções `getFluxo`, `getFluxoComStitch`).
2. Use a função mental abaixo para sugerir configuração:

```javascript
const analise = classificarProjeto({ nome, descricao });
const fluxo = getFluxoComStitch(analise.complexidade, analise.usarStitch);
/* Retorna:
 * - complexidade (simples/medio/complexo)
 * - tier (7/13/17 fases)
 * - especialistaInicial (fase 1 do fluxo escolhido)
 */
```

Mostre a classificação e peça confirmação. Permita ajustes manuais caso o usuário solicite (ex.: "reclassificar para médio").

## 3. Geração do estado inicial

- Copie o template de estado e popule as fases com base em `fluxo.fases`.
- Garanta que cada fase traga `especialista`, `entregavel_esperado`, `scoreMinimo` e `gate_checklist` do fluxo MCP.
- Registre em `historico` o evento `projeto_iniciado` com justificativa da classificação.
- Defina helpers mentais para leitura/escrita:
  ```javascript
  const estado = preencherTemplate(...);
  function salvarEstado(state) {
    escreverJson('.maestro/estado.json', state, { spaces: 2 });
  }
  salvarEstado(estado);
  ```

## 4. Setup do contexto

- Copiar templates necessários para `docs/<fase>/...`
- Registrar especialista inicial (`Gestão de Produto` para fase 1)
- Preparar prompts e skills relevantes

## 5. Mensagem de saída

```
✅ Projeto iniciado!
- Fase 1/ {totalFases}: Produto
- Especialista: Gestão de Produto
- Entregável: docs/01-produto/PRD.md

Próximo passo: responda às perguntas do especialista para preencher o PRD.
```
