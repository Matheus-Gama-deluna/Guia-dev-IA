---
description: Mapeamento fase ↔ especialista, prompts, templates e skills
---

# 📚 Mapa de Fases MCP → Recursos do Conteúdo

| Fase | Especialista | Prompt principal | Template(s) | Skills/Notas |
|------|--------------|------------------|-------------|--------------|
| 1. Produto | specialists/Especialista em Gestão de Produto.md | prompts/produto.md | templates/PRD.md | Skills: Produto, Discovery; carregar PRD existente antes de iniciar. |
| 2. Requisitos | specialists/Especialista em Engenharia de Requisitos com IA.md | prompts/requisitos.md | templates/requisitos.md, templates/matriz-rastreabilidade.md | Skills: Requirements, QA; referenciar MVP da fase 1. |
| 3. UX Design | specialists/Especialista em UX Design.md | prompts/ux.md | templates/design-doc.md, templates/mapa-navegacao.md | Skills: UX, Acessibilidade. |
| 4. Modelo de Domínio | specialists/Especialista em Modelagem e Arquitetura de Domínio com IA.md | prompts/modelo-dominio.md | templates/modelo-dominio.md | Skills: Architecture, Domain-driven. |
| 5. Banco de Dados | specialists/Especialista em Banco de Dados.md | prompts/banco.md | templates/design-banco.md | Skills: Database, Performance. |
| 6. Arquitetura | specialists/Especialista em Arquitetura de Software.md | prompts/arquitetura.md | templates/arquitetura.md, templates/adr.md | Skills: Architecture, Security. |
| 7. Segurança | specialists/Especialista em Segurança da Informação.md | prompts/seguranca.md | templates/checklist-seguranca.md | Skills: Security. |
| 8. Testes | specialists/Especialista em Análise de Testes.md | prompts/testes.md | templates/plano-testes.md, templates/criterios-aceite.md | Skills: Testing. |
| 9. Backlog | specialists/Especialista em Plano de Execução com IA.md | prompts/backlog.md | templates/backlog.md, templates/historia-usuario.md | Skills: Agile/Execution. |
| 10. Contrato API | specialists/Especialista em Contrato de API.md | prompts/api.md | templates/contrato-api.md | Skills: API, Integration. |
| 11. Frontend | specialists/Especialista em Desenvolvimento Frontend.md | prompts/frontend.md | templates/historia-frontend.md | Skills: Frontend, UI. |
| 12. Backend | specialists/Especialista em Desenvolvimento e Vibe Coding Estruturado.md | prompts/backend.md | templates/historia-backend.md | Skills: Backend, Clean Code. |
| 13. Integração/Deploy | specialists/Especialista em DevOps e Infraestrutura.md | prompts/devops.md | templates/arquitetura.md, templates/slo-sli.md | Skills: DevOps, Observabilidade. |

> Para fluxos simples (7 fases), considere apenas as linhas 1–7. Para fluxos complexos (17 fases), acrescente especialistas adicionais conforme `src/src/flows/types.ts` (Arquitetura Avançada, Performance, Observabilidade, etc.).

## Como usar nos workflows

1. **/continuar-fase**: após identificar a fase, abra o especialista e prompt correspondentes (ver tabela). Mencione explicitamente na resposta quais templates serão atualizados.
2. **/avancar-fase**: use `entregavel_esperado` da tabela para verificar arquivos e validações antes de avançar.
3. **/status-projeto**: liste os especialistas por fase concluída/parcial para ajudar o usuário a saber quem está ativo.

## Manutenção

- Sempre que um novo especialista ou template for adicionado, atualize esta tabela.
- Se um prompt for renomeado, ajuste o nome aqui e nos workflows.
- Skills podem ser expandidas mencionando diretórios específicos em `content/skills/`.
