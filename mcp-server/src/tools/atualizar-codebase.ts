import type { ToolResult } from "../types/index.js";
import type { CodebaseInfo } from "../types/memory.js";
import { salvarCodebase, carregarCodebase } from "../state/memory.js";
import { resolveDirectory } from "../state/context.js";

interface AtualizarCodebaseArgs {
    diretorio?: string;
    estrutura?: {
        raiz: string;
        pastas: { path: string; descricao: string }[];
    };
    arquivos?: {
        path: string;
        tipo: "entry" | "config" | "core" | "util" | "test" | "other";
        descricao: string;
        exporta?: string[];
    }[];
    dependencias?: {
        nome: string;
        versao: string;
        tipo: "prod" | "dev";
        uso: string;
    }[];
    endpoints?: {
        path: string;
        metodo: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        descricao: string;
    }[];
    entidades?: {
        nome: string;
        campos: { nome: string; tipo: string }[];
    }[];
    padroes?: {
        naming?: string;
        estrutura_pastas?: string;
        testes?: string;
        commits?: string;
    };
}

/**
 * Tool: atualizar_codebase
 * Atualiza informações do codebase para memória do projeto
 */
export async function atualizarCodebase(args: AtualizarCodebaseArgs): Promise<ToolResult> {
    const diretorio = resolveDirectory(args.diretorio);

    // Load existing or create new
    let codebase = await carregarCodebase(diretorio);

    if (!codebase) {
        codebase = {
            atualizado_em: new Date().toISOString(),
            estrutura: args.estrutura || { raiz: "projeto/", pastas: [] },
            arquivos_principais: [],
            dependencias: [],
            padroes: {
                naming: "A definir",
                estrutura_pastas: "A definir",
                testes: "A definir",
            },
        };
    }

    // Update fields if provided
    if (args.estrutura) {
        codebase.estrutura = args.estrutura;
    }

    if (args.arquivos) {
        // Merge with existing, update if path matches
        for (const arquivo of args.arquivos) {
            const existing = codebase.arquivos_principais.findIndex(a => a.path === arquivo.path);
            if (existing >= 0) {
                codebase.arquivos_principais[existing] = arquivo;
            } else {
                codebase.arquivos_principais.push(arquivo);
            }
        }
    }

    if (args.dependencias) {
        for (const dep of args.dependencias) {
            const existing = codebase.dependencias.findIndex(d => d.nome === dep.nome);
            if (existing >= 0) {
                codebase.dependencias[existing] = dep;
            } else {
                codebase.dependencias.push(dep);
            }
        }
    }

    if (args.endpoints) {
        codebase.endpoints = codebase.endpoints || [];
        for (const endpoint of args.endpoints) {
            const existing = codebase.endpoints.findIndex(
                e => e.path === endpoint.path && e.metodo === endpoint.metodo
            );
            if (existing >= 0) {
                codebase.endpoints[existing] = endpoint;
            } else {
                codebase.endpoints.push(endpoint);
            }
        }
    }

    if (args.entidades) {
        codebase.entidades = codebase.entidades || [];
        for (const entidade of args.entidades) {
            const existing = codebase.entidades.findIndex(e => e.nome === entidade.nome);
            if (existing >= 0) {
                codebase.entidades[existing] = entidade;
            } else {
                codebase.entidades.push(entidade);
            }
        }
    }

    if (args.padroes) {
        codebase.padroes = {
            ...codebase.padroes,
            ...args.padroes,
        };
    }

    // Save
    await salvarCodebase(diretorio, codebase);

    const resposta = `# ✅ Codebase Atualizado

## Estatísticas

| Campo | Quantidade |
|-------|------------|
| **Pastas** | ${codebase.estrutura.pastas.length} |
| **Arquivos** | ${codebase.arquivos_principais.length} |
| **Dependências** | ${codebase.dependencias.length} |
| **Endpoints** | ${codebase.endpoints?.length || 0} |
| **Entidades** | ${codebase.entidades?.length || 0} |

## Arquivos Gerados

- \`.maestro/codebase.json\` - Dados estruturados
- \`.maestro/codebase.md\` - Visualização formatada

> Use \`carregar_projeto\` para ver o codebase junto com o projeto.
`;

    return {
        content: [{ type: "text", text: resposta }],
    };
}

export const atualizarCodebaseSchema = {
    type: "object",
    properties: {
        diretorio: {
            type: "string",
            description: "Diretório do projeto",
        },
        estrutura: {
            type: "object",
            description: "Estrutura de pastas do projeto",
            properties: {
                raiz: { type: "string" },
                pastas: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            path: { type: "string" },
                            descricao: { type: "string" },
                        },
                    },
                },
            },
        },
        arquivos: {
            type: "array",
            description: "Arquivos principais do projeto",
            items: {
                type: "object",
                properties: {
                    path: { type: "string" },
                    tipo: { type: "string", enum: ["entry", "config", "core", "util", "test", "other"] },
                    descricao: { type: "string" },
                },
            },
        },
        dependencias: {
            type: "array",
            description: "Dependências do projeto",
            items: {
                type: "object",
                properties: {
                    nome: { type: "string" },
                    versao: { type: "string" },
                    tipo: { type: "string", enum: ["prod", "dev"] },
                    uso: { type: "string" },
                },
            },
        },
        endpoints: {
            type: "array",
            description: "Endpoints da API",
            items: {
                type: "object",
                properties: {
                    path: { type: "string" },
                    metodo: { type: "string", enum: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
                    descricao: { type: "string" },
                },
            },
        },
        entidades: {
            type: "array",
            description: "Entidades do banco de dados",
            items: {
                type: "object",
                properties: {
                    nome: { type: "string" },
                    campos: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                nome: { type: "string" },
                                tipo: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        padroes: {
            type: "object",
            description: "Padrões de código",
            properties: {
                naming: { type: "string" },
                estrutura_pastas: { type: "string" },
                testes: { type: "string" },
                commits: { type: "string" },
            },
        },
    },
};
