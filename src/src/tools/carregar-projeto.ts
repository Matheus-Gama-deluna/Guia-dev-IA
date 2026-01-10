import { join } from "path";
import type { ToolResult } from "../types/index.js";
import { carregarEstado } from "../state/storage.js";
import { setCurrentDirectory, getCurrentDirectory } from "../state/context.js";
import { getFase } from "../flows/types.js";
import { lerEspecialista, lerTemplate } from "../utils/files.js";

interface CarregarProjetoArgs {
    diretorio: string;
}

/**
 * Tool: carregar_projeto
 * Carrega um projeto existente a partir do diretório
 */
export async function carregarProjeto(args: CarregarProjetoArgs): Promise<ToolResult> {
    const { diretorio } = args;

    if (!diretorio) {
        return {
            content: [{
                type: "text",
                text: `# 📂 Carregar Projeto

## Como usar

\`\`\`
carregar_projeto(diretorio: "D:/Sistemas/meu-projeto")
\`\`\`

## O que faz

1. Verifica se existe \`.maestro/estado.json\` no diretório
2. Carrega o estado do projeto
3. Define o diretório como contexto global

Útil quando o servidor MCP reinicia e você quer continuar um projeto existente.
`,
            }],
        };
    }

    const estado = await carregarEstado(diretorio);

    if (!estado) {
        return {
            content: [{
                type: "text",
                text: `❌ **Erro**: Nenhum projeto encontrado em \`${diretorio}\`.

**Verifique se:**
- O caminho está correto
- Existe o arquivo \`.maestro/estado.json\` neste diretório

**Alternativa:** Use \`iniciar_projeto\` para criar um novo projeto.`,
            }],
            isError: true,
        };
    }

    // Define o diretório global
    setCurrentDirectory(diretorio);

    // Carregar info da fase atual
    const faseAtual = getFase(estado.nivel, estado.fase_atual);
    let especialistaInfo = "";
    let templateInfo = "";

    if (faseAtual) {
        try {
            const especialista = await lerEspecialista(faseAtual.especialista);
            const template = await lerTemplate(faseAtual.template);
            especialistaInfo = `

---

## 🎭 Especialista: ${faseAtual.especialista}

${especialista.slice(0, 500)}${especialista.length > 500 ? "...\n\n*[truncado para visualização]*" : ""}
`;
            templateInfo = `

---

## 📝 Template: ${faseAtual.template}

${template.slice(0, 500)}${template.length > 500 ? "...\n\n*[truncado para visualização]*" : ""}
`;
        } catch {
            // Ignore se não encontrar especialista/template
        }
    }

    const progresso = Math.round((estado.fase_atual / estado.total_fases) * 100);
    const barra = "█".repeat(Math.floor(progresso / 10)) + "░".repeat(10 - Math.floor(progresso / 10));

    const resposta = `# ✅ Projeto Carregado!

## ${estado.nome}

| Campo | Valor |
|-------|-------|
| **ID** | \`${estado.projeto_id}\` |
| **Diretório** | \`${diretorio}\` |
| **Nível** | ${estado.nivel.toUpperCase()} |
| **Fase Atual** | ${estado.fase_atual}/${estado.total_fases} |

## Progresso

| ${barra} | ${progresso}% |
|:---|---:|

## 📍 Fase Atual: ${faseAtual?.nome || "N/A"}

| Campo | Valor |
|-------|-------|
| **Especialista** | ${faseAtual?.especialista || "N/A"} |
| **Entregável** | ${faseAtual?.entregavel_esperado || "N/A"} |

### Gate de Saída
${faseAtual?.gate_checklist.map(item => `- [ ] ${item}`).join("\n") || "N/A"}

${especialistaInfo}
${templateInfo}

---

**Próximos passos:**
- Para ver status completo: \`status()\`
- Para avançar: \`proximo(entregavel: "...")\`
`;

    return {
        content: [{ type: "text", text: resposta }],
    };
}

export const carregarProjetoSchema = {
    type: "object",
    properties: {
        diretorio: {
            type: "string",
            description: "Caminho absoluto do diretório do projeto",
        },
    },
    required: ["diretorio"],
};
