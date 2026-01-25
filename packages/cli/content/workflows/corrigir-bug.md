---
description: Correção de bugs com fluxo estruturado (Reprodução → Análise → Fix → Regressão)
---

# /corrigir-bug - Correção de Bug Maestro

$ARGUMENTS

---

## Integração com o Maestro

1. Execute `/maestro` antes para garantir que o estado está sincronizado e detectar bloqueios ativos.
2. Crie helpers mentais para ler e salvar estado:
   ```javascript
   const estado = lerJson('.maestro/estado.json');
   function salvarEstado(next) {
     escreverJson('.maestro/estado.json', next, { spaces: 2 });
   }
   ```
3. Sempre passe `estado_json` para qualquer tool MCP que for invocado e registre eventos no `estado.historico` (`acao: "bug_iniciado"`, `bug_id`, `severidade`).
4. Use `content/guides/fases-mapeamento.md` para carregar especialistas, prompts e templates de apoio (Debugging, DevOps, Testes, etc.).

---

## Objetivo

Corrigir bugs de forma estruturada usando fluxo de 4 fases do MCP Maestro, com análise de causa raiz e testes de regressão.

---

## Quando Usar

- Bug reportado em produção ou desenvolvimento
- Comportamento inesperado que precisa investigação
- Erro que requer análise sistemática

**NÃO usar para:**
- Nova funcionalidade → Use `/nova-feature`
- Refatoração de código → Use `/refatorar-codigo`

---

## Fluxo de 4 Fases

```
1. Reprodução do Bug
   ↓
2. Análise de Causa Raiz
   ↓
3. Fix + Testes de Regressão
   ↓
4. Deploy
```

---

## Execução

### Passo 1: Coleta de Informações

**Perguntar ao usuário:**

```markdown
🐛 **Correção de Bug**

1. Descreva o bug:
   [Exemplo: Pedido duplicado ao clicar rapidamente no botão "Finalizar"]

2. Severidade do bug:
   - **critica**: Sistema inoperante, perda de dados
   - **alta**: Feature principal não funciona
   - **media**: Feature secundária afetada
   - **baixa**: Cosmético, sem impacto funcional

   Escolha: [critica/alta/media/baixa]

3. (Opcional) Como reproduzir:
   [Passos para reproduzir o bug]

4. (Opcional) Stack trace ou logs:
   [Cole aqui se disponível]
```

---

### Passo 2: Iniciar Fluxo de Debugging

> [!IMPORTANT]
> **Protocolo stateless:** carregar `.maestro/estado.json` do disco antes de qualquer chamada.

```typescript
const estadoJson = lerArquivo('.maestro/estado.json');

await mcp_maestro_corrigir_bug({
  descricao: "[descrição fornecida]",
  severidade: "[critica/alta/media/baixa]",
  ticket_id: "[opcional: JIRA-123]",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

salvarEstado(registrarHistorico(estado, { acao: 'bug_iniciado', severidade }));
```

**MCP cria contexto de bug e retorna:**

```json
{
  "bug_id": "BUG-001",
  "fases": [
    "Reprodução",
    "Análise de Causa Raiz",
    "Fix + Regressão",
    "Deploy"
  ],
  "fase_atual": 1,
  "prioridade": "[baseada na severidade]"
}
```

---

### Passo 3: Fase 1 - Reprodução do Bug

**Apresentar:**

```markdown
✅ **Fluxo de Debugging Iniciado** (BUG-001)
🚨 **Severidade:** [critica/alta/media/baixa]

---

🎯 **Fase 1/4: Reprodução do Bug**
🤖 **Especialista:** Debugging e Troubleshooting

## Reprodução Sistemática

Vamos reproduzir o bug de forma controlada:

1. **Ambiente**
   - Onde ocorre: [dev/staging/prod]
   - Versão: [commit/tag]
   - Browser/Device: [se aplicável]

2. **Passos para Reproduzir**
   1. [Passo 1]
   2. [Passo 2]
   3. [Passo 3]

3. **Comportamento Esperado**
   - [O que deveria acontecer]

4. **Comportamento Atual**
   - [O que está acontecendo]

5. **Evidências**
   - Screenshots: [urls se disponível]
   - Logs: [trechos relevantes]
   - Network: [requests falhando]

Conseguiu reproduzir o bug? (S/N)
```

---

### Passo 4: Fase 2 - Análise de Causa Raiz

**Carregar especialista de Debugging:**

```typescript
const especialista = await fetch('maestro://especialista/debugging-troubleshooting');
```

**Apresentar:**

```markdown
🎯 **Fase 2/4: Análise de Causa Raiz**

## Investigação Sistemática

### Hipóteses Possíveis

Baseado nos sintomas, lista de causas prováveis:

1. ❓ **[Hipótese 1 - Mais provável]**
   - Evidência: [log/código que apoia]
   - Como testar: [validação]

2. ❓ **[Hipótese 2]**
   - Evidência: [...]
   - Como testar: [...]

3. ❓ **[Hipótese 3 - Menos provável]**
   - Evidência: [...]
   - Como testar: [...]

### Análise de Código

Arquivos suspeitos:
- `[arquivo1.ts]` - [motivo]
- `[arquivo2.ts]` - [motivo]

Vamos investigar a hipótese 1. [Análise detalhada do código]
```

**Processo de eliminação:**

```markdown
**Testando Hipótese 1:** [descrição]

[Análise do código/logs]

**Resultado:** ✅ Confirmada / ❌ Descartada

---

🎯 **Causa Raiz Identificada:**

[Explicação detalhada do problema]

**Por que aconteceu:**
- [Motivo 1]
- [Motivo 2]

**Onde está o bug:**
- Arquivo: `[caminho/arquivo.ts]`
- Linha: [numero]
- Função: `[nomeFuncao]`
```

---

### Passo 5: Fase 3 - Fix + Testes de Regressão

**Apresentar:**

```markdown
🎯 **Fase 3/4: Fix + Testes de Regressão**

## Correção Proposta

```[linguagem]
// ❌ ANTES (com bug)
[código com problema]

// ✅ DEPOIS (corrigido)
[código corrigido]
```

**Explicação da correção:**
[Por que isso resolve o problema]

---

## Testes de Regressão

Para garantir que o fix funciona E não quebra nada:

### 1. Teste Unitário (Novo)

```[linguagem]
describe('[NomeDaFuncao]', () => {
  it('should [comportamento esperado]', () => {
    // Arrange
    [setup]
    
    // Act
    [execução]
    
    // Assert
    [validação]
  });
  
  it('should not [regressão possível]', () => {
    // Testa efeito colateral
  });
});
```

### 2. Teste de Integração

[Cenário E2E que valida o fix]

### 3. Validação Manual

Passos para testar manualmente:
1. [Passo 1]
2. [Passo 2]
3. ✅ [Resultado esperado]

---

Implementar correção e rodar testes? (S/N)
```

---

### Passo 6: Fase 4 - Deploy

**Coordenar com `/deploy`:**

```markdown
🎯 **Fase 4/4: Deploy**

## Estratégia de Deploy

**Severidade: [critica/alta/media/baixa]**

### Se Crítica:
- 🚨 Hotfix imediato
- Deploy direto em prod após validação em staging
- Rollback plan pronto

### Se Alta:
- Deploy em staging → validação → prod
- Comunicar stakeholders

### Se Média/Baixa:
- Incluir no próximo release
- Documentar no CHANGELOG

---

**Checklist Pré-Deploy:**
- [ ] Fix implementado
- [ ] Testes unitários passando
- [ ] Testes de regressão passando
- [ ] Code review aprovado
- [ ] Validado em staging

Executar deploy? Use `/deploy [ambiente]`
```

---

## Exemplos de Uso

### Exemplo 1: Bug Crítico (Duplicação de Pedido)

```
User: /corrigir-bug

AI: Descreva o bug:

User: Pedido duplicado ao clicar rapidamente no botão Finalizar

AI: Severidade?

User: critica

AI: ✅ Fluxo iniciado (BUG-001) - Severidade CRÍTICA
    
    🎯 Fase 1: Reprodução
    
    Vamos reproduzir de forma controlada:
    1. Criar pedido
    2. Clicar rapidamente 2x em "Finalizar"
    3. Verificar banco de dados
    
    Reproduzido ✅
    
    [Avança para Fase 2]
    
    🎯 Fase 2: Análise de Causa Raiz
    
    Hipóteses:
    1. ❓ Falta de debounce no botão (MAIS PROVÁVEL)
    2. ❓ Falta de idempotência no endpoint
    3. ❓ Race condition no banco
    
    Analisando código de `CheckoutButton.tsx`...
    
    🎯 Causa Raiz: Botão sem debounce + endpoint não idempotente
    
    [Avança para Fase 3]
    
    🎯 Fase 3: Fix
    
    ```typescript
    // ❌ ANTES
    <button onClick={handleCheckout}>Finalizar</button>
    
    // ✅ DEPOIS
    <button 
      onClick={debounce(handleCheckout, 300)}
      disabled={isProcessing}
    >
      Finalizar
    </button>
    ```
    
    + Adicionar idempotency key no backend
    
    Testes criados ✅
    
    [Avança para Fase 4]
    
    🎯 Fase 4: Deploy
    
    Severidade CRÍTICA → Hotfix imediato
    
    Use: /deploy production --hotfix
```

### Exemplo 2: Bug de UI (Baixa Severidade)

```
User: /corrigir-bug Botão de logout desalinhado no mobile

AI: Severidade?

User: baixa

AI: ✅ Fluxo iniciado (BUG-002) - Severidade BAIXA
    
    Bug cosmético. Incluir no próximo release.
    
    Fase 1: Reprodução ✅
    Fase 2: CSS incorreto identificado
    Fase 3: Fix aplicado
    Fase 4: Agendar para próximo deploy
```

---

## Comandos Relacionados

```
/mcp-debug [descrição]      → Inicia fluxo de debugging
/mcp-next                   → Avança entre fases
/deploy --hotfix            → Deploy emergencial (bugs críticos)
```

---

## Estrutura de Arquivos Gerados

```
docs/
├── bugs/
│   └── BUG-001-pedido-duplicado/
│       ├── 01-reproducao.md
│       ├── 02-causa-raiz.md
│       ├── 03-fix-e-testes.md
│       └── 04-deploy-log.md
```

---

## Regras Críticas (Root Cause Analysis)

### ✅ SEMPRE:

1. Reproduzir bug ANTES de tentar corrigir
2. Fazer análise de causa raiz (não apenas sintomas)
3. Adicionar testes que capturam o bug
4. Validar em staging antes de prod (exceto hotfixes)
5. Documentar causa raiz para aprendizado

### ❌ NUNCA:

1. "Corrigir" sem entender a causa
2. Deploy de fix crítico sem testes
3. Assumir causa raiz sem evidências
4. Esquecer de testar efeitos colaterais
5. Deixar bug sem teste de regressão

---

## Matriz de Severidade → Ação

| Severidade | SLA | Deploy | Comunicação |
|------------|-----|--------|-------------|
| **Crítica** | 1h | Hotfix imediato | Stakeholders + usuários |
| **Alta** | 4h | Próximo deploy | Stakeholders |
| **Média** | 1-2 dias | Release agendado | Interno |
| **Baixa** | 1 semana | Quando conveniente | Changelog |

---

## Protocolo de Hotfix (Bugs Críticos)

```
1. Criar branch: hotfix/BUG-001-pedido-duplicado
2. Fix + testes
3. Deploy staging → validar
4. Deploy prod
5. Merge back to main
6. Post-mortem (se necessário)
```

---

## Troubleshooting

### Não Consigo Reproduzir

**Ação:**

```markdown
Se não conseguiu reproduzir:

1. **Coletar mais informações**
   - Logs mais detalhados
   - Request/Response headers
   - Estado do banco no momento

2. **Testar em ambiente idêntico**
   - Mesma versão
   - Mesmos dados
   - Mesmo browser/device

3. **Race condition?**
   - Tentar com diferentes timings
   - Usar ferramentas de slow-motion (Network throttling)
```

### Múltiplas Causas Possíveis

**Ação:**

```markdown
Se várias hipóteses igualmente prováveis:

1. Testar todas sistematicamente
2. Usar método de bisseção (git bisect)
3. Adicionar logs temporários
4. Pair programming com colega
```
