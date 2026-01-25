# 🔐 Quality Gates por Transição

| De → Para | Checklist Obrigatória | Validadores sugeridos |
|-----------|----------------------|------------------------|
| Produto → Requisitos | MVP 100% coberto nos requisitos; personas refletidas | `validarCoberturaMVP(PRD, requisitos)` |
| Requisitos → UX Design | Fluxos/jornadas definidos; critérios de aceite aprovados | `analisarFluxosUsuarios(requisitos)` |
| UX Design → Prototipagem (Stitch) | Wireframes completos; estilo aprovado | `validarWireframes(designDoc)` |
| Prototipagem → Arquitetura | Feedback aplicado; requisitos atualizados | `verificarConsistencia(designDoc, requisitos)` |
| Arquitetura → Modelo de Domínio | Stack confirmada; contexto alinhado | `compararModelagem(arquitetura, modeloDominio)` |
| Modelo de Domínio → Banco de Dados | Entidades → tabelas; regras documentadas | `validarModeloDominio(modeloDominio, designBanco)` |
| Banco → Segurança | Dados sensíveis catalogados; políticas definidas | `analisarSensibilidade(designBanco)` |
| Segurança → Testes | Controles críticos definidos; riscos registrados | `validarChecklistSeguranca(checklist)` |
| Testes → Backlog | Estratégia de testes aprovada; cobertura planejada | `verificarPlanoTestes(plano)` |
| Backlog → Contrato API | Stories/radar de integrações aprovados | `compararBacklogContrato(backlog, openapi)` |
| Contrato API → Frontend | OpenAPI completo; mocks disponíveis | `validarContrato(openapi)` |
| Frontend → Backend | Componentes integrados a mocks; testes passando | `executarSuite('frontend-tests')` |
| Backend → Integração/Deploy | Testes unitários/integração/contrato passando | `executarSuite('backend-tests')` |
| Integração → Observabilidade (fluxo complexo) | Pipelines verdes; monitoração básica configurada | `validarPipeline(ciCdConfig)` |
| Observabilidade → Performance | Dashboards + alertas definidos | `validarObservabilidade(config)` |
| Performance → Deploy Final | Testes de carga concluídos; tuning aplicado | `executarLoadTest(plan)` |

## Exemplo de validação cruzada (Produto → Requisitos)

```javascript
function validarCoberturaMVP(prdPath, requisitosPath) {
  const prd = lerArquivo(prdPath);
  const requisitos = lerArquivo(requisitosPath);
  const mvpItems = extrairItens('MVP', prd);
  const faltantes = mvpItems.filter(item => !requisitos.includes(item));

  return {
    percentual: ((mvpItems.length - faltantes.length) / mvpItems.length) * 100,
    faltantes
  };
}
```

## Uso no /avancar-fase

1. Determine a transição atual (fase `N` → `N+1`).
2. Carregue o checklist correspondente na tabela acima.
3. Execute as funções auxiliares indicadas (ou use lógica equivalente).
4. Só permita avanço quando **todos** os itens estiverem `true` e o score da fase atingir o mínimo definido em `validation-rules.md`.
