/**
 * Response types for stateless MCP architecture
 * Files are returned to the AI for saving instead of being written directly
 */

/**
 * Represents a file that the AI should save
 */
export interface FileToSave {
    /** Relative path from project root (e.g., ".maestro/estado.json") */
    path: string;
    /** File content */
    content: string;
    /** Encoding (default: utf-8) */
    encoding?: string;
}

/**
 * Extended tool result with files to save
 */
export interface MaestroToolResult {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
    /** Files that the AI should save to the filesystem */
    files?: FileToSave[];
    /** Updated state JSON (for convenience) */
    estado_atualizado?: string;
}

/**
 * Helper to create a file-to-save object
 */
export function createFileToSave(path: string, content: string | object): FileToSave {
    return {
        path,
        content: typeof content === "string" ? content : JSON.stringify(content, null, 2),
        encoding: "utf-8"
    };
}

/**
 * Format files instruction for AI
 */
export function formatFilesInstruction(files: FileToSave[], baseDir: string): string {
    if (files.length === 0) return "";
    
    const filesList = files.map(f => `- \`${baseDir}/${f.path}\``).join("\n");
    
    return `
---

## 📁 Arquivos para Salvar

A IA deve salvar os seguintes arquivos no projeto:

${filesList}

> **Instruções para a IA**: Use \`write_to_file\` para criar cada arquivo acima.
> Os conteúdos estão no campo \`files\` da resposta desta tool.
`;
}
