---
description: Playbook de governança do orquestrador Maestro
---

# 📘 Playbook do Orquestrador Inteligente

## 1. Fluxo padrão
1. `/maestro` → Detecta estado, valida fluxos MCP e aponta próxima ação.
2. `/iniciar-projeto` → Classifica, gera estado e prepara fase 1.
3. `/continuar-fase` → Carrega especialista/prompt/templates e retoma do ponto exato.
4. `/avancar-fase` → Executa quality gates e avança com registro em histórico.
5. `/status-projeto` → Consolida progresso, scores, bloqueios e recomendações.

## 2. Governança do estado (`.maestro/estado.json`)
- Sempre ler antes de executar qualquer workflow.
- Campos principais: `projeto`, `faseAtual`, `fases`, `qualityGates`, `historico`, `metrica`.
- Atualizações recomendadas:
  - `/continuar-fase`: atualizar `fases[N].artefatos`, notas, progresso, `metrica.ultimoComando`.
  - `/avancar-fase`: marcar `fases[N].status = 'concluida'`, preencher `dataConclusao`, incrementar `faseAtual`, registrar `historico`.
  - `/status-projeto`: apenas leitura; reporte divergências.

## 3. Métricas e registro
- `metrica.fasesConcluidas`: incrementado ao avançar.
- `metrica.tempoPorFase`: registrar timestamps quando iniciar/concluir fase.
- `metrica.scores`: manter média para relatórios (usado em `/status-projeto`).
- `metrica.ultimoComando`: útil para retomar contexto entre sessões.

## 4. Troubleshooting
- **Estado ausente**: `/maestro` deve sugerir `/iniciar-projeto`.
- **Divergência com fluxo MCP**: `/maestro` lista fases divergentes; ajustar manualmente ou reinicializar.
- **Quality gate falhou**: `/avancar-fase` explica motivo e indica arquivos a revisar; refaça `/continuar-fase` com foco no ponto pendente.
- **Mudança de IDE**: consultar `guides/multi-ide.md` para garantir que workflows/skills estejam no local correto.

## 5. Checklist antes de concluir uma fase
- Entregável existe e segue template.
- Regras específicas cumpridas (`rules/validation-rules.md`).
- Quality gate da transição validado (`rules/quality-gates.md`).
- Estado atualizado (status, score, notas, timestamps).
- Evento registrado em `historico` com resumo e próximos passos.

## 6. Próximos passos sugeridos
- Automatizar atualização do estado dentro dos workflows (scripts mentais).
- Criar smoke tests para cada comando nas IDEs suportadas.
- Estender métricas para dashboards ou relatórios automáticos.
- Documentar casos de uso avançados (ex.: projetos multi-tier, Stitch opcional).
