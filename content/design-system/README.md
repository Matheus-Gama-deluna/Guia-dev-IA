# Design System Database

Database extenso de design para uso pelos Especialistas MCP.

## 📊 Recursos Disponíveis

### Design Assets

| Database | Registros | Arquivo | Descrição |
|----------|-----------|---------|-----------|
| **Colors** | 96 paletas | `data/colors.csv` | Paletas por tipo de produto |
| **Typography** | 57 pares | `data/typography.csv` | Combinações de fontes Google Fonts |
| **Styles** | 58 estilos | `data/styles.csv` | Estilos UI completos |
| **Products** | - | `data/products.csv` | Recomendações por produto |
| **Landing** | - | `data/landing.csv` | Padrões de landing page |
| **UX Guidelines** | 99+ | `data/ux-guidelines.csv` | Best practices UX |
| **UI Reasoning** | - | `data/ui-reasoning.csv` | Regras de design reasoning |
| **Charts** | 25 tipos | `data/charts.csv` | Tipos de gráficos |
| **Icons** | - | `data/icons.csv` | Diretrizes de ícones |
| **Web Interface** | - | `data/web-interface.csv` | Guidelines web |
| **React Performance** | - | `data/react-performance.csv` | Performance React |
| **Prompts** | - | `data/prompts.csv` | Prompts para Stitch |

### Stack Guidelines

| Stack | Guidelines | Arquivo | Uso |
|-------|------------|---------|-----|
| **HTML + Tailwind** | 57 regras | `stacks/html-tailwind.csv` | HTML puro + Tailwind CSS |
| **React** | 55 regras | `stacks/react.csv` | Aplicações React |
| **Next.js** | 54 regras | `stacks/nextjs.csv` | Aplicações Next.js 14/15 |
| **Vue** | ~50 regras | `stacks/vue.csv` | Aplicações Vue 3 |
| **Svelte** | ~50 regras | `stacks/svelte.csv` | Aplicações Svelte 5 |
| **React Native** | ~45 regras | `stacks/react-native.csv` | Apps mobile React Native |
| **SwiftUI** | ~50 regras | `stacks/swiftui.csv` | Apps iOS/macOS nativas |
| **Flutter** | ~47 regras | `stacks/flutter.csv` | Apps Flutter cross-platform |
| **Jetpack Compose** | ~40 regras | `stacks/jetpack-compose.csv` | Apps Android nativas |
| **shadcn/ui** | ~65 regras | `stacks/shadcn.csv` | shadcn/ui components |
| **Nuxt.js** | ~70 regras | `stacks/nuxtjs.csv` | Aplicações Nuxt 3 |
| **Nuxt UI** | ~60 regras | `stacks/nuxt-ui.csv` | Nuxt UI components |

**Total:** ~600 guidelines estruturadas

## 🗂️ Estrutura

```
design-system/
├── README.md (este arquivo)
├── data/           # CSVs design (cores, fontes, estilos)
├── stacks/         # CSVs guidelines por stack/framework
└── indexes/        # Índices Markdown navegáveis
```

## 🔍 Como Usar

### Método 1: Consultar Índices

Índices organizados para navegação rápida:

- **[Cores](indexes/colors-index.md)** - 96 paletas por tipo de produto
- **[Busca Rápida](indexes/quick-search.md)** - Atalhos e workflows
- **[Stacks](indexes/stacks-index.md)** - Guidelines por framework ⭐

### Método 2: Ler CSV Diretamente

Para busca mais específica:

```markdown
# Design Assets
content/design-system/data/colors.csv
content/design-system/data/typography.csv

# Stack Guidelines
content/design-system/stacks/react.csv
content/design-system/stacks/nextjs.csv
```

## 🎯 Casos de Uso

### Para Especialista em UX Design

**Durante Fase 3 (UX Design):**

1. Consultar `indexes/colors-index.md` por tipo de produto
2. Buscar em `data/colors.csv` por keywords
3. Apresentar 2-3 opções ao usuário
4. Validar Purple Ban
5. Incorporar no Design Doc

**Exemplo:**
```markdown
Usuário: "SaaS de gestão, moderno"
→ colors.csv linha 2: SaaS General (#2563EB)
→ typography.csv linha 2: Poppins + Open Sans
→ Confirmar com usuário → Incorporar
```

### Para Especialista em Desenvolvimento Frontend

**Durante Fase 11-12 (Implementação):**

1. Consultar `indexes/stacks-index.md`
2. Abrir CSV da stack (react.csv, nextjs.csv, etc)
3. Filtrar por Severity: High (aplicar primeiro)
4. Buscar por Category (State, Effects, Performance)
5. Usar Code Good como exemplo
6. Evitar Code Bad (anti-patterns)

**Exemplo:**
```markdown
Stack: Next.js 15
→ stacks/nextjs.csv
→ Severity: High
→ Guideline: "Configure caching explicitly (fetch uncached por padrão!)"
→ Code Good: fetch(url, { cache: 'force-cache' })
```

### Para Especialista em Desenvolvimento Mobile

**Durante Fase 11-12 (Mobile):**

1. Identificar plataforma:
   - iOS → `stacks/swiftui.csv`
   - Android → `stacks/jetpack-compose.csv`
   - Cross → `stacks/react-native.csv` ou `stacks/flutter.csv`

2. Aplicar guidelines específicas da plataforma

## 📖 Estrutura dos CSVs

### Design Assets (colors, typography, styles)

```csv
No,Product Type,Keywords,Primary,Secondary,CTA,Background,Text,Border,Notes
```

### Stack Guidelines

```csv
No,Category,Guideline,Description,Do,Don't,Code Good,Code Bad,Severity,Docs URL
```

**Campos importantes:**
- **Category** - State, Effects, Performance, etc
- **Do/Don't** - Boas práticas vs anti-patterns
- **Code Good/Bad** - Exemplos comparativos
- **Severity** - High, Medium, Low
- **Docs URL** - Link documentação oficial

## ⚠️ Regras e Validações

### Purple Ban (UX Design)

Evitar roxo/violeta como cor principal:
```markdown
Cores proibidas: #6B21A8, #7C3AED, #8B5CF6, #A78BFA
Validar após busca no database
Alertar usuário se encontrar
```

### Validação com Usuário

Database é **sugestão**, não imposição:
1. Apresentar 2-3 opções
2. Aguardar confirmação explícita
3. Permitir ajustes manuais

### Severidade (Stack Guidelines)

**High Severity:**
- Crítico
- Aplicar PRIMEIRO
- Evitar bugs graves

**Medium:**
- Importante
- Boas práticas padrão

**Low:**
- Recomendações
- Otimizações menores

## 📚 Índices Disponíveis

- **[colors-index.md](indexes/colors-index.md)** - Paletas por tipo de produto
- **[quick-search.md](indexes/quick-search.md)** - Guia rápido de busca
- **[stacks-index.md](indexes/stacks-index.md)** - Guidelines por framework ⭐

## 🔗 Uso pelos Especialistas

### Especialista em UX Design

1. Perguntas de estilo ao usuário
2. Buscar no database (colors, typography, styles)
3. Apresentar opções
4. Validar Purple Ban
5. Incorporar no Design Doc

### Especialista em Prototipagem Stitch

1. Ler Design Doc (`docs/03-ux/design-doc.md`)
2. Extrair cores/fontes
3. Se incompleto, buscar no database
4. Gerar prompts enriquecidos para Stitch

### Especialista em Desenvolvimento Frontend

1. Identificar stack do projeto
2. Consultar `stacks/[stack].csv`
3. Aplicar guidelines High Severity
4. Seguir Do, evitar Don't
5. Usar Code Good como referência

### Especialista em Desenvolvimento Mobile

1. Identificar plataforma (iOS/Android/Cross)
2. Consultar stack correspondente
3. Aplicar best practices específicas
4. Validar contra guidelines

## 📌 Notas

- **Localização anterior:** `.agent/.shared/ui-ux-pro-max/data/`
- **Migração:** 2026-01-23
- **Formato:** CSVs + índices MD
- **Manutenção:** Atualizar CSV → re-gerar índices

---

**Versão:** 2.0.0  
**Última atualização:** 2026-01-23  
**Resources:** 12 design CSVs + 12 stack CSVs + 3 índices
