/**
 * Sistema de Gates Adaptativos - Tiers
 * 
 * Define itens de gate por tier:
 * - essencial: mínimo viável (POCs, scripts)
 * - base: desenvolvimento padrão (tools internas, produtos simples)
 * - avancado: sistemas críticos (produtos complexos)
 * 
 * Cada tier herda os itens do tier anterior.
 */

import type { TierGate, TipoArtefato, NivelComplexidade } from "../types/index.js";

/**
 * Itens de gate por tier e fase
 * A herança funciona assim: base = essencial + base, avancado = essencial + base + avancado
 */
export const GATE_TIERS: Record<TierGate, Record<number, string[]>> = {
    essencial: {
        // Fase 1: Produto
        1: [
            "Problema claramente definido",
            "Escopo MVP com funcionalidades listadas",
        ],
        // Fase 2: Requisitos
        2: [
            "Funcionalidades principais listadas",
        ],
        // Fase 3: UX/Design
        3: [
            "Fluxo principal esboçado",
        ],
        // Fase 4: Arquitetura
        4: [
            "Stack tecnológica definida",
        ],
        // Fase 5: Código/Implementação
        5: [
            "Código principal implementado",
            "Funcionalidade testada manualmente",
        ],
    },

    base: {
        // Fase 1: Produto - adiciona
        1: [
            "Personas ou usuários identificados",
            "Métricas de sucesso definidas",
        ],
        // Fase 2: Requisitos - adiciona
        2: [
            "Requisitos com IDs únicos (RF001)",
            "Critérios de aceite básicos",
            "Requisitos não-funcionais principais",
        ],
        // Fase 3: UX/Design - adiciona
        3: [
            "Wireframes ou protótipos criados",
            "Jornadas do usuário mapeadas",
        ],
        // Fase 4: Modelo de Domínio
        4: [
            "Entidades identificadas",
            "Relacionamentos definidos",
        ],
        // Fase 5: Banco de Dados
        5: [
            "Modelo de dados definido",
            "Índices planejados",
        ],
        // Fase 6: Arquitetura
        6: [
            "Diagrama C4 básico (níveis 1-2)",
            "ADRs para decisões críticas",
        ],
        // Fase 7: Segurança
        7: [
            "Autenticação definida",
            "Dados sensíveis identificados",
        ],
        // Fase 8: Testes
        8: [
            "Estratégia de testes definida",
            "Meta de cobertura estabelecida",
        ],
        // Fase 9: Backlog
        9: [
            "Épicos definidos",
            "Histórias com critérios de aceite",
            "Definition of Done estabelecido",
        ],
        // Fase 10: Contrato API
        10: [
            "Esquema OpenAPI definido",
            "Tipos gerados",
        ],
        // Fase 11: Frontend
        11: [
            "Componentes implementados",
            "Integração com mocks",
        ],
        // Fase 12: Backend
        12: [
            "API implementada",
            "Testes unitários passando",
        ],
        // Fase 13: Integração
        13: [
            "Frontend integrado ao Backend",
            "Testes E2E básicos",
        ],
    },

    avancado: {
        // Fase 2: Requisitos - adiciona
        2: [
            "Critérios de aceite em Gherkin",
            "Matriz de rastreabilidade",
        ],
        // Fase 4: Modelo de Domínio - adiciona DDD
        4: [
            "Bounded Contexts definidos",
            "Aggregates identificados",
            "Regras de negócio por entidade",
        ],
        // Fase 6: Arquitetura - adiciona
        6: [
            "Diagrama C4 completo (níveis 1-4)",
            "CQRS/Event Sourcing avaliados",
            "Microserviços mapeados se aplicável",
        ],
        // Fase 7: Segurança - adiciona
        7: [
            "OWASP Top 10 avaliado",
            "Threat modeling realizado",
            "Compliance verificado (LGPD/GDPR)",
        ],
        // Fase 8: Performance (nova)
        8: [
            "Load testing planejado",
            "Caching strategy definida",
            "Métricas de performance",
        ],
        // Fase 9: Observabilidade (nova)
        9: [
            "Estratégia de logs definida",
            "Métricas configuradas",
            "Tracing distribuído planejado",
            "SLOs definidos",
        ],
        // Fase 10: Testes - adiciona
        10: [
            "Contract testing planejado",
            "Pirâmide de testes definida",
        ],
        // Fase 11: Backlog - adiciona
        11: [
            "Sprints planejadas",
            "Dependências mapeadas",
        ],
        // Fase 13: Integração - adiciona
        13: [
            "Pipeline CI/CD completo",
            "Monitoramento ativo",
        ],
    },
};

/**
 * Obtém checklist completo para uma fase baseado no tier
 * Herda itens dos tiers anteriores automaticamente
 */
export function getChecklistPorTier(fase: number, tier: TierGate): string[] {
    const items: string[] = [];

    // Sempre inclui essencial
    if (GATE_TIERS.essencial[fase]) {
        items.push(...GATE_TIERS.essencial[fase]);
    }

    // Se tier >= base, inclui base
    if (tier === "base" || tier === "avancado") {
        if (GATE_TIERS.base[fase]) {
            items.push(...GATE_TIERS.base[fase]);
        }
    }

    // Se tier == avancado, inclui avancado
    if (tier === "avancado") {
        if (GATE_TIERS.avancado[fase]) {
            items.push(...GATE_TIERS.avancado[fase]);
        }
    }

    return items;
}

/**
 * Determina tier de gate baseado em tipo de artefato + complexidade
 * 
 * Regras:
 * - POC/Script: sempre essencial (mínimo viável)
 * - Internal: essencial para simples, base para médio/complexo
 * - Product: nunca essencial (base para simples/médio, avançado para complexo)
 */
export function determinarTierGate(
    tipo: TipoArtefato,
    nivel: NivelComplexidade
): TierGate {
    // POC e scripts sempre essencial
    if (tipo === "poc" || tipo === "script") {
        return "essencial";
    }

    // Internal: base para médio/complexo, essencial para simples
    if (tipo === "internal") {
        return nivel === "simples" ? "essencial" : "base";
    }

    // Product: escala com complexidade, nunca essencial
    switch (nivel) {
        case "simples":
            return "base";
        case "medio":
            return "base";
        case "complexo":
            return "avancado";
    }
}

/**
 * Retorna contagem de itens de gate por tier para uma configuração
 */
export function contarItensGate(tier: TierGate): { fases: number; itens: number } {
    let totalItens = 0;
    const fasesSet = new Set<number>();

    // Conta essencial
    for (const [fase, items] of Object.entries(GATE_TIERS.essencial)) {
        fasesSet.add(Number(fase));
        totalItens += items.length;
    }

    // Se tier >= base
    if (tier === "base" || tier === "avancado") {
        for (const [fase, items] of Object.entries(GATE_TIERS.base)) {
            fasesSet.add(Number(fase));
            totalItens += items.length;
        }
    }

    // Se tier == avancado
    if (tier === "avancado") {
        for (const [fase, items] of Object.entries(GATE_TIERS.avancado)) {
            fasesSet.add(Number(fase));
            totalItens += items.length;
        }
    }

    return { fases: fasesSet.size, itens: totalItens };
}

/**
 * Descrição amigável do tier para exibição
 */
export function descreverTier(tier: TierGate): string {
    const stats = contarItensGate(tier);

    switch (tier) {
        case "essencial":
            return `Tier Essencial (${stats.fases} fases, ${stats.itens} validações) - Mínimo viável para POCs e scripts`;
        case "base":
            return `Tier Base (${stats.fases} fases, ${stats.itens} validações) - Desenvolvimento padrão`;
        case "avancado":
            return `Tier Avançado (${stats.fases} fases, ${stats.itens} validações) - Sistemas críticos`;
    }
}
