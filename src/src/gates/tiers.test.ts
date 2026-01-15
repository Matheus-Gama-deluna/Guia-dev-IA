import { describe, it, expect } from 'vitest';
import { determinarTierGate, getChecklistPorTier, contarItensGate } from './tiers.js';
import { validarEstrutura } from './estrutura.js';

describe('Sistema de Gates Adaptativos', () => {

    describe('determinarTierGate', () => {
        it('deve retornar essencial para POCs e Scripts', () => {
            expect(determinarTierGate('poc', 'simples')).toBe('essencial');
            expect(determinarTierGate('poc', 'complexo')).toBe('essencial');
            expect(determinarTierGate('script', 'medio')).toBe('essencial');
        });

        it('deve retornar base ou essencial para Internal', () => {
            expect(determinarTierGate('internal', 'simples')).toBe('essencial');
            expect(determinarTierGate('internal', 'medio')).toBe('base');
            expect(determinarTierGate('internal', 'complexo')).toBe('base');
        });

        it('deve escalar Product de base até avancado', () => {
            expect(determinarTierGate('product', 'simples')).toBe('base');
            expect(determinarTierGate('product', 'medio')).toBe('base');
            expect(determinarTierGate('product', 'complexo')).toBe('avancado');
        });
    });

    describe('getChecklistPorTier', () => {
        it('essencial deve ter itens minimos', () => {
            const checklist = getChecklistPorTier(1, 'essencial');
            expect(checklist).toContain('Problema claramente definido');
            expect(checklist).not.toContain('Personas ou usuários identificados'); // Apenas base
        });

        it('base deve herdar essencial', () => {
            const checklist = getChecklistPorTier(1, 'base');
            expect(checklist).toContain('Problema claramente definido'); // Herdado
            expect(checklist).toContain('Personas ou usuários identificados'); // Base
        });

        it('avancado deve ter itens especificos', () => {
            const checklist = getChecklistPorTier(6, 'avancado'); // Arquitetura
            expect(checklist).toContain('Diagrama C4 completo (níveis 1-4)'); // Avancado
            expect(checklist).toContain('Diagrama C4 básico (níveis 1-2)'); // Base
        });
    });

    describe('contarItensGate', () => {
        it('advanced deve ter mais itens que base', () => {
            const countBase = contarItensGate('base');
            const countAdv = contarItensGate('avancado');
            expect(countAdv.itens).toBeGreaterThan(countBase.itens);
        });
    });

    describe('validarEstrutura (Adaptativo)', () => {
        // Mock de PRD pequeno (200 chars)
        const prdPequeno = `
# Problema
O problema é x.
# Funcionalidades
Func A, Func B.
        `.padEnd(200, 'a'); // Preenche até 200 chars

        // Mock de PRD médio (400 chars)
        const prdMedio = `
# Problema
O problema é muito complexo...
# Usuários
Devs, QAs.
# Funcionalidades
Feature 1, 2, 3.
# Métricas
KPIs de sucesso.
        `.padEnd(400, 'a');

        it('PRD pequeno deve passar no tier essencial (min 100)', () => {
            const result = validarEstrutura(1, prdPequeno, 'essencial');
            expect(result.tamanho_ok).toBe(true);
            expect(result.secoes_faltando).toHaveLength(0); // Essencial só pede problema e funcionalidades
        });

        it('PRD pequeno deve falhar no tier base (min 300)', () => {
            const result = validarEstrutura(1, prdPequeno, 'base');
            expect(result.tamanho_ok).toBe(false); // < 300
        });

        it('PRD pequeno deve falhar por seções faltantes no tier base', () => {
            const result = validarEstrutura(1, prdPequeno, 'base');
            // Base exige Usuários e Métricas, que não estão no prdPequeno
            expect(result.secoes_faltando).toContain('Seção de Usuários/Personas');
        });

        it('PRD médio deve passar no tier base', () => {
            const result = validarEstrutura(1, prdMedio, 'base');
            expect(result.tamanho_ok).toBe(true); // >= 300
            expect(result.secoes_faltando).toHaveLength(0);
        });
    });

});
