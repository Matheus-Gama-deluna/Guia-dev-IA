---
description: Refatoração estruturada de código (Análise → Testes → Refactor → Validação)
---

# /refatorar-codigo - Refatoração Maestro

$ARGUMENTS

---

## Integração obrigatória com o Maestro

1. **Sincronize o estado** executando `/maestro` antes de começar. Garanta que não há gates bloqueados.
2. **Carregue o estado e defina helpers**:
   ```javascript
   const estado = lerJson('.maestro/estado.json');
   function salvarEstado(novoEstado) {
     escreverJson('.maestro/estado.json', novoEstado, { spaces: 2 });
   }
   ```
3. Sempre passe `estado_json` ao chamar qualquer tool MCP (`mcp_maestro_refatorar`, `mcp_maestro_avancar_refatoracao`, etc.).
4. Atualize `estado.historico` com eventos como `refatoracao_iniciada`, `refatoracao_passo_concluido` e `refatoracao_finalizada`, armazenando `refactor_id` e arquivos afetados.
5. Use `content/guides/fases-mapeamento.md` para escolher especialistas de apoio (Arquitetura, Performance, Testes) conforme o foco da refatoração.

---

## Objetivo

Refatorar código de forma segura e estruturada usando fluxo de 5 fases do MCP Maestro, com testes de caracterização e validação contínua.

---

## Quando Usar

- Melhorar qualidade de código sem mudar comportamento
- Reduzir complexidade ou débito técnico
- Preparar código para nova feature
- Migrar para novo padrão ou arquitetura

**NÃO usar para:**
- Adicionar funcionalidade → Use `/nova-feature`
- Corrigir bugs → Use `/corrigir-bug`

---

## Fluxo de 5 Fases

```
1. Análise de Código Atual
   ↓
2. Testes de Caracterização
   ↓
3. Refatoração Incremental
   ↓
4. Validação
   ↓
5. Deploy
```

**Princípio:** Nunca refatorar sem testes!

---

## Execução

### Passo 1: Coleta de Informações

**Perguntar ao usuário:**

```markdown
🔧 **Refatoração de Código**

1. Qual área deseja refatorar?
   [Exemplo: Serviço de autenticação, Controllers de API, etc]

2. Qual o motivo da refatoração?
   - **complexidade**: Código difícil de entender
   - **duplicacao**: Código repetido
   - **performance**: Lento ou ineficiente
   - **manutencao**: Difícil de manter/estender
   - **migracao**: Mudança de padrão/arquitetura

   Escolha: [complexidade/duplicacao/performance/manutencao/migracao]

3. (Opcional) Arquivos principais:
   [Lista de arquivos a refatorar]
```

---

### Passo 2: Iniciar Fluxo de Refatoração

```typescript
const estadoJson = lerArquivo('.maestro/estado.json');

await mcp_maestro_refatorar({
  area: "[área fornecida]",
  motivo: "[motivo]",
  estado_json: estadoJson,
  diretorio: process.cwd()
});

salvarEstado(registrarHistorico(estado, { acao: 'refatoracao_iniciada', area, motivo }));
```

**MCP cria contexto e retorna:**

```json
{
  "refactor_id": "REF-001",
  "fases": [
    "Análise",
    "Testes de Caracterização",
    "Refatoração",
    "Validação",
    "Deploy"
  ],
  "fase_atual": 1,
  "estrategia": "[incremental/big-bang]"
}
```

---

### Passo 3: Fase 1 - Análise de Código Atual

**Apresentar:**

```markdown
✅ **Fluxo de Refatoração Iniciado** (REF-001)

---

🎯 **Fase 1/5: Análise de Código Atual**
🤖 **Especialista:** Exploração de Codebase

## Mapeamento da Área

**Arquivos Identificados:**
- `[arquivo1.ts]` - [responsabilidade]
- `[arquivo2.ts]` - [responsabilidade]
- `[arquivo3.ts]` - [responsabilidade]

**Métricas de Código:**
- Complexidade Ciclomática: [valor]
- Linhas de código: [count]
- Duplicação: [percentual]%
- Cobertura de testes: [percentual]%

---

## Problemas Identificados

1. **[Problema 1]**
   - Arquivo: `[caminho]`
   - Evidência: [trecho de código]
   - Impacto: [alto/médio/baixo]

2. **[Problema 2]**
   - ...

---

## Estratégia Recomendada

${estrategia === 'incremental' ? `
✅ **Refatoração Incremental** (Recomendado)

Motivo: [área grande/crítica, fazer passo a passo]

Etapas:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
` : `
⚡ **Big Bang Refactor**

Motivo: [área pequena, pode fazer de uma vez]

Refatorar tudo e validar.
`}

Prosseguir? (S/N)
```

---

### Passo 4: Fase 2 - Testes de Caracterização

> [!IMPORTANT]
> **REGRA DE OURO:** Nunca refatorar sem testes!

```markdown
🎯 **Fase 2/5: Testes de Caracterização**

## O que são Testes de Caracterização?

Testes que capturam o **comportamento atual** do código.
Não testam se está "correto", mas sim "preservam" o comportamento.

---

## Testes Criados

### 1. Teste de comportamento principal

```[linguagem]
describe('[ComponenteAtual]', () => {
  it('should preserve current behavior for [scenario]', () => {
    // Arrange
    const input = [value];
    
    // Act
    const result = funcaoAtual(input);
    
    // Assert
    expect(result).toEqual([valor_atual]);
  });
});
```

### 2. Teste de edge cases

[Mais testes...]

---

## Cobertura

- **Antes:** [percentual]%
- **Depois dos testes de caracterização:** [percentual]%
- **Meta:** 80%+ antes de refatorar

✅ Todos os testes passando

Pronto para refatorar com segurança!
```

---

### Passo 5: Fase 3 - Refatoração Incremental

```markdown
🎯 **Fase 3/5: Refatoração Incremental**

## Estratégia: Passos Pequenos

${estrategia === 'incremental' ? `
### Passo 1 de 3: [Nome do passo]

**Antes:**
```[linguagem]
[código antigo]
```

**Depois:**
```[linguagem]
[código refatorado]
```

**Mudanças:**
- [O que mudou]
- [Por que melhorou]

**Validação:**
- ✅ Todos os testes passam
- ✅ Comportamento preservado
- ✅ Lint OK

---

### Passo 2 de 3: [Nome do passo]

[...]

` : `
### Refatoração Completa

**Antes:**
[código antigo]

**Depois:**
[código refatorado]

**Mudanças:**
- [lista de mudanças]
`}

---

## Padrões Aplicados

${motivo === 'complexidade' ? `
- Extract Method
- Replace Conditional with Polymorphism
- Simplify Complex Expressions
` : motivo === 'duplicacao' ? `
- Extract Function
- Extract Class
- Pull Up Method
` : motivo === 'performance' ? `
- Memoization
- Lazy Loading
- Algorithm Optimization
` : `
- [Padrões específicos]
`}

---

## Validação Contínua

Após cada passo:
```bash
npm test              # Testes passam?
npm run lint          # Lint OK?
git commit -m "..."   # Commit pequeno
```

---

**Status:** [X/Y] passos completados

Continuar para próximo passo? (S/N)
```

---

### Passo 6: Fase 4 - Validação

```markdown
🎯 **Fase 4/5: Validação**

## Checklist de Qualidade

### Funcional
- [x] Todos os testes passam ✅
- [x] Comportamento preservado ✅
- [x] Edge cases cobertos ✅

### Qualidade de Código
- [x] Complexidade reduzida: [antes] → [depois] ✅
- [x] Duplicação removida: [%antes] → [%depois] ✅
- [x] Lint sem warnings ✅
- [x] Code review aprovado ✅

### Performance (se aplicável)
- [x] Benchmarks: [antes] → [depois] ✅
- [x] Sem regressão de performance ✅

---

## Comparação Antes/Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Linhas de código | [N] | [M] | [%] |
| Complexidade | [N] | [M] | [%] |
| Duplicação | [N]% | [M]% | [%] |
| Cobertura | [N]% | [M]% | [%] |

---

✅ **Refatoração Validada**

Pronto para deploy!
```

---

### Passo 7: Fase 5 - Deploy

```markdown
🎯 **Fase 5/5: Deploy**

## Estratégia de Deploy

${estrategia === 'incremental' ? `
✅ **Deploy Incremental** (Recomendado)

1. Deploy de cada passo separadamente
2. Monitorar métricas após cada deploy
3. Rollback fácil se necessário

Deploys:
- ✅ Passo 1 → Prod (2026-01-20)
- ✅ Passo 2 → Prod (2026-01-21)
- 🔄 Passo 3 → Staging (testando)
` : `
⚡ **Deploy Único**

Refatoração completa em um deploy.

Checklist:
- [ ] Testes passando em staging
- [ ] Performance validada
- [ ] Rollback plan pronto
`}

---

## Monitoramento Pós-Deploy

Métricas a observar por 24-48h:
- Error rate
- Response time
- CPU/Memory usage
- User behavior (se frontend)

---

Use: `/deploy production`
```

---

## Exemplos de Uso

### Exemplo 1: Refatorar Serviço Complexo

```
User: /refatorar-codigo

AI: Qual área deseja refatorar?

User: Serviço de autenticação

AI: Qual o motivo?

User: complexidade

AI: ✅ Fluxo iniciado (REF-001)
    
    🎯 Fase 1: Análise
    
    Arquivos:
    - services/auth.service.ts (250 linhas, complexidade 15)
    - utils/token.ts
    
    Problemas:
    1. Método login() com 80 linhas (muito grande)
    2. Lógica de validação duplicada 3x
    3. Sem separação de responsabilidades
    
    Estratégia: Incremental (3 passos)
    1. Extract validation logic
    2. Split login method
    3. Create TokenService
    
    Continuar?

User: S

AI: [Fase 2: Cria testes de caracterização]
    
    ✅ 12 testes criados (cobertura: 85%)
    
    Todos passando. Pronto para refatorar!

User: /avancar-fase (ou `/maestro` para validar e avançar)

AI: [Fase 3: Refatoração]
    
    Passo 1/3: Extract validation logic
    
    Antes:
    ```ts
    if (!email || !password) { ... }
    if (!isValidEmail(email)) { ... }
    ```
    
    Depois:
    ```ts
    const validator = new AuthValidator();
    validator.validate({ email, password });
    ```
    
    ✅ Testes passam
    
    Commit: "refactor: extract auth validation"
    
    Continuar passo 2? (S/N)
```

### Exemplo 2: Migração de Padrão

```
User: /refatorar-codigo Migrar de callback para async/await

AI: Motivo?

User: migracao

AI: ✅ Refactor initiated
    
    Detectei 15 funções com callbacks
    
    Estratégia:
    - Criar versões async em paralelo
    - Deprecar callbacks gradualmente
    - Remover após migração completa
    
    Fase 1: Análise
    [lista de funções]
    
    Fase 2: Testes
    [testa callbacks atuais]
    
    Fase 3: Implementação async
    [cria novas versões]
    
    Fase 4: Migração gradual
    [troca chamadas uma por uma]
```

---

## Comandos Relacionados

```
/refatorar-codigo [área]  → Inicia refatoração integrada ao estado
/continuar-fase          → Retoma passo atual (usa análise do artefato)
/avancar-fase            → Valida gate pós-refatoração
/status-projeto          → Ver progresso e métricas
```

---

## Estratégias de Refatoração

### Incremental (Recomendado)

**Quando:** Código crítico, área grande, equipe grande

**Vantagens:**
- Risco menor
- Rollback fácil
- Review mais simples
- Deploy contínuo

### Big Bang

**Quando:** Código isolado, área pequena, MVP

**Vantagens:**
- Mais rápido
- Contexto único

### Strangler Fig

**Quando:** Migrar sistema legado

**Passos:**
1. Criar interface nova ao lado da antiga
2. Redirecionar tráfego gradualmente
3. Remover código antigo quando 100% migrado

---

## Padrões Comuns

### Extract Method
``` Função grande → Várias funções pequenas```

### Extract Class
```Classe god object → Várias classes especializadas```

### Replace Conditional with Polymorphism
```if/else gigante → Herança/interfaces```

### Introduce Parameter Object
```Muitos parâmetros → Objeto de configuração```

---

## Regras Críticas

### ✅ SEMPRE:

1. Criar testes ANTES de refatorar
2. Commits pequenos e frequentes
3. Validar após cada passo
4. Preservar comportamento (sem features novas)
5. Code review antes de merge

### ❌ NUNCA:

1. Refatorar sem testes
2. Misturar refactor com nova feature
3. Refatorar código que não entende
4. Fazer mudanças grandes de uma vez
5. Deploy sem validação

---

## Troubleshooting

### Testes Quebram Durante Refatoração

**Causa:** Comportamento mudou acidentalmente

**Solução:**

```
1. Reverter último commit: git reset --hard HEAD~1
2. Fazer mudança menor
3. Validar testes


4. Continuar
```

### Refatoração Muito Grande

**Causa:** Scope creep

**Solução:**

```
1. Parar refatoração atual
2. Quebrar em múltiplos REF-XXX
3. Fazer um por vez
```
