# Implementation Plan - Flow and Specialist Fixes

## Problem Analysis
1.  **Specialist Not Found**: `types.ts` referenced "Modelagem de Domínio", but file is "Especialista em Modelagem e Arquitetura de Domínio com IA.md".
2.  **Flow Phase Skip**: Medium/Complex flows had a single "Desenvolvimento" phase after API Contract, missing the detailed breakdown.
3.  **File Naming**: "Especialista em Gestão de Produto .md" had a trailing space causing potential lookup issues.

## Proposed Changes

### 1. File System
- **Rename**: `d:\Sistemas\Maestro\02-especialistas\Especialista em Gestão de Produto .md` -> `...Product.md` (remove space).

### 2. Codebase (`src/flows/types.ts`)
- **Update Specialist Name**: Change "Modelagem de Domínio" to "Modelagem e Arquitetura de Domínio com IA".
- **Refactor `FLUXO_MEDIO`**:
    - Increase phases from 11 to 13.
    - Replace generic "Desenvolvimento" with:
        - Phase 11: Frontend
        - Phase 12: Backend
        - Phase 13: Integração
- **Refactor `FLUXO_COMPLEXO`**:
    - Increase phases from 15 to 17.
    - Replace generic "Desenvolvimento" and "Deploy" with:
        - ...
        - Phase 13: Contrato API
        - Phase 14: Frontend
        - Phase 15: Backend
        - Phase 16: Integração
        - Phase 17: Deploy Final

## Verification
- Check `types.ts` compilation.
- Verify file listings match code references.
