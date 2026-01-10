/**
 * Memory types for project context persistence
 */

// Summary of a deliverable
export interface EntregavelResumo {
    fase: number;
    nome: string;
    tipo: string;
    arquivo: string;
    resumo: string;
    pontos_chave: string[];
    decisoes?: string[];
    criado_em: string;
}

// Complete project summary
export interface ProjectSummary {
    // Basic info
    projeto_id: string;
    nome: string;
    descricao?: string;
    nivel: string;
    fase_atual: number;
    total_fases: number;
    atualizado_em: string;

    // PRD summary
    prd?: {
        problema: string;
        contexto: string;
        usuarios: string[];
        personas: { nome: string; descricao: string }[];
        objetivos: string[];
        metricas_sucesso: string[];
        mvp_features: string[];
        fora_de_escopo: string[];
    };

    // Requirements summary
    requisitos?: {
        funcionais: { id: string; descricao: string; prioridade: string }[];
        nao_funcionais: { tipo: string; requisito: string }[];
        regras_negocio: string[];
        restricoes: string[];
    };

    // Architecture summary
    arquitetura?: {
        visao_geral: string;
        stack: { camada: string; tecnologia: string; motivo: string }[];
        padrao: string;
        componentes: { nome: string; responsabilidade: string }[];
        integracao: { sistema: string; tipo: string }[];
        decisoes_arquiteturais: { id: string; titulo: string; decisao: string; motivo: string }[];
    };

    // Backlog summary
    backlog?: {
        total_features: number;
        total_historias: number;
        features: { id: string; nome: string; descricao: string; historias: number }[];
        prioridade_alta: string[];
    };

    // Design summary
    design?: {
        estilo_visual: string;
        paleta_cores: string[];
        tipografia: string;
        componentes_principais: string[];
        fluxos_principais: string[];
    };

    // All deliverables
    entregaveis: EntregavelResumo[];

    // Project timeline
    timeline?: {
        inicio: string;
        previsao_fim?: string;
        marcos: { data: string; descricao: string }[];
    };

    // Important decisions log
    decisoes_importantes: {
        id: string;
        data: string;
        contexto: string;
        decisao: string;
        alternativas?: string[];
        motivo: string;
    }[];

    // Current context for AI
    contexto_atual: {
        fase_nome: string;
        objetivo: string;
        proximo_passo: string;
        dependencias: string[];
        bloqueios?: string[];
    };
}

// Codebase structure info
export interface CodebaseInfo {
    atualizado_em: string;

    // Project structure
    estrutura: {
        raiz: string;
        pastas: { path: string; descricao: string }[];
    };

    // Main files
    arquivos_principais: {
        path: string;
        tipo: "entry" | "config" | "core" | "util" | "test" | "other";
        descricao: string;
        exporta?: string[];
    }[];

    // Dependencies
    dependencias: {
        nome: string;
        versao: string;
        tipo: "prod" | "dev";
        uso: string;
    }[];

    // API contracts
    endpoints?: {
        path: string;
        metodo: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        descricao: string;
        request?: string;
        response?: string;
    }[];

    // Database schema
    entidades?: {
        nome: string;
        campos: { nome: string; tipo: string; descricao?: string }[];
        relacoes?: string[];
    }[];

    // Patterns and conventions
    padroes: {
        naming: string;
        estrutura_pastas: string;
        testes: string;
        commits?: string;
    };

    // Known issues or tech debt
    divida_tecnica?: {
        descricao: string;
        prioridade: "alta" | "media" | "baixa";
        arquivo?: string;
    }[];
}

/**
 * Generate markdown from ProjectSummary
 */
export function formatResumoMarkdown(resumo: ProjectSummary): string {
    const lines: string[] = [];

    lines.push(`# 📋 Resumo do Projeto: ${resumo.nome}\n`);
    lines.push(`> Última atualização: ${new Date(resumo.atualizado_em).toLocaleString("pt-BR")}\n`);

    // Basic info
    lines.push("## 📊 Status");
    lines.push(`| Campo | Valor |`);
    lines.push(`|-------|-------|`);
    lines.push(`| **Nível** | ${resumo.nivel.toUpperCase()} |`);
    lines.push(`| **Fase Atual** | ${resumo.fase_atual}/${resumo.total_fases} |`);
    lines.push(`| **ID** | \`${resumo.projeto_id}\` |\n`);

    // PRD
    if (resumo.prd) {
        lines.push("## 🎯 PRD\n");
        lines.push(`### Problema\n${resumo.prd.problema}\n`);
        lines.push(`### Contexto\n${resumo.prd.contexto}\n`);

        if (resumo.prd.usuarios.length > 0) {
            lines.push(`### Usuários\n${resumo.prd.usuarios.map(u => `- ${u}`).join("\n")}\n`);
        }

        if (resumo.prd.objetivos.length > 0) {
            lines.push(`### Objetivos\n${resumo.prd.objetivos.map(o => `- ${o}`).join("\n")}\n`);
        }

        if (resumo.prd.mvp_features.length > 0) {
            lines.push(`### MVP Features\n${resumo.prd.mvp_features.map(f => `- ${f}`).join("\n")}\n`);
        }
    }

    // Requirements
    if (resumo.requisitos) {
        lines.push("## 📝 Requisitos\n");

        if (resumo.requisitos.funcionais.length > 0) {
            lines.push("### Funcionais");
            lines.push("| ID | Descrição | Prioridade |");
            lines.push("|-----|-----------|------------|");
            resumo.requisitos.funcionais.forEach(r => {
                lines.push(`| ${r.id} | ${r.descricao} | ${r.prioridade} |`);
            });
            lines.push("");
        }

        if (resumo.requisitos.nao_funcionais.length > 0) {
            lines.push("### Não-Funcionais");
            resumo.requisitos.nao_funcionais.forEach(r => {
                lines.push(`- **${r.tipo}**: ${r.requisito}`);
            });
            lines.push("");
        }
    }

    // Architecture
    if (resumo.arquitetura) {
        lines.push("## 🏗️ Arquitetura\n");
        lines.push(`### Visão Geral\n${resumo.arquitetura.visao_geral}\n`);
        lines.push(`**Padrão:** ${resumo.arquitetura.padrao}\n`);

        if (resumo.arquitetura.stack.length > 0) {
            lines.push("### Stack");
            lines.push("| Camada | Tecnologia | Motivo |");
            lines.push("|--------|------------|--------|");
            resumo.arquitetura.stack.forEach(s => {
                lines.push(`| ${s.camada} | ${s.tecnologia} | ${s.motivo} |`);
            });
            lines.push("");
        }

        if (resumo.arquitetura.decisoes_arquiteturais.length > 0) {
            lines.push("### Decisões Arquiteturais");
            resumo.arquitetura.decisoes_arquiteturais.forEach(d => {
                lines.push(`- **[${d.id}] ${d.titulo}**: ${d.decisao} _(${d.motivo})_`);
            });
            lines.push("");
        }
    }

    // Backlog
    if (resumo.backlog) {
        lines.push("## 📦 Backlog\n");
        lines.push(`- **Total Features:** ${resumo.backlog.total_features}`);
        lines.push(`- **Total Histórias:** ${resumo.backlog.total_historias}\n`);

        if (resumo.backlog.features.length > 0) {
            lines.push("### Features");
            resumo.backlog.features.forEach(f => {
                lines.push(`- **${f.id}** ${f.nome}: ${f.descricao} (${f.historias} histórias)`);
            });
            lines.push("");
        }
    }

    // Deliverables
    if (resumo.entregaveis.length > 0) {
        lines.push("## 📁 Entregáveis\n");
        resumo.entregaveis.forEach(e => {
            lines.push(`### Fase ${e.fase}: ${e.nome}`);
            lines.push(`**Arquivo:** \`${e.arquivo}\`\n`);
            lines.push(e.resumo);
            if (e.pontos_chave.length > 0) {
                lines.push("\n**Pontos-chave:**");
                e.pontos_chave.forEach(p => lines.push(`- ${p}`));
            }
            lines.push("");
        });
    }

    // Important decisions
    if (resumo.decisoes_importantes.length > 0) {
        lines.push("## 🎯 Decisões Importantes\n");
        resumo.decisoes_importantes.forEach(d => {
            lines.push(`### [${d.id}] ${d.decisao}`);
            lines.push(`- **Data:** ${d.data}`);
            lines.push(`- **Contexto:** ${d.contexto}`);
            lines.push(`- **Motivo:** ${d.motivo}`);
            lines.push("");
        });
    }

    // Current context
    lines.push("## 🔄 Contexto Atual\n");
    lines.push(`- **Fase:** ${resumo.contexto_atual.fase_nome}`);
    lines.push(`- **Objetivo:** ${resumo.contexto_atual.objetivo}`);
    lines.push(`- **Próximo Passo:** ${resumo.contexto_atual.proximo_passo}`);

    return lines.join("\n");
}

/**
 * Generate markdown from CodebaseInfo
 */
export function formatCodebaseMarkdown(codebase: CodebaseInfo): string {
    const lines: string[] = [];

    lines.push(`# 💻 Codebase\n`);
    lines.push(`> Última atualização: ${new Date(codebase.atualizado_em).toLocaleString("pt-BR")}\n`);

    // Structure
    lines.push("## 📁 Estrutura\n");
    lines.push("```");
    lines.push(codebase.estrutura.raiz);
    codebase.estrutura.pastas.forEach(p => {
        lines.push(`├── ${p.path}  # ${p.descricao}`);
    });
    lines.push("```\n");

    // Main files
    if (codebase.arquivos_principais.length > 0) {
        lines.push("## 📄 Arquivos Principais\n");
        lines.push("| Arquivo | Tipo | Descrição |");
        lines.push("|---------|------|-----------|");
        codebase.arquivos_principais.forEach(a => {
            lines.push(`| \`${a.path}\` | ${a.tipo} | ${a.descricao} |`);
        });
        lines.push("");
    }

    // Dependencies
    if (codebase.dependencias.length > 0) {
        lines.push("## 📦 Dependências\n");
        lines.push("| Pacote | Versão | Uso |");
        lines.push("|--------|--------|-----|");
        codebase.dependencias.forEach(d => {
            lines.push(`| ${d.nome} | ${d.versao} | ${d.uso} |`);
        });
        lines.push("");
    }

    // Endpoints
    if (codebase.endpoints && codebase.endpoints.length > 0) {
        lines.push("## 🔌 API Endpoints\n");
        lines.push("| Método | Path | Descrição |");
        lines.push("|--------|------|-----------|");
        codebase.endpoints.forEach(e => {
            lines.push(`| ${e.metodo} | \`${e.path}\` | ${e.descricao} |`);
        });
        lines.push("");
    }

    // Entities
    if (codebase.entidades && codebase.entidades.length > 0) {
        lines.push("## 🗄️ Entidades\n");
        codebase.entidades.forEach(e => {
            lines.push(`### ${e.nome}`);
            lines.push("| Campo | Tipo |");
            lines.push("|-------|------|");
            e.campos.forEach(c => {
                lines.push(`| ${c.nome} | ${c.tipo} |`);
            });
            lines.push("");
        });
    }

    // Patterns
    lines.push("## 📐 Padrões\n");
    lines.push(`- **Naming:** ${codebase.padroes.naming}`);
    lines.push(`- **Estrutura:** ${codebase.padroes.estrutura_pastas}`);
    lines.push(`- **Testes:** ${codebase.padroes.testes}`);

    return lines.join("\n");
}
