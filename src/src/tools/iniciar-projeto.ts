import { join } from "path";
import { v4 as uuid } from "uuid";
import type { ToolResult } from "../types/index.js";
import { lerEspecialista, lerTemplate } from "../utils/files.js";
import { criarEstadoInicial, serializarEstado } from "../state/storage.js";
import { setCurrentDirectory } from "../state/context.js";
import { criarResumoInicial, serializarResumo } from "../state/memory.js";
import { getFase } from "../flows/types.js";

interface IniciarProjetoArgs {
    nome: string;
    descricao?: string;
    diretorio: string; // Agora obrigatório - a IA deve informar
}

/**
 * Tool: iniciar_projeto
 * Inicia um novo projeto com o Maestro (modo stateless)
 * Retorna arquivos para a IA salvar ao invés de salvar diretamente
 */
export async function iniciarProjeto(args: IniciarProjetoArgs): Promise<ToolResult> {
    // Validar diretório
    if (!args.diretorio) {
        return {
            content: [{
                type: "text",
                text: `# ❌ Erro: Diretório Obrigatório

O parâmetro \`diretorio\` é obrigatório. Informe o caminho absoluto onde o projeto deve ser criado.

**Exemplo:**
\`\`\`
iniciar_projeto(nome: "meu-projeto", diretorio: "C:/projetos/meu-projeto")
\`\`\`
`,
            }],
            isError: true,
        };
    }

    const diretorio = args.diretorio;
    
    // Set global directory context for subsequent tool calls
    setCurrentDirectory(diretorio);

    const projetoId = uuid();

    // Estado inicial (médio por padrão, será reclassificado após PRD)
    const estado = criarEstadoInicial(projetoId, args.nome, diretorio);

    // Criar resumo inicial do projeto
    const resumo = criarResumoInicial(projetoId, args.nome, "medio", 1, 10);
    resumo.descricao = args.descricao;

    // Serializar arquivos para a IA salvar
    const estadoFile = serializarEstado(estado);
    const resumoFiles = serializarResumo(resumo);

    // Carregar especialista e template da fase 1
    const fase = getFase("medio", 1)!;
    const especialista = await lerEspecialista(fase.especialista);
    const template = await lerTemplate(fase.template);

    const resposta = `# 🚀 Projeto Iniciado: ${args.nome}

## Status
| Campo | Valor |
|-------|-------|
| **ID** | \`${projetoId}\` |
| **Fase** | 1/? (definido após PRD) |
| **Especialista** | ${fase.especialista} |
| **Diretório** | \`${diretorio}\` |

## 📋 Próximo Passo

Desenvolva o **PRD (Product Requirements Document)** para definir:
- Qual problema será resolvido
- Quem são os usuários (personas)
- Quais funcionalidades compõem o MVP
- Métricas de sucesso

Quando terminar, diga **"próximo"** para avançar.

---

## 🎭 Especialista: ${fase.especialista}

${especialista}

---

## 📝 Template: PRD

${template}

---

## 📁 Arquivos para Salvar

> **IMPORTANTE**: A IA deve salvar os seguintes arquivos no diretório do projeto:

| Arquivo | Caminho |
|---------|---------|
| Estado | \`${diretorio}/.maestro/estado.json\` |
| Resumo JSON | \`${diretorio}/.maestro/resumo.json\` |
| Resumo MD | \`${diretorio}/.maestro/resumo.md\` |

> Use \`write_to_file\` para criar cada arquivo. Os conteúdos estão no campo \`files\` da resposta.
`;

    // Retornar com arquivos para salvar
    return {
        content: [{ type: "text", text: resposta }],
        files: [
            { path: `${diretorio}/${estadoFile.path}`, content: estadoFile.content },
            ...resumoFiles.map(f => ({ path: `${diretorio}/${f.path}`, content: f.content }))
        ],
        estado_atualizado: estadoFile.content,
    };
}

/**
 * Input schema para iniciar_projeto
 */
export const iniciarProjetoSchema = {
    type: "object",
    properties: {
        nome: {
            type: "string",
            description: "Nome do projeto",
        },
        descricao: {
            type: "string",
            description: "Descrição opcional do projeto",
        },
        diretorio: {
            type: "string",
            description: "Diretório absoluto onde o projeto será criado (obrigatório)",
        },
    },
    required: ["nome", "diretorio"],
};
