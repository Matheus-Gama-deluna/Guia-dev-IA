---
description: Valida fase atual com quality gates e prepara a próxima fase
---

# 🔄 Workflow de Avanço - /avancar-fase

## 1. Ler estado e fase atual

```javascript
const estado = lerJson('.maestro/estado.json');
const faseAtual = estado.fases[estado.faseAtual];
if (!faseAtual) throw new Error('Fase atual não existe');

function salvarEstado(state) {
  escreverJson('.maestro/estado.json', state, { spaces: 2 });
}
```

## 2. Checklist obrigatório

- `faseAtual.status` deve ser `concluida`.
- `faseAtual.score >= faseAtual.scoreMinimo`.
- Todos os itens de `faseAtual.validacoes` precisam estar `true`.
- Verificar bloqueios pendentes.

Se algum critério falhar, listar o motivo e encerrar sem avançar.

## 3. Validação cruzada

Use regras específicas da transição (ver `content/rules/quality-gates.md`). Exemplo:

```javascript
if (estado.faseAtual === 1) {
  const prd = lerArquivo('docs/01-produto/PRD.md');
  const requisitos = lerArquivo('docs/02-requisitos/requisitos.md');
  const cobertura = validarCoberturaMVP(prd, requisitos);
  if (cobertura.percentual < 100) throw new Error('MVP não está 100% coberto nos requisitos');
}
```

## 4. Determinar próxima fase

```javascript
const PROGRESSAO = {
  1: { numero: 2, nome: 'Requisitos', especialista: 'Engenharia de Requisitos', entregavel: 'docs/02-requisitos/requisitos.md' },
  2: { numero: 3, nome: 'UX Design', especialista: 'UX Designer', entregavel: 'docs/03-ux/design-doc.md' },
  // ... completar até o tier máximo
};

const proxima = PROGRESSAO[estado.faseAtual];
if (!proxima) return 'Projeto já está na última fase';
```

Depois de obter `proxima`, consulte `content/guides/fases-mapeamento.md` para descobrir:

- **Especialista** em `content/specialists/` que atuará na próxima fase
- **Prompt principal** em `content/prompts/`
- **Templates** que devem ser carregados/atualizados
- **Skills** sugeridas em `content/skills/`

Inclua essas referências na resposta final para orientar o usuário sobre o contexto que será carregado quando `/continuar-fase` for executado.

## 5. Atualizar estado

- Marcar `faseAtual.dataConclusao`.
- Incrementar `estado.faseAtual` para `proxima.numero`.
- Preparar entrada vazia para a próxima fase (`status: 'in_progress'`).
- Registrar evento no histórico (`fase_avancada`).
- Atualizar `estado.metrica.fasesConcluidas` e `estado.metrica.ultimoComando = '/avancar-fase'`.
- Chamar `salvarEstado(estado)` após todas as alterações.

## 6. Mensagem de saída

```
✅ **Fase {faseAtual.numero} - {faseAtual.nome} concluída!**
📊 Score: {faseAtual.score}/{faseAtual.scoreMinimo}
🔍 Validações: {lista de validações confirmadas}

🎯 **Próxima fase:** {proxima.nome}
👤 Especialista: {proxima.especialista}
📁 Arquivo inicial: {proxima.entregavel}

Execute `/continuar-fase` para começar imediatamente.
```
