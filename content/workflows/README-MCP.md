# Workflows MCP Maestro

Workflows integrados para desenvolvimento com MCP Maestro.

---

## 🎯 Workflows Disponíveis

### Gerenciamento de Projeto

| Comando | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[/mcp-start](mcp-start.md)** | Iniciar projeto MCP | Criar novo projeto do zero |
| **[/mcp-next](mcp-next.md)** | Avançar fase | Após completar entregável |
| **[/mcp-status](mcp-status.md)** | Ver status | Verificar progresso e métricas |
| **[/mcp-gate](mcp-gate.md)** | Validar gate | Checar qualidade antes de avançar |

### Desenvolvimento

| Comando | Descrição | Quando Usar |
|---------|-----------|-------------|
| **[/mcp-feature](mcp-feature.md)** | Nova feature | Adicionar funcionalidade |
| **[/mcp-debug](mcp-debug.md)** | Corrigir bug | Debugging estruturado |
| **[/mcp-refactor](mcp-refactor.md)** | Refatorar código | Melhorar qualidade sem mudar comportamento |

---

## 🚀 Quick Start

### 1. Criar Novo Projeto

```bash
/mcp-start
```

**O workflow irá:**
- Perguntar nome e descrição do projeto
- Classificar automaticamente (POC/Script/Internal/Product + Simples/Médio/Complexo)
- Apresentar classificação sugerida
- Aguardar confirmação
- Iniciar Fase 1 (Produto)

### 2. Trabalhar nas Fases

```bash
# Após completar entregável da fase
/mcp-next docs/01-produto/PRD.md
```

**O workflow irá:**
- Validar gate da fase (score 0-100)
- Se score >= 70: Avança automaticamente ✅
- Se score < 70: Mostra pendências e bloqueia 🔴
- Apresenta próxima fase + especialista

### 3. Verificar Progresso

```bash
/mcp-status
```

**Mostra:**
- Fase atual (X/Y)
- Progresso percentual
- Score do último gate
- Próximos passos

---

## 📊 Fluxo Completo

```
/mcp-start
  ↓
[Trabalhar em Fase 1]
  ↓
/mcp-next [entregavel]
  ↓
[Trabalhar em Fase 2]
  ↓
/mcp-next [entregavel]
  ↓
...
  ↓
[Projeto Concluído] ✅
```

---

## 🔄 Fluxos Alternativos

### Adicionar Feature em Projeto Existente

```bash
/mcp-feature Sistema de notificações push
```

**Fluxo de 6 fases:**
1. Análise de Impacto
2. Refinamento de Requisitos
3. Design/Arquitetura
4. Implementação (Contrato → FE/BE → Integração)
5. Testes
6. Deploy

### Corrigir Bug

```bash
/mcp-debug Pedido duplicado ao clicar rapidamente
```

**Fluxo de 4 fases:**
1. Reprodução do Bug
2. Análise de Causa Raiz
3. Fix + Testes de Regressão
4. Deploy

### Refatorar Código

```bash
/mcp-refactor Serviço de autenticação
```

**Fluxo de 5 fases:**
1. Análise de Código Atual
2. Testes de Caracterização
3. Refatoração Incremental
4. Validação
5. Deploy

---

## 🎚️ Sistema de Gates Adaptativos

### Tier Essencial (POC, Script)
**Foco:** Funciona?
- Código executa sem erros
- Funcionalidade principal OK

### Tier Base (Internal, Product Simples)
**Foco:** Padrão indústria
- Tier Essencial +
- Testes unitários (>60%)
- Lint sem erros
- Segurança básica (OWASP)

### Tier Avançado (Product Complexo)
**Foco:** Estado da arte
- Tier Base +
- Testes E2E
- Observabilidade
- Performance otimizada
- Compliance (LGPD, SOC2)

---

## 🔐 Gate Protection Protocol

> [!CAUTION]
> **Regras de Proteção:**
> 
> - ✅ Score >= 70: Avança automaticamente
> - 🔴 Score < 70: **BLOQUEIA** avanço
> - ⚠️ IA **NUNCA** aprova gates automaticamente
> - 📝 Usuário pode forçar com `/mcp-gate approve [motivo]`

---

## 📐 Protocolo Frontend-First

Para features com Frontend + Backend:

```
1. CONT (Contrato API)
   ├── Gera: openapi.yaml
   ├── Gera: types (FE + BE)
   └── Gera: Mock Server

2. Paralelo ⚡
   ├── FE (desenvolve contra mock)
   └── BE (implementa contrato)

3. INT (Integração)
   ├── Remove mocks
   ├── Conecta FE ↔ BE real
   └── Testes E2E
```

---

## 🧠 Especialistas MCP

Os workflows carregam especialistas automaticamente via:

```
maestro://especialista/{nome}
```

**24 especialistas disponíveis:**
- Gestão de Produto
- Engenharia de Requisitos
- UX Design
- Prototipagem com Stitch (opcional)
- Modelagem de Domínio
- Banco de Dados
- Arquitetura de Software
- Segurança
- Testes
- Performance
- Observabilidade
- Plano de Execução
- Contrato de API
- Frontend
- Backend
- DevOps
- E mais...

---

## 📁 Estrutura de Arquivos

Workflows MCP criam automaticamente:

```
[projeto]/
├── .maestro/
│   ├── estado.json          # ⭐ Fonte da verdade
│   ├── resumo.json          # Cache de contexto
│   └── gates-forcados.log   # Histórico de aprovações manuais
└── docs/
    ├── 01-produto/
    │   └── PRD.md
    ├── 02-requisitos/
    │   └── requisitos.md
    ├── 03-ux/
    │   └── design-doc.md
    └── ...
```

---

## 🔧 Protocolo Stateless (CRÍTICO)

> [!IMPORTANT]
> **SEMPRE antes de chamar qualquer tool MCP:**
> 
> ```typescript
> const estadoJson = await fs.readFile('.maestro/estado.json', 'utf-8');
> 
> await mcp_maestro_[tool]({
>   estado_json: estadoJson,  // OBRIGATÓRIO
>   diretorio: process.cwd(),
>   // ... outros parâmetros
> });
> ```

---

## 🆚 Comparação com Workflows Padrão

| Workflow Padrão | Workflow MCP | Diferença |
|----------------|--------------|-----------|
| `/create` | `/mcp-start` | Classificação adaptativa + gates |
| `/plan` | `/mcp-start` | Fluxo de fases estruturado |
| `/enhance` | `/mcp-feature` | Frontend-First + validação |
| `/debug` | `/mcp-debug` | Análise de causa raiz |
| `/status` | `/mcp-status` | Métricas MCP + progresso |
| - | `/mcp-gate` | Validação de qualidade |
| - | `/mcp-refactor` | Testes de caracterização |

---

## 📖 Documentação Completa

Cada workflow tem documentação detalhada:

- **[/mcp-start](mcp-start.md)** - Wizard de inicialização
- **[/mcp-next](mcp-next.md)** - Sistema de gates
- **[/mcp-feature](mcp-feature.md)** - Fluxo de features
- **[/mcp-debug](mcp-debug.md)** - Debugging sistêmico
- **[/mcp-status](mcp-status.md)** - Dashboard de status
- **[/mcp-gate](mcp-gate.md)** - Validação de qualidade
- **[/mcp-refactor](mcp-refactor.md)** - Refatoração segura

---

## 🎓 Exemplos Práticos

### SaaS Simples (7 fases)

```bash
# Iniciar
/mcp-start TaskFlow

> Tipo: Internal
> Complexidade: Simples
> Fases: 7

# Trabalhar em cada fase
/mcp-next docs/01-produto/PRD.md
/mcp-next docs/02-requisitos/requisitos.md
...
```

### Fintech Complexo (17 fases)

```bash
# Iniciar
/mcp-start PaySecure

> Tipo: Product
> Complexidade: Complexo
> Fases: 17
> Tier: Avançado (compliance, observabilidade, etc)

# Trabalhar em cada fase
/mcp-next [entregavel]
...
```

### Adicionar Feature

```bash
# No projeto existente
/mcp-feature Integração com WhatsApp

> Impacto: médio
> Fases: 6 (Análise → Deploy)

# Avançar
/mcp-next [entregavel]
...
```

---

## ❓ FAQ

**P: Posso pular fases?**
R: Não com `/mcp-next`. Gates bloqueiam avanço se qualidade < 70%.

**P: Posso forçar aprovação de gate?**
R: Sim, usuário (não IA) pode usar `/mcp-gate approve [motivo]`.

**P: Como ajustar complexidade depois?**
R: Use `/mcp-start reclassificar`

**P: Workflows MCP funcionam sem MCP server?**
R: Não, eles chamam tools MCP. Use workflows padrão se não tiver MCP.

---

## 🔗 Links Úteis

- [Plano de Implementação](../../../.gemini/antigravity/brain/[conversation-id]/implementation_plan.md)
- [MCP Maestro README](../../README.md)
- [Documentação MCP](../../docs/)

---

**Versão:** 1.0.0  
**Data:** 2026-01-23  
**Autor:** Sistema MCP Maestro
