---
description: Mostra o status completo do projeto Maestro e recomenda próximas ações
---

# 📊 Workflow de Status - /status-projeto

## 1. Ler estado

```javascript
const estado = lerJson('.maestro/estado.json');
if (!estado) throw new Error('Projeto ainda não inicializado. Execute /iniciar-projeto.');
const fases = Object.values(estado.fases || {});
```

## 2. Calcular métricas

- Fases concluídas (`status === 'concluida'`).
- Progresso percentual: `concluidas / totalFases`.
- Score médio (ignorar `null`).
- Bloqueios: fases com `status === 'bloqueado'`.
- Próxima ação sugerida: se há bloqueio → listar; se fase atual não concluída → `/continuar-fase`; caso contrário → `/avancar-fase`.

## 3. Resposta padrão

```
🎯 **Projeto:** {estado.projeto.nome}
📈 **Progresso:** {progresso}% ({fasesConcluidas}/{totalFases})
🔄 **Fase Atual:** {faseAtual.numero}/{totalFases} - {faseAtual.nome}
👤 **Especialista:** {faseAtual.especialista}
📊 **Score Médio:** {scoreMedio}

## 📋 Detalhes
| Fase | Status | Score | Especialista | Últ. Atualização |
|------|--------|-------|--------------|------------------|
{linhas}

{bloqueios ? `⚠️ Bloqueios detectados:` + lista : ''}

🎯 **Próximas ações sugeridas:**
- {acao1}
- {acao2}
```

## 4. Recomendações

Baseie-se em heurísticas simples:
- Ritmo lento (`diasFase > media`) → sugerir revisão.
- Score baixo (< mínimo + 5) → recomendar `/continuar-fase` focando na validação.
- Próxima fase crítica (ex.: Prototipagem, Arquitetura) → antecipar especialistas/artefatos.

## 5. Complementos

- Se o usuário pedir filtros (ex.: "status completo"), incluir lista detalhada dos artefatos por fase.
- Caso não exista `estado.fases`, instruir execução de `/iniciar-projeto`.
