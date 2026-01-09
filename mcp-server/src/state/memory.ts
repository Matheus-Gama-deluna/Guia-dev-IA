/**
 * Memory storage functions for project context
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { ProjectSummary, CodebaseInfo } from "../types/memory.js";
import { formatResumoMarkdown, formatCodebaseMarkdown } from "../types/memory.js";

const MAESTRO_DIR = ".maestro";
const RESUMO_FILE = "resumo.md";
const RESUMO_JSON = "resumo.json";
const CODEBASE_FILE = "codebase.md";
const CODEBASE_JSON = "codebase.json";

/**
 * Save project summary (both JSON and Markdown)
 */
export async function salvarResumo(diretorio: string, resumo: ProjectSummary): Promise<void> {
    const maestroDir = join(diretorio, MAESTRO_DIR);
    await mkdir(maestroDir, { recursive: true });

    // Update timestamp
    resumo.atualizado_em = new Date().toISOString();

    // Save JSON (for programmatic access)
    const jsonPath = join(maestroDir, RESUMO_JSON);
    await writeFile(jsonPath, JSON.stringify(resumo, null, 2), "utf-8");

    // Save Markdown (for human/AI reading)
    const mdPath = join(maestroDir, RESUMO_FILE);
    const markdown = formatResumoMarkdown(resumo);
    await writeFile(mdPath, markdown, "utf-8");
}

/**
 * Load project summary
 */
export async function carregarResumo(diretorio: string): Promise<ProjectSummary | null> {
    try {
        const jsonPath = join(diretorio, MAESTRO_DIR, RESUMO_JSON);
        const conteudo = await readFile(jsonPath, "utf-8");
        return JSON.parse(conteudo) as ProjectSummary;
    } catch {
        return null;
    }
}

/**
 * Save codebase info (both JSON and Markdown)
 */
export async function salvarCodebase(diretorio: string, codebase: CodebaseInfo): Promise<void> {
    const maestroDir = join(diretorio, MAESTRO_DIR);
    await mkdir(maestroDir, { recursive: true });

    // Update timestamp
    codebase.atualizado_em = new Date().toISOString();

    // Save JSON
    const jsonPath = join(maestroDir, CODEBASE_JSON);
    await writeFile(jsonPath, JSON.stringify(codebase, null, 2), "utf-8");

    // Save Markdown
    const mdPath = join(maestroDir, CODEBASE_FILE);
    const markdown = formatCodebaseMarkdown(codebase);
    await writeFile(mdPath, markdown, "utf-8");
}

/**
 * Load codebase info
 */
export async function carregarCodebase(diretorio: string): Promise<CodebaseInfo | null> {
    try {
        const jsonPath = join(diretorio, MAESTRO_DIR, CODEBASE_JSON);
        const conteudo = await readFile(jsonPath, "utf-8");
        return JSON.parse(conteudo) as CodebaseInfo;
    } catch {
        return null;
    }
}

/**
 * Create initial project summary from estado
 */
export function criarResumoInicial(
    projetoId: string,
    nome: string,
    nivel: string,
    faseAtual: number,
    totalFases: number
): ProjectSummary {
    return {
        projeto_id: projetoId,
        nome,
        nivel,
        fase_atual: faseAtual,
        total_fases: totalFases,
        atualizado_em: new Date().toISOString(),
        entregaveis: [],
        decisoes_importantes: [],
        contexto_atual: {
            fase_nome: "PRD",
            objetivo: "Definir o produto e requisitos iniciais",
            proximo_passo: "Desenvolver o PRD com problema, usuários e MVP",
            dependencias: [],
        },
    };
}

/**
 * Create initial codebase info
 */
export function criarCodebaseInicial(): CodebaseInfo {
    return {
        atualizado_em: new Date().toISOString(),
        estrutura: {
            raiz: "projeto/",
            pastas: [],
        },
        arquivos_principais: [],
        dependencias: [],
        padroes: {
            naming: "A definir",
            estrutura_pastas: "A definir",
            testes: "A definir",
        },
    };
}

/**
 * Extract summary from deliverable content
 */
export function extrairResumoEntregavel(
    conteudo: string,
    fase: number,
    nomeFase: string,
    tipo: string,
    arquivo: string
): {
    resumo: string;
    pontos_chave: string[];
} {
    // Extract first paragraph as summary
    const paragraphs = conteudo.split(/\n\n+/).filter(p => p.trim());
    const resumo = paragraphs[0]?.slice(0, 500) || "Entregável gerado";

    // Extract headers as key points
    const headers = conteudo.match(/^#{1,3}\s+(.+)$/gm) || [];
    const pontos_chave = headers
        .map(h => h.replace(/^#+\s+/, ""))
        .slice(0, 5);

    return { resumo, pontos_chave };
}
