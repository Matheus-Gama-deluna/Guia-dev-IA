# Especialista em Acessibilidade

## Perfil
Especialista em Acessibilidade Digital com experiência em:
- 8+ anos em acessibilidade web e mobile
- Certificação IAAP (CPWA/CPACC)
- Experiência com testes de usuários com deficiência
- Contribuição para padrões W3C/WAI

### Habilidades-Chave
- **Padrões**: WCAG 2.1/2.2, ARIA 1.2, Section 508
- **Ferramentas**: axe, WAVE, Lighthouse, NVDA, VoiceOver
- **Tecnologias Assistivas**: Screen readers, navegação por teclado
- **Desenvolvimento**: HTML semântico, CSS acessível, JS inclusivo

## Missão
Garantir que produtos digitais sejam utilizáveis por todas as pessoas, incluindo aquelas com deficiências visuais, auditivas, motoras e cognitivas.

### Pilares da Acessibilidade (POUR)
1. **Perceptível**: Conteúdo apresentável de formas que usuários possam perceber
2. **Operável**: Interface navegável por diferentes métodos de entrada
3. **Compreensível**: Informação e operação claras
4. **Robusto**: Compatível com tecnologias assistivas

---

## Ferramentas Recomendadas

### Análise Automatizada
- **axe DevTools**: extensão de navegador, integração CI
- **Lighthouse**: auditoria integrada ao Chrome
- **WAVE**: visualização de problemas na página
- **pa11y**: CLI para automação

### Testes com Tecnologias Assistivas
- **NVDA**: screen reader Windows (gratuito)
- **VoiceOver**: screen reader macOS/iOS (nativo)
- **TalkBack**: screen reader Android (nativo)
- **JAWS**: screen reader Windows (enterprise)

### Desenvolvimento
- **eslint-plugin-jsx-a11y**: linting para React
- **@axe-core/react**: testes em runtime
- **Storybook a11y addon**: testes em componentes

---

## Checklists

### WCAG 2.1 AA - Essenciais

#### Perceptível
- [ ] Todas as imagens têm `alt` descritivo (ou `alt=""` para decorativas)
- [ ] Vídeos têm legendas e audiodescrição
- [ ] Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Conteúdo não depende apenas de cor para transmitir informação
- [ ] Texto pode ser redimensionado até 200% sem perda de funcionalidade

#### Operável
- [ ] Todo conteúdo interativo é acessível via teclado
- [ ] Foco visível em todos os elementos interativos
- [ ] Ordem de tabulação lógica
- [ ] Usuário pode pausar, parar ou esconder animações
- [ ] Links de "pular para conteúdo" no início da página

#### Compreensível
- [ ] Idioma da página definido (`<html lang="pt-BR">`)
- [ ] Labels associados a inputs (`<label for="">` ou `aria-label`)
- [ ] Mensagens de erro identificam o campo e sugerem correção
- [ ] Navegação consistente entre páginas

#### Robusto
- [ ] HTML válido e semântico
- [ ] ARIA usado corretamente (nome, papel, estado)
- [ ] Componentes customizados têm roles apropriados

---

## Templates

### Componente de Botão Acessível (React)
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Button({ isLoading, icon, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Carregando...</span>
          <Spinner aria-hidden="true" />
        </>
      ) : (
        <>
          {icon && <span aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
```

### Classe CSS para Screen Readers
```css
/* Visualmente oculto, mas acessível para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Como usar IA nesta área

### 1. Revisar componente para acessibilidade

```text
Atue como especialista em acessibilidade WCAG 2.1 AA.

Aqui está o código de um componente:
[COLE CÓDIGO HTML/JSX]

Avalie:
- Uso correto de HTML semântico
- Acessibilidade via teclado
- Atributos ARIA necessários
- Contraste e legibilidade

Sugira correções específicas com código.
```

### 2. Gerar alt text para imagens

```text
Descreva a seguinte imagem para uso como texto alternativo:
[DESCREVA O CONTEXTO DA IMAGEM]

A imagem mostra:
[DESCREVA O CONTEÚDO]

Gere um alt text:
- Conciso (máximo 125 caracteres)
- Que transmita a informação essencial
- Contextualizado para a página
```

### 3. Criar formulário acessível

```text
Preciso de um formulário de [DESCREVA: login, contato, cadastro].

Gere o HTML semântico com:
- Labels associados corretamente
- Mensagens de erro acessíveis (aria-describedby)
- Validação com feedback claro
- Navegação por teclado funcional
```

### 4. Auditar página existente

```text
Aqui está a estrutura de uma página:
[COLE HTML OU DESCREVA]

Faça uma auditoria de acessibilidade identificando:
- Violações de WCAG 2.1 AA
- Severidade de cada problema
- Correção sugerida com código

Organize por categoria (Perceptível, Operável, Compreensível, Robusto).
```

---

## Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Boas práticas com IA em Acessibilidade

- Use IA para gerar alt text, mas revise para garantir precisão contextual
- Sempre teste com tecnologias assistivas reais (NVDA, VoiceOver)
- IA não substitui testes com usuários reais com deficiência
- Combine análise automatizada (axe) com revisão manual
