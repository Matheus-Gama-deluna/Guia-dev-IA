# Índice de Guidelines por Stack

Navegue por framework/stack ou busque no CSV completo.

---

## 🌐 Web Frameworks & Libraries

### HTML + Tailwind (57 guidelines)

**Arquivo:** [`../stacks/html-tailwind.csv`](../stacks/html-tailwind.csv)

**Categorias Principais:**
- Animation (5) - `animate-*`, transitions, durations
- Z-Index (3) - Stacking context, modals, backgrounds
- Layout (4) - Container, padding, grid gaps, flexbox
- Images (4) - Aspect ratio, object-fit, lazy loading, responsive
- Typography (4) - Prose plugin, line height, font scale, truncation
- Colors (4) - Opacity, dark mode, semantic naming
- Spacing (3) - Spacing scale, negative margins, space-between
- Forms (4) - Focus states, sizing, disabled states
- Responsive (3) - Mobile-first, breakpoints, visibility
- Buttons (4) - Sizing, touch targets, loading, icons
- Cards (3) - Structure, hover states, spacing
- Accessibility (3) - Screen readers, focus-visible, reduced-motion
- Performance (3) - Content paths, JIT mode, @apply usage
- Plugins (2) - Official plugins, custom utilities

**Tailwind v4 Specific:**
- ⭐ Use `bg-linear-to-*` for gradients (not `bg-gradient-to-*`)
- ⭐ Use `size-*` for square dimensions (not `h-* w-*`)
- ⭐ Use `shrink-0` shorthand (not `flex-shrink-0`)
- ⭐ Use theme colors directly: `bg-primary` (not `bg-[var(--color-primary)]`)

**High Severity:** 9 regras críticas

---

### React (55 guidelines)

**Arquivo:** [`../stacks/react.csv`](../stacks/react.csv)

**Categorias Principais:**
- State (5) - useState, useReducer, lift state, lazy init, avoid unnecessary
- Effects (4) - Cleanup, dependencies, avoid unnecessary, refs
- Rendering (5) - Keys, useMemo, useCallback, memo, avoid inline objects
- Components (4) - Small/focused, composition, colocate, fragments
- Props (4) - Destructure, defaults, avoid drilling, TypeScript
- Events (3) - Synthetic events, binding, passing handlers
- Forms (3) - Controlled components, submission, debouncing
- Hooks (3) - Rules of hooks, custom hooks, naming
- Context (3) - Global data, split contexts, memoize values
- Performance (4) - Profiler, lazy load, virtualize, batching
- Error Handling (2) - Error boundaries, async errors
- Testing (2) - Test behavior, testing-library queries
- Accessibility (4) - Semantic HTML, focus, ARIA, labels
- TypeScript (4) - Props typing, state typing, events, generics
- Patterns (3) - Container/Presentational, render props, compound

**High Severity:** 16 regras críticas
- Avoid unnecessary state
- Clean up effects  
- Specify dependencies correctly
- Use keys properly (stable IDs)
- Rules of hooks
- Memoize context values
- Virtualize long lists (100+ items)
- Error boundaries
- Semantic HTML

---

### Next.js (54 guidelines)

**Arquivo:** [`../stacks/nextjs.csv`](../stacks/nextjs.csv)

**Categorias Principais:**
- Routing (6) - App Router, file-based, route groups, loading, errors
- Rendering (5) - Server Components, Client Components, streaming
- Data Fetching (5) - Fetch in Server Components, caching, Server Actions
- Images (5) - next/image, dimensions, fill, remote domains, priority
- Fonts (3) - next/font, layout application, variable fonts
- Metadata (3) - generateMetadata, OpenGraph, metadata API
- API (4) - Route Handlers, Response objects, HTTP methods, validation
- Middleware (3) - Auth, path matching, edge-compatible
- Environment (3) - NEXT_PUBLIC prefix, validation, .env.local
- Performance (4) - Bundle analyzer, dynamic imports, layout shifts
- Link (3) - next/link, prefetch, scroll
- Config (3) - next.config.js, strict mode, redirects
- Deployment (2) - Vercel, self-hosting
- Security (3) - Sanitize input, CSP headers, Server Action validation

**⚠️ CRITICAL (Next.js 15):**
```csv
Configure caching explicitly
fetch() is UNCACHED by default in v15!
Do: fetch(url, { cache: 'force-cache' })
Don't: fetch(url) // Uncached!
Severity: High
```

**High Severity:** ~15 regras críticas

---

### Vue (50 guidelines)

**Arquivo:** [`../stacks/vue.csv`](../stacks/vue.csv)

**Uso:** Aplicações Vue 3 com Composition API

---

### Svelte (50 guidelines)

**Arquivo:** [`../stacks/svelte.csv`](../stacks/svelte.csv)

**Uso:** Aplicações Svelte 5 com Runes

---

### shadcn/ui (65 guidelines)

**Arquivo:** [`../stacks/shadcn.csv`](../stacks/shadcn.csv)

**Uso:** Projects usando shadcn/ui components

---

### Nuxt.js (70 guidelines)

**Arquivo:** [`../stacks/nuxtjs.csv`](../stacks/nuxtjs.csv)

**Uso:** Aplicações Nuxt 3

---

### Nuxt UI (60 guidelines)

**Arquivo:** [`../stacks/nuxt-ui.csv`](../stacks/nuxt-ui.csv)

**Uso:** Projects usando Nuxt UI

---

## 📱 Mobile Frameworks

### React Native (45 guidelines)

**Arquivo:** [`../stacks/react-native.csv`](../stacks/react-native.csv)

**Uso:** Apps mobile React Native (iOS + Android)

---

### SwiftUI (50 guidelines)

**Arquivo:** [`../stacks/swiftui.csv`](../stacks/swiftui.csv)

**Uso:** Apps iOS/macOS nativas

---

### Flutter (47 guidelines)

**Arquivo:** [`../stacks/flutter.csv`](../stacks/flutter.csv)

**Uso:** Apps Flutter (iOS + Android)

---

### Jetpack Compose (40 guidelines)

**Arquivo:** [`../stacks/jetpack-compose.csv`](../stacks/jetpack-compose.csv)

**Uso:** Apps Android nativas modernas

---

## 🔍 Como Usar

### Para Especialistas MCP

**1. Identificar stack do projeto:**
```
Estado.json → stack_framework: "react" | "nextjs" | "vue" | etc
```

**2. Abrir CSV correspondente:**
```
content/design-system/stacks/react.csv
content/design-system/stacks/nextjs.csv
```

**3. Buscar por categoria:**
```csv
# Implementando hooks?
Category: "Hooks" (3 regras)

# Otimizando performance?
Category: "Performance" (4 regras)

# TypeScript?
Category: "TypeScript" (4 regras)
```

**4. Filtrar por severidade:**
```csv
# High Severity = Crítico (aplicar primeiro)
# Medium = Importante  
# Low = Boas práticas
```

**5. Consultar exemplos:**
```csv
Code Good: [exemplo correto]
Code Bad: [anti-pattern]
```

---

## 📊 Estatísticas por Severidade

### Web Stacks

| Stack | High | Medium | Low | Total |
|-------|------|--------|-----|-------|
| Tailwind | 9 | 28 | 20 | 57 |
| React | 16 | ~30 | ~9 | 55 |
| Next.js | ~15 | ~30 | ~9 | 54 |
| shadcn | ~20 | ~35 | ~10 | 65 |
| Nuxt.js | ~25 | ~35 | ~10 | 70 |

### Mobile Stacks

| Stack | High | Medium | Low | Total |
|-------|------|--------|-----|-------|
| React Native | ~15 | ~20 | ~10 | 45 |
| SwiftUI | ~15 | ~25 | ~10 | 50 |
| Flutter | ~15 | ~22 | ~10 | 47 |
| Jetpack Compose | ~12 | ~20 | ~8 | 40 |

---

## ⚡ Workflows Rápidos

### Cenário 1: Dashboard React + Next.js

```
1. nextjs.csv:
   ✅ Use Server Components by default (High)
   ✅ Configure caching explicitly (High - v15!)
   ✅ Use next/image (High)

2. react.csv:
   ✅ Avoid unnecessary state (High)
   ✅ Use keys properly (High)
   ✅ Error boundaries (High)

3. tailwind.csv:
   ✅ Mobile-first approach (Medium)
   ✅ Focus states (High)
   ✅ Dark mode (Medium)
```

### Cenário 2: App Mobile React Native

```
1. react-native.csv:
   ✅ FlatList for long lists (High)
   ✅ TouchableOpacity for interactions (Medium)
   ✅ Platform-specific code (Medium)

2. react.csv:
   ✅ Rules of hooks (High)
   ✅ Memoize callbacks (Medium)
   ✅ Error boundaries (High)
```

### Cenário 3: Landing Page com Nuxt UI

```
1. nuxt-ui.csv:
   ✅ Use Nuxt UI components (Medium)
   ✅ Theme configuration (Medium)
   ✅ Icons library (Low)

2. nuxtjs.csv:
   ✅ Auto-imports (Medium)
   ✅ Server routes (High)
   ✅ SEO metadata (High)
```

---

## 🎯 Integração com Especialistas

### Especialista em Desenvolvimento Frontend

Durante Fase 11-12 (Implementação):
1. Consultar `stacks-index.md` para identificar stack
2. Abrir CSV correspondente
3. Aplicar regras High Severity primeiro
4. Validar código contra Code Bad (anti-patterns)
5. Consultar Docs URL para aprofundamento

### Especialista em Desenvolvimento Mobile

Durante Fase 11-12 (Implementação Mobile):
1. Identificar plataforma (iOS/Android/Cross-platform)
2. Consultar CSV correspondente:
   - iOS → swiftui.csv
   - Android → jetpack-compose.csv
   - Cross → react-native.csv ou flutter.csv
3. Aplicar best practices específicas da plataforma

---

## 📋 Estrutura dos CSVs

```csv
No,Category,Guideline,Description,Do,Don't,Code Good,Code Bad,Severity,Docs URL
```

**Campos:**
- **No** - Número da guideline
- **Category** - Categoria (State, Effects, etc)
- **Guideline** - Título resumido
- **Description** - Descrição completa
- **Do** - Boas práticas (o que fazer)
- **Don't** - Anti-patterns (o que NÃO fazer)
- **Code Good** - Exemplo de código correto
- **Code Bad** - Exemplo de código incorreto
- **Severity** - High, Medium, Low
- **Docs URL** - Link para documentação oficial

---

**Total de Stacks:** 12  
**Total de Guidelines:** ~600  
**Última atualização:** 2026-01-23
