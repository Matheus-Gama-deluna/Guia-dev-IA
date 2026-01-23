# Design System Database

Database extenso de design para uso pelos Especialistas MCP.

## 📊 Recursos Disponíveis

| Database | Registros | Arquivo | Descrição |
|----------|-----------|---------|-----------|
| **Colors** | 96 paletas | `data/colors.csv` | Paletas por tipo de produto (SaaS, E-commerce, Fintech, Healthcare, etc) |
| **Typography** | 57 pares | `data/typography.csv` | Combinações de fontes Google Fonts |
| **Styles** | 58 estilos | `data/styles.csv` | Estilos UI completos (Minimalism, Glassmorphism, Brutalism, etc) |
| **Products** | - | `data/products.csv` | Recomendações de design por tipo de produto |
| **Landing** | - | `data/landing.csv` | Padrões de landing page |
| **UX Guidelines** | 99+ | `data/ux-guidelines.csv` | Best practices UX |
| **UI Reasoning** | - | `data/ui-reasoning.csv` | Regras de design reasoning |
| **Charts** | 25 tipos | `data/charts.csv` | Tipos de gráficos e visualizações |
| **Icons** | - | `data/icons.csv` | Diretrizes de ícones |
| **Web Interface** | - | `data/web-interface.csv` | Guidelines para interfaces web |
| **React Performance** | - | `data/react-performance.csv` | Performance React/Next.js |
| **Prompts** | - | `data/prompts.csv` | Prompts prontos para Google Stitch |

## 🗂️ Estrutura

```
design-system/
├── README.md (este arquivo)
├── data/           # CSVs originais (source of truth)
└── indexes/        # Índices Markdown navegáveis
```

## 🔍 Como Usar (Para Especialistas MCP)

### Método 1: Consultar Índice

Índices organizados por categoria para navegação rápida:

- **[Cores por Tipo de Produto](indexes/colors-index.md)** - SaaS, E-commerce, Fintech, Healthcare, etc
- **[Tipografia por Mood](indexes/typography-index.md)** - Elegant, Modern, Playful, Professional
- **[Estilos UI](indexes/styles-index.md)** - Minimalism, Glassmorphism, Dark Mode, etc
- **[Busca Rápida](indexes/quick-search.md)** - Guia de busca por keywords

### Método 2: Ler CSV Diretamente

Para busca mais específica, ler CSV diretamente:

```markdown
# Abrir arquivo
content/design-system/data/colors.csv

# Buscar por keywords na coluna "Keywords"
# Exemplo: "fintech" → Encontra linha 16
# Exemplo: "healthcare" → Encontra linhas 9, 24, 61, 62

# Extrair informações das colunas
```

## 📖 Campos dos CSVs

### colors.csv
- **No** - Número da paleta
- **Product Type** - Tipo de produto
- **Keywords** - Palavras-chave para busca
- **Primary (Hex)** - Cor primária
- **Secondary (Hex)** - Cor secundária
- **CTA (Hex)** - Cor de Call-to-Action
- **Background (Hex)** - Cor de fundo
- **Text (Hex)** - Cor de texto
- **Border (Hex)** - Cor de bordas
- **Notes** - Notas e contexto

### typography.csv
- **STT** - Número do par
- **Font Pairing Name** - Nome da combinação
- **Category** - Categoria (Serif+Sans, Sans+Sans, etc)
- **Heading Font** - Fonte para títulos
- **Body Font** - Fonte para corpo de texto
- **Mood/Style Keywords** - Keywords de mood
- **Best For** - Quando usar
- **Google Fonts URL** - Link para Google Fonts
- **CSS Import** - CSS de importação
- **Tailwind Config** - Configuração Tailwind
- **Notes** - Notas adicionais

### styles.csv
- **STT** - Número do estilo
- **Style Category** - Nome do estilo
- **Type** - Tipo (General, Landing Page, BI/Analytics)
- **Keywords** - Palavras-chave
- **Primary Colors** - Cores primárias
- **Secondary Colors** - Cores secundárias
- **Effects & Animation** - Efeitos e animações
- **Best For** - Quando usar
- **Do Not Use For** - Quando NÃO usar
- **Light Mode ✓** - Suporte light mode
- **Dark Mode ✓** - Suporte dark mode
- **Performance** - Performance
- **Accessibility** - Acessibilidade
- **Mobile-Friendly** - Mobile-friendly
- **Conversion-Focused** - Foco em conversão
- **Framework Compatibility** - Compatibilidade frameworks
- **Era/Origin** - Origem/era do estilo
- **Complexity** - Complexidade (Low, Medium, High)

## 🎯 Exemplos de Uso

### Exemplo 1: Buscar Paleta para SaaS Moderno

```markdown
1. Abrir: indexes/colors-index.md
2. Procurar: Seção "💼 SaaS"
3. Resultado: 
   - SaaS General (#2563EB primary)
   - Micro SaaS (#2563EB primary)
   - Productivity Tool (#3B82F6 primary)
4. Escolher e usar no Design Doc
```

**OU busca direta:**
```csv
1. Abrir: data/colors.csv
2. Buscar: "saas, general"
3. Linha 2: #2563EB, #3B82F6, #F97316
```

### Exemplo 2: Buscar Fonte Elegante para Beauty/Spa

```markdown
1. Abrir: indexes/typography-index.md
2. Procurar: Seção "💅 Elegant/Luxury"
3. Resultado:
   - Classic Elegant (Playfair Display + Inter)
   - Luxury Serif (Cormorant + Montserrat)
4. Ver detalhes no CSV para CSS import
```

### Exemplo 3: Buscar Estilo Dark Mode

```markdown
1. Abrir: indexes/styles-index.md
2. Procurar: "Dark Mode"
3. Resultado: Linha 8 - Dark Mode (OLED)
   - Colors: Deep Black #000000, Dark Grey #121212
   - Effects: Minimal glow, dark-to-light transitions
   - Best For: Night-mode apps, OLED devices
```

## ⚠️ Regras e Validações

### Purple Ban (Importante!)

**Regra MCP:** Evitar roxo/violeta como cor principal

Após buscar no database, **sempre verificar**:
```markdown
Se paleta contém roxo (#[A-F0-9]*[4-9A-F][A-F0-9]{3}):
  → Alertar usuário
  → Sugerir alternativa
  → Só usar SE usuário solicitar explicitamente
```

### Validação com Usuário

Database é **sugestão inicial**, não imposição:
1. Apresentar 2-3 opções do database
2. Perguntar: "Essa paleta/fonte faz sentido para o projeto?"
3. Aguardar confirmação explícita
4. Permitir ajustes manuais

### Consistência

- CSVs são **source of truth**
- Índices podem estar desatualizados em caso de modificações
- Sempre preferir CSV em caso de dúvida

## 📚 Índices Disponíveis

- **[00-overview.md](indexes/00-overview.md)** - Visão geral do database
- **[colors-index.md](indexes/colors-index.md)** - Paletas organizadas por tipo
- **[typography-index.md](indexes/typography-index.md)** - Fontes organizadas por mood
- **[styles-index.md](indexes/styles-index.md)** - Estilos UI categorizados
- **[quick-search.md](indexes/quick-search.md)** - Guia rápido de busca

## 🔗 Uso pelos Especialistas

### Especialista em UX Design

Durante perguntas de estilo:
1. Coletar: tipo de produto, indústria, estilo desejado
2. Buscar no database por keywords
3. Apresentar opções ao usuário
4. Incorporar escolha no Design Doc

### Especialista em Prototipagem Stitch

Ao gerar prompts:
1. Ler Design Doc (`docs/03-ux/design-doc.md`)
2. Extrair cores e fontes definidas
3. Se incompleto, buscar no database
4. Gerar prompts enriquecidos para Stitch

## 📌 Notas

- **Localização anterior:** `.agent/.shared/ui-ux-pro-max/data/`
- **Data da migração:** 2026-01-23
- **Formato:** CSVs preservados + índices MD criados
- **Manutenção:** Atualizar CSV → re-gerar índices

---

**Versão:** 1.0.0  
**Última atualização:** 2026-01-23
