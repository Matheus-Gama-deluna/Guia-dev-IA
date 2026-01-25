---
description: Adicionar nova feature com fluxo estruturado (Análise → Implementação → Deploy)
---

# /nova-feature - Nova Feature Maestro

$ARGUMENTS

---

## Pré-requisitos e integração com o Maestro

1. Execute `/maestro` para garantir que o estado esteja sincronizado com os fluxos MCP (7/13/17 + Stitch).
2. Carregue o estado antes de qualquer tool:
   ```javascript
   const estado = lerJson('.maestro/estado.json');
   function salvarEstado(novoEstado) {
     escreverJson('.maestro/estado.json', novoEstado, { spaces: 2 });
   }
   ```
3. Use `content/guides/fases-mapeamento.md` para alinhar especialistas, prompts e templates de suporte a features.
4. Todos os artefatos criados devem ficar dentro de `docs/features/FEATURE-ID/` e ser registrados em `estado.historico`.

---

## Objetivo

Adicionar nova funcionalidade em projeto existente usando fluxo estruturado de 6 fases do MCP Maestro.

---

## Quando Usar

- Adicionar feature em produto já existente
- Feature que impacta arquitetura, modelo ou API
- Feature que precisa de análise de impacto

**NÃO usar para:**
- Correção de bugs → Use `/corrigir-bug`
- Melhorias de código → Use `/refatorar-codigo`
- Novo projeto → Use `/iniciar-projeto`

---

## Fluxo de 6 Fases

```
1. Análise de Impacto
   ↓
2. Refinamento de Requisitos
   ↓
3. Design/Arquitetura
   ↓
4. Implementação (Contrato → FE/BE paralelo → Integração)
   ↓
5. Testes
   ↓
6. Deploy
```

---

## Execução

### Passo 1: Coleta de Informações

**Perguntar ao usuário:**

```markdown
🆕 **Nova Feature**

1. Descreva a funcionalidade a ser adicionada:
   [Exemplo: Sistema de notificações push para usuários]

2. Qual o impacto estimado?
   - **baixo**: Pequena mudança, sem impacto em arquitetura
   - **médio**: Mudança moderada, pode afetar alguns módulos
   - **alto**: Grande mudança, afeta arquitetura core

   Escolha: [baixo/médio/alto]
```

**Se forneceu argumentos:**

```bash
/nova-feature Sistema de notificações push
```

→ Usar como descrição, pedir apenas impacto

---

### Passo 2: Iniciar Fluxo de Feature

> [!IMPORTANT]
> **Protocolo stateless:** sempre envie `estado_json` carregado do disco para os tools MCP.

```typescript
const estadoJson = lerArquivo('.maestro/estado.json');

await mcp_maestro_nova_feature({
  descricao: "[descrição fornecida]",
  impacto_estimado: "[baixo/médio/alto]",
  estado_json: estadoJson,
  diretorio: process.cwd()
});
```

Após a resposta, atualize `estado.historico` com `acao: "feature_iniciada"`, registrando `feature_id` e impacto.

**MCP cria contexto separado para a feature e retorna:**

```json
{
  "feature_id": "FEAT-001",
  "fases": [
    "Análise de Impacto",
    "Refinamento",
    "Design",
    "Implementação",
    "Testes",
    "Deploy"
  ],
  "fase_atual": 1
}
```

---

### Passo 3: Fase 1 - Análise de Impacto

**Apresentar:**

```markdown
✅ **Fluxo de Feature Iniciado** (FEAT-001)

---

🎯 **Fase 1/6: Análise de Impacto**
🤖 **Especialista:** Arquitetura de Software

## Análise de Impacto

Antes de implementar, vamos analisar:

1. **Modelo de Dados** - Novas entidades ou alterações?
   - Tabelas afetadas:
   - Novos campos:
   - Relacionamentos:

2. **APIs** - Novos endpoints ou mudanças?
   - Endpoints novos:
   - Endpoints modificados:
   - Breaking changes:

3. **Arquitetura** - Novos serviços ou refatorações?
   - Novos módulos:
   - Dependências:
   - Integrações externas:

4. **Frontend** - Componentes e páginas?
   - Novos componentes:
   - Páginas afetadas:
   - Mudanças de UX:

Vamos começar. Que **entidades** ou **tabelas** serão afetadas?
```

---

### Passo 4: Avançar Entre Fases (Frontend-First)

**Usar `/avancar-fase` (via `/maestro`) para conectar com o fluxo principal**

Quando estiver trabalhando dentro da feature, o acompanhamento das fases internas segue o mesmo padrão do Maestro. Utilize:

```
Fase 1: Análise ✅
  ↓ /avancar-fase (passando o artefato docs/features/FEATURE-ID/01-impacto.md)
Fase 2: Requisitos ✅
  ↓ /avancar-fase
...
```

Caso precise apenas retomar o trabalho da feature antes de avançar, use `/continuar-fase` com o arquivo da subfase correspondente.

---

### Passo 4: Avançar Entre Fases (Frontend-First)

**Mapeie especialistas e templates** usando `guides/fases-mapeamento.md` para cada etapa abaixo e carregue os prompts adequados (ex.: Contrato API → especialista "Contrato de API").

```
Fase 1: Análise ✅
  ↓ /avancar-fase (ou `/maestro` → sugere avanço)
Fase 2: Requisitos ✅
  ↓ /avancar-fase
Fase 3: Design ✅ (gera contrato OpenAPI)
  ↓ /avancar-fase
Fase 4: Implementação
  ├─ US-001-CONT (Contrato) ✅
  ├─ US-001-FE (Frontend) 🔄 ← Paralelo
  ├─ US-001-BE (Backend) 🔄 ← Paralelo
  └─ INT-001 (Integração) ⏳ ← Após FE+BE
  ↓ /avancar-fase
Fase 5: Testes ✅
  ↓ /avancar-fase
Fase 6: Deploy ✅ (encerra feature e atualiza estado)
```

**Protocolo Frontend-First:**

1. **Contrato primeiro** (CONT-001)
   - Gera OpenAPI YAML
   - Gera types para FE e BE
   - Gera mock server

2. **FE e BE em paralelo**
   - Frontend desenvolve contra mock
   - Backend implementa contrato
   - Ambos seguem types gerados

3. **Integração no final**
   - Remove mocks
   - Conecta FE com BE real
   - Testes E2E

---

### Passo 5: Implementar História

**Na Fase 4 (Implementação):**

```typescript
const estadoJson = lerArquivo('.maestro/estado.json');

// Contrato
await mcp_maestro_implementar_historia({
  historia_id: "US-001-CONT",
  modo: "iniciar",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

// Frontend (pode iniciar em paralelo após contrato)
await mcp_maestro_implementar_historia({
  historia_id: "US-001-FE",
  modo: "iniciar",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

// Backend (pode iniciar em paralelo após contrato)
await mcp_maestro_implementar_historia({
  historia_id: "US-001-BE",
  modo: "iniciar",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

// Integração (somente após FE e BE finalizados)
await mcp_maestro_implementar_historia({
  historia_id: "INT-001",
  modo: "iniciar",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

salvarEstado(atualizarHistorico(estado, { acao: 'feature_historia_iniciada', historia: 'INT-001' }));
```

---

## Exemplos de Uso

### Exemplo 1: Feature Simples (Impacto Baixo)

```
User: /nova-feature Adicionar filtro de data na listagem de pedidos

AI: Qual o impacto estimado? (baixo/médio/alto)

User: baixo

AI: ✅ Fluxo de Feature Iniciado (FEAT-001)
    
    🎯 Fase 1/6: Análise de Impacto
    
    ## Análise Rápida
    
    Impacto baixo detectado. Feature simples:
    - Frontend: Adicionar DatePicker component
    - Backend: Adicionar parâmetro `?date_from` e `?date_to` em GET /orders
    - Banco: Sem mudanças (usa índice existente)
    
    Correto? Vamos para refinamento?

User: Sim

AI: [Avança para Fase 2 executando `/maestro` → `/avancar-fase`]
```

### Exemplo 2: Feature Complexa (Impacto Alto)

```
User: /nova-feature Sistema de notificações push em tempo real

AI: Qual o impacto estimado?

User: alto

AI: ✅ Fluxo de Feature Iniciado (FEAT-002)
    
    🎯 Fase 1/6: Análise de Impacto
    
    ## Análise Profunda Necessária
    
    Impacto alto detectado. Feature complexa:
    
    **Modelo de Dados:**
    - Nova tabela: `notifications`
    - Novo relacionamento: `users` ← `notifications`
    
    **Arquitetura:**
    - Novo serviço: `NotificationService`
    - Integração: Firebase Cloud Messaging (FCM)
    - Infraestrutura: WebSocket server
    
    **Frontend:**
    - Service Worker para push
    - Componente NotificationBell
    - Página de configurações
    
    **Backend:**
    - Endpoints: POST /notifications, GET /notifications
    - Job: NotificationDispatcherJob
    
    Vamos detalhar cada parte. Começando pelo modelo de dados...
```

---

## Comandos Relacionados

```
/nova-feature [descrição] → Inicia fluxo de feature alinhado ao estado
/continuar-fase          → Retoma etapa corrente da feature
/avancar-fase            → Valida gate e registra próxima fase
/corrigir-bug            → Se surgir bug durante a feature
```

---

## Estrutura de Arquivos Gerados

```
docs/
├── features/
│   └── FEAT-001-filtro-data/
│       ├── 01-impacto.md
│       ├── 02-requisitos.md
│       ├── 03-design.md
│       ├── 04-contrato.yaml
│       ├── 05-plano-testes.md
│       └── 06-deploy-plan.md
```

---

## Regras Críticas

### ✅ SEMPRE:

1. Fazer análise de impacto antes de implementar
2. Gerar contrato de API antes de FE/BE
3. Testar integração após FE+BE prontos
4. Documentar mudanças em ADR se impacto alto

### ❌ NUNCA:

1. Pular análise de impacto (Fase 1)
2. Implementar FE/BE antes do contrato
3. Fazer breaking changes sem versionamento de API
4. Deploy sem testes E2E

---

## Frontend-First Protocol

> [!TIP]
> **Para features que envolvem Frontend + Backend:**
> 
> ```
> 1. CONT (Contrato API)
>    ├── Gera: openapi.yaml
>    ├── Gera: types (FE + BE)
>    └── Gera: Mock Server
>    
> 2. Paralelo ⚡
>    ├── FE (contra mock)
>    └── BE (implementa contrato)
>    
> 3. INT (Integração)
>    ├── Remove mocks
>    ├── Conecta FE ↔ BE real
>    └── Testes E2E
> ```

---

## Troubleshooting

### Feature Muito Grande

**Sintoma:** Fase de implementação com 20+ histórias

**Solução:** Quebrar em features menores (épicos):

```
FEAT-001: Sistema de Notificações (Épico)
├─ FEAT-001-A: Backend (API + Jobs)
├─ FEAT-001-B: Frontend (UI)
└─ FEAT-001-C: Integração (Push)

Implementar um por vez com `/nova-feature`
```

### Conflito com Feature em Andamento

**Sintoma:** Duas features modificando mesma área

**Solução:** Finalizar uma antes de iniciar outra, ou:

```
1. Criar branch separada para cada feature
2. Definir ordem de merge (feature A → main → feature B merge)
3. Coordenar com /mcp-status para ver dependências
```
