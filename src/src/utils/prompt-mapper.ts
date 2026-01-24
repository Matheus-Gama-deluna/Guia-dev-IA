/**
 * Mapeamento de fases para prompts relacionados
 * Usado para injetar prompts recomendados nas respostas do MCP
 */

export interface PromptRef {
    categoria: string;
    nome: string;
}

/**
 * Mapeamento fase → prompts relacionados
 * Os prompts são carregados de .maestro/content/prompts/ ou fallback do servidor
 */
const FASE_PROMPTS_MAP: Record<string, PromptRef[]> = {
    // Fase 1
    "Produto": [
        { categoria: "produto", nome: "prd-completo" },
        { categoria: "produto", nome: "north-star" }
    ],
    // Fase 2
    "Requisitos": [
        { categoria: "requisitos", nome: "analise-requisitos" },
        { categoria: "requisitos", nome: "gherkin" }
    ],
    // Fase 3
    "UX Design": [
        { categoria: "ux", nome: "design-system" }
    ],
    // Fase 4 (Stitch - opcional)
    "Prototipagem": [],
    // Fase 4/5 
    "Modelo de Domínio": [
        { categoria: "arquitetura", nome: "modelo-dominio" },
        { categoria: "arquitetura", nome: "ddd-bounded-contexts" }
    ],
    // Fase 5/6
    "Banco de Dados": [
        { categoria: "database", nome: "modelagem-postgres" },
        { categoria: "database", nome: "otimizacao-queries" }
    ],
    // Fase 6/7
    "Arquitetura": [
        { categoria: "arquitetura", nome: "clean-architecture" },
        { categoria: "arquitetura", nome: "arquitetura-c4-completo" }
    ],
    // Fase 7 (complexo)
    "Arquitetura Avançada": [
        { categoria: "arquitetura", nome: "ddd-cqrs" },
        { categoria: "arquitetura", nome: "multi-tenancy" }
    ],
    // Fase 7/8
    "Segurança": [
        { categoria: "seguranca", nome: "security-review" },
        { categoria: "seguranca", nome: "auth-patterns" },
        { categoria: "seguranca", nome: "lgpd-compliance" }
    ],
    // Fase 8/9
    "Testes": [
        { categoria: "testes", nome: "plano-testes" },
        { categoria: "testes", nome: "tdd-workflow" },
        { categoria: "testes", nome: "testes-integracao" }
    ],
    // Fase 9 (complexo)
    "Performance": [
        { categoria: "escalabilidade", nome: "escalabilidade-horizontal" },
        { categoria: "escalabilidade", nome: "caching-strategies" }
    ],
    // Fase 10 (complexo)
    "Observabilidade": [
        { categoria: "observabilidade", nome: "logging-estruturado" },
        { categoria: "observabilidade", nome: "metricas-alertas" },
        { categoria: "observabilidade", nome: "tracing-distribuido" }
    ],
    // Fase Backlog
    "Plano de Execução": [],
    // Fase Contrato API
    "Contrato API": [
        { categoria: "apis", nome: "openapi-design" },
        { categoria: "apis", nome: "rest-best-practices" }
    ],
    // Fase Frontend
    "Frontend": [
        { categoria: "desenvolvimento", nome: "code-review" },
        { categoria: "acessibilidade", nome: "wcag-checklist" }
    ],
    // Fase Backend
    "Backend": [
        { categoria: "desenvolvimento", nome: "code-review" }
    ],
    // Fase Integração/DevOps
    "Integração": [
        { categoria: "devops", nome: "ci-cd-pipeline" },
        { categoria: "devops", nome: "docker-kubernetes" }
    ]
};

/**
 * Mapeamento de stacks para exemplos de fluxo completo
 */
const STACK_EXEMPLOS_MAP: Record<string, string> = {
    "java": "Exemplo de Fluxo Completo com Java e Spring Boot",
    "spring": "Exemplo de Fluxo Completo com Java e Spring Boot",
    "springboot": "Exemplo de Fluxo Completo com Java e Spring Boot",
    "laravel": "Exemplo de Fluxo Completo com Laravel e Filament",
    "filament": "Exemplo de Fluxo Completo com Laravel e Filament",
    "livewire": "Exemplo de Fluxo Completo com Laravel e Livewire",
    "php": "Exemplo de Fluxo Completo com Laravel e Filament",
    "node": "Exemplo de Fluxo Completo com Node e NestJS",
    "nodejs": "Exemplo de Fluxo Completo com Node e NestJS",
    "nestjs": "Exemplo de Fluxo Completo com Node e NestJS",
    "nest": "Exemplo de Fluxo Completo com Node e NestJS",
    "typescript": "Exemplo de Fluxo Completo com Node e NestJS",
    "default": "Exemplo de Fluxo Completo com Node e NestJS"
};

/**
 * Retorna prompts relacionados a uma fase
 */
export function getPromptsParaFase(faseNome: string): PromptRef[] {
    return FASE_PROMPTS_MAP[faseNome] || [];
}

/**
 * Verifica se uma fase tem prompts relacionados
 */
export function temPromptsParaFase(faseNome: string): boolean {
    const prompts = FASE_PROMPTS_MAP[faseNome];
    return prompts !== undefined && prompts.length > 0;
}

/**
 * Detecta stack a partir de texto (nome/descrição do projeto)
 */
export function detectarStack(nome?: string, descricao?: string): string | null {
    const texto = `${nome || ""} ${descricao || ""}`.toLowerCase();
    
    const stacks = [
        "spring", "springboot", "java",
        "laravel", "filament", "livewire", "php",
        "nestjs", "nest", "node", "nodejs", "typescript"
    ];
    
    for (const stack of stacks) {
        if (texto.includes(stack)) {
            return stack;
        }
    }
    
    return null;
}

/**
 * Retorna nome do exemplo mais relevante para uma stack
 */
export function getExemploParaStack(stack?: string | null): string | null {
    if (!stack) return STACK_EXEMPLOS_MAP["default"];
    return STACK_EXEMPLOS_MAP[stack.toLowerCase()] || STACK_EXEMPLOS_MAP["default"];
}

/**
 * Gera markdown com seção de prompts recomendados
 */
export function gerarSecaoPrompts(faseNome: string): string {
    const prompts = getPromptsParaFase(faseNome);
    
    if (prompts.length === 0) {
        return "";
    }
    
    const linhas = prompts.map(p => 
        `- \`read_resource("maestro://prompt/${p.categoria}/${p.nome}")\``
    );
    
    return `
## 📚 Prompts Recomendados

Para gerar o entregável com qualidade, consulte:

${linhas.join("\n")}

> 💡 Estes prompts contêm instruções detalhadas e exemplos práticos.
`;
}

/**
 * Gera markdown com referência ao exemplo de fluxo
 */
export function gerarSecaoExemplo(stack?: string | null): string {
    const exemplo = getExemploParaStack(stack);
    
    if (!exemplo) {
        return "";
    }
    
    return `
## 📖 Exemplo de Referência

Para ver um fluxo completo similar ao seu projeto, consulte:

\`read_resource("maestro://exemplo/${encodeURIComponent(exemplo)}")\`

> 💡 Este exemplo mostra todas as fases do desenvolvimento com a stack recomendada.
`;
}
