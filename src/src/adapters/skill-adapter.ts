import { cp, mkdir, readdir, readFile, writeFile, stat, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { constants } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SkillData {
    name: string;
    description: string;
    files: string[];
    metadata?: any;
}

/**
 * Adaptador de skills para diferentes IDEs
 * Mantém estrutura master e gera versões otimizadas
 * Versão portada para MCP (Native Node.js FS)
 */
export class SkillAdapter {
    private readonly IDE_CONFIGS = {
        windsurf: {
            skillsDir: '.windsurf/skills',
            adapter: this.adaptForWindsurf.bind(this)
        },
        cursor: {
            skillsDir: '.cursor/skills',
            adapter: this.adaptForCursor.bind(this)
        },
        antigravity: {
            skillsDir: '.agent/skills',
            adapter: this.adaptForAntigravity.bind(this)
        }
    };

    /**
     * Verifica se arquivo/diretório existe
     */
    private async exists(path: string): Promise<boolean> {
        try {
            await access(path, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Copia e adapta skills para a IDE específica
     */
    async adaptSkills(skillsSource: string, targetDir: string, ide: 'windsurf' | 'cursor' | 'antigravity', force = false): Promise<void> {
        // @ts-ignore
        const config = this.IDE_CONFIGS[ide];
        
        if (!await this.exists(skillsSource)) {
            console.error(`⚠️  Skills source not found: ${skillsSource}`);
            return;
        }

        // Garantir diretório de destino
        await mkdir(targetDir, { recursive: true });

        // Listar todas as skills
        const skillDirs = await this.getSkillDirectories(skillsSource);
        
        // Logs removidos para evitar poluição do stdio do MCP, ou usar console.error
        // console.error(`🔄 Adapting ${skillDirs.length} skills for ${ide}...`);

        for (const skillDir of skillDirs) {
            const skillName = skillDir.split(/[\\/]/).pop()!;
            const skillPath = join(skillsSource, skillDir);
            const destPath = join(targetDir, skillName);

            await config.adapter(skillPath, destPath, skillName, force);
        }

        // console.error(`✅ Skills adapted for ${ide}`);
    }

    /**
     * Lista todos os diretórios de skills
     */
    private async getSkillDirectories(skillsSource: string): Promise<string[]> {
        const items = await readdir(skillsSource);
        const dirs: string[] = [];

        for (const item of items) {
            const itemPath = join(skillsSource, item);
            try {
                const stats = await stat(itemPath);
                if (stats.isDirectory() && await this.exists(join(itemPath, 'SKILL.md'))) {
                    dirs.push(item);
                }
            } catch (e) {
                // Ignore errors
            }
        }

        return dirs;
    }

    /**
     * Adaptador para Windsurf - cópia direta (100% compatível)
     */
    private async adaptForWindsurf(skillPath: string, destPath: string, skillName: string, force: boolean): Promise<void> {
        // Windsurf usa formato nativo - apenas copiar
        // recursive: true é necessário para cp copiar diretórios
        await cp(skillPath, destPath, { recursive: true, force: force });
    }

    /**
     * Adaptador para Cursor - simplificação com headers explícitos
     */
    private async adaptForCursor(skillPath: string, destPath: string, skillName: string, force: boolean): Promise<void> {
        await mkdir(destPath, { recursive: true });

        // Ler SKILL.md original
        const skillMdPath = join(skillPath, 'SKILL.md');
        if (!await this.exists(skillMdPath)) return;

        const content = await readFile(skillMdPath, 'utf-8');
        const parsed = this.parseSkillMetadata(content);

        // Gerar versão Cursor-friendly
        const cursorContent = this.generateCursorContent(parsed, skillPath);
        
        await writeFile(join(destPath, 'SKILL.md'), cursorContent);

        // Copiar outros arquivos .md
        const items = await readdir(skillPath);
        for (const item of items) {
            if (item.endsWith('.md') && item !== 'SKILL.md') {
                const srcFile = join(skillPath, item);
                const destFile = join(destPath, item);
                await cp(srcFile, destFile, { force: force });
            }
        }
    }

    /**
     * Adaptador para Antigravity - formato .agent
     */
    private async adaptForAntigravity(skillPath: string, destPath: string, skillName: string, force: boolean): Promise<void> {
        await mkdir(destPath, { recursive: true });

        // Ler SKILL.md original
        const skillMdPath = join(skillPath, 'SKILL.md');
        if (!await this.exists(skillMdPath)) return;

        const content = await readFile(skillMdPath, 'utf-8');
        const parsed = this.parseSkillMetadata(content);

        // Gerar versão Antigravity-friendly
        const antigravityContent = this.generateAntigravityContent(parsed, skillPath);
        
        // Antigravity espera skill.md (minúsculo)
        await writeFile(join(destPath, 'skill.md'), antigravityContent);

        // Copiar conteúdo para subdiretório content/
        const contentDir = join(destPath, 'content');
        await mkdir(contentDir, { recursive: true });

        const items = await readdir(skillPath);
        for (const item of items) {
            if (item.endsWith('.md') && item !== 'SKILL.md') {
                const srcFile = join(skillPath, item);
                const destFile = join(contentDir, item);
                await cp(srcFile, destFile, { force: force });
            }
        }
    }

    /**
     * Parse metadata do SKILL.md
     */
    private parseSkillMetadata(content: string): SkillData {
        const yamlMatch = content.match(/^---\n(.*?)\n---/s);
        const metadata = yamlMatch ? yamlMatch[1] : '';
        
        const nameMatch = metadata.match(/name:\s*(.+)/);
        const descMatch = metadata.match(/description:\s*(.+)/);

        // Extrair content map
        const contentMapMatch = content.match(/\| File.*?\n\|.*?\n([\s\S]*?)\n---/);
        const files = contentMapMatch ? this.extractFilesFromTable(contentMapMatch[1]) : [];

        return {
            name: nameMatch ? nameMatch[1].trim() : 'unknown',
            description: descMatch ? descMatch[1].trim() : '',
            files,
            metadata: metadata
        };
    }

    /**
     * Extrai lista de arquivos da tabela de content map
     */
    private extractFilesFromTable(tableContent: string): string[] {
        const files: string[] = [];
        const lines = tableContent.split('\n');
        
        for (const line of lines) {
            const match = line.match(/\|\s*`([^`]+)`\s*\|/);
            if (match) {
                files.push(match[1]);
            }
        }
        
        return files;
    }

    /**
     * Gera conteúdo otimizado para Cursor
     */
    private generateCursorContent(skill: SkillData, skillPath: string): string {
        return `# ${skill.name}

## Description
${skill.description}

## Quick Access
${skill.files.map((file: string) => {
    // const fileName = file.replace(/\.md$/, '');
    const description = this.getFileDescription(file);
    const fileName = file.replace(/\.md$/, '');
    return `- **${fileName}**: ${description}`;
}).join('\n')}

## When to Use
Use this skill when working with:
- ${skill.name} related tasks
- ${skill.description.toLowerCase()}

## Files Available
${skill.files.map((file: string) => `- ${file}`).join('\n')}

---
*This skill is part of the Maestro File System - adapted for Cursor*
`;
    }

    /**
     * Gera conteúdo otimizado para Antigravity
     */
    private generateAntigravityContent(skill: SkillData, skillPath: string): string {
        return `---
name: ${skill.name}
trigger: on_demand
category: ${this.getCategoryFromName(skill.name)}
version: 1.0.0
---

# ${skill.name}

## Overview
${skill.description}

## Quick Start
This skill provides expertise in ${skill.name}. Use it when you need help with:

${skill.files.map((file: string) => {
    const fileName = file.replace(/\.md$/, '');
    const description = this.getFileDescription(file);
    return `- **${fileName}**: ${description}`;
}).join('\n')}

## Available Resources
All detailed guides are available in the \`content/\` directory:
${skill.files.map((file: string) => `- \`content/${file}\``).join('\n')}

## Usage
Simply reference this skill when working on ${skill.name} tasks, and the AI will automatically load the relevant expertise.

---
*Generated by Maestro CLI for Antigravity/Gemini*
`;
    }

    /**
     * Obtém descrição do arquivo baseada no nome
     */
    private getFileDescription(fileName: string): string {
        const descriptions: Record<string, string> = {
            'rest.md': 'REST API design principles',
            'graphql.md': 'GraphQL schema design',
            'auth.md': 'Authentication patterns',
            'ux-psychology.md': 'User psychology principles',
            'color-system.md': 'Color theory and selection',
            'typography-system.md': 'Font pairing and scale',
            'api-style.md': 'API style decision tree',
            'response.md': 'Response format patterns',
            'versioning.md': 'API versioning strategies'
        };

        return descriptions[fileName] || 'Detailed guide and reference';
    }

    /**
     * Determina categoria baseada no nome da skill
     */
    private getCategoryFromName(skillName: string): string {
        const categories: Record<string, string> = {
            'api-patterns': 'backend',
            'frontend-design': 'frontend',
            'architecture': 'architecture',
            'database-design': 'database',
            'mobile-design': 'mobile',
            'security': 'security',
            'performance': 'performance',
            'testing': 'testing'
        };

        return categories[skillName] || 'general';
    }
}
