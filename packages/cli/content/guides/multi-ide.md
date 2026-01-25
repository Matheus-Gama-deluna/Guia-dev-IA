---
description: Como usar o Maestro File System em Windsurf, Cursor e Antigravity
---

# 🌐 Guia Multi-IDE

## Windsurf
- Workflows: `.windsurf/workflows/*.md`
- Skills: `.windsurf/skills/`
- Regras: `.windsurfrules`
- Comandos: usar `/maestro`, `/iniciar-projeto`, `/continuar-fase`, `/avancar-fase`, `/status-projeto` direto no chat.
- Dica: Windsurf expande markdown automaticamente; cite caminhos completos (ex.: `content/guides/fases-mapeamento.md`).

## Cursor
- Comandos: `.cursor/commands/*.md` (mesmo nome dos workflows)
- Skills: `.cursor/skills/`
- Regras: `.cursorrules`
- Para iniciar, digite `/maestro` no chat do Cursor; os demais comandos funcionam igual.
- Dica: quando o comando pedir arquivos, use `cursor://` + caminho relativo para abrir.

## Antigravity / Gemini
- Workflows: `.agent/workflows/`
- Skills: `.agent/skills/`
- Regras: `.gemini/GEMINI.md` (contém header com trigger `always_on`)
- Comandos: igual às outras IDEs; recomenda-se iniciar com `/maestro`.
- Dica: especifique claramente quando precisar ler/escrever arquivos para evitar passos extras do agente.

## Boas práticas gerais
1. Sempre mantenha `.maestro/estado.json` versionado (ou com backup) para permitir retomada entre IDEs.
2. Após atualizar conteúdo do CLI, rode novamente `npx @maestro-ai/cli --force --ide <alvo>` conforme necessidade, lembrando que cada IDE possui diretórios próprios.
3. Ao criar novos workflows/rules, copie-os para cada IDE ou reexecute o CLI.
4. Consulte este guia sempre que precisar lembrar onde vivem os arquivos instalados.
