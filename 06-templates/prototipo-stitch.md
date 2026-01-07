# Template: Registro de Protótipos Stitch

## Metadados
| Campo | Valor |
|-------|-------|
| Projeto | [NOME DO PROJETO] |
| Data | [DATA] |
| Responsável | [NOME] |
| Status | 🔄 Em progresso / ✅ Validado / ❌ Descartado |

---

## Protótipos Criados

### Tela 1: [Nome da Tela]

**Prompt Usado:**
```
[Cole o prompt que usou no Stitch]
```

**Resultado:**
- [ ] Gerado com sucesso
- [ ] Aprovado por stakeholders
- [ ] Código exportado

**Iterações:**
| Versão | Mudança | Resultado |
|--------|---------|-----------|
| v1 | Prompt inicial | [OK/Ajustar] |
| v2 | [Ajuste feito] | [OK/Ajustar] |

**Código Exportado:** `docs/03-ux/stitch-output/tela-1.html`

**Observações:**
- [Notas sobre o que funcionou/não funcionou]
- [Decisões tomadas]

---

### Tela 2: [Nome da Tela]

**Prompt Usado:**
```
[Cole o prompt que usou no Stitch]
```

**Resultado:**
- [ ] Gerado com sucesso
- [ ] Aprovado por stakeholders
- [ ] Código exportado

**Código Exportado:** `docs/03-ux/stitch-output/tela-2.html`

**Observações:**
- [Notas]

---

## Componentes Identificados

Após análise dos protótipos, os seguintes componentes reutilizáveis foram identificados:

| Componente | Aparece Em | Prioridade |
|------------|------------|------------|
| Navbar | Todas as telas | Alta |
| Card | Dashboard, Listagem | Alta |
| Button | Todas as telas | Alta |
| Form Input | Cadastro, Edição | Alta |
| [Outros] | [Telas] | [Alta/Média/Baixa] |

---

## Mapeamento UI → Domínio

| Elemento de UI | Entidade/Campo | Requisito |
|----------------|----------------|-----------|
| Campo "Nome" | Cliente.nome | RF001 |
| Card de agendamento | Agendamento | RF003 |
| [Outros] | [Entidade.campo] | [RFxxx] |

---

## Decisões de Design

### Tema Visual
- **Modo:** Light / Dark
- **Cor primária:** #[HEX]
- **Cor secundária:** #[HEX]
- **Fonte:** [Nome da fonte]

### Padrões de UI
- Cards com sombra sutil e bordas arredondadas
- Botões com hover state
- [Outros padrões observados]

---

## Próximos Passos

- [ ] Exportar todos os códigos para `docs/03-ux/stitch-output/`
- [ ] Analisar código com IA para extrair componentes
- [ ] Passar para UX Designer refinar
- [ ] Atualizar CONTEXTO.md com decisões visuais

---

## Arquivos Relacionados

- Prompts usados: `docs/03-ux/stitch-prompts.md`
- Código exportado: `docs/03-ux/stitch-output/`
- Design Doc (próxima fase): `docs/03-ux/design-doc.md`
