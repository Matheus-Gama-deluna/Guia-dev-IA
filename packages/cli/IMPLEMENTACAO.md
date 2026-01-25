# 🚀 Plano de Implementação - CLI Maestro NPX

## 📋 Visão Geral

Ajuste do CLI `@maestro-ai/cli` existente para adicionar seleção de IDE específica e injeção direcionada de arquivos para Windsurf, Cursor e Antigravity (Google).

---

## 🎯 Objetivos Principais

1. **Seleção de IDE** - Escolha entre Windsurf, Cursor e Antigravity
2. **Injeção Direcionada** - Arquivos específicos por IDE
3. **Setup Imediato** - `npx @maestro-ai/cli --ide <nome>` em 5 minutos
4. **Chat Integration** - Funciona diretamente no chat da IDE
5. **Orquestração Local** - 100% filesystem-based

---

## 🏗️ Arquitetura do CLI

### Estrutura de Diretórios (Atual)

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── init.ts           # ✅ Já existe - precisa ajuste
│   │   ├── update.ts         # ✅ Já existe
│   │   └── status.ts         # ✅ Já existe
│   ├── core/
│   │   ├── installer.ts      # ✅ Já existe - precisa ajuste IDE
│   │   └── validator.ts      # ✅ Já existe
│   └── index.ts              # ✅ Já existe - precisa ajuste opções
├── content/                  # ✅ Já existe
│   ├── workflows/
│   ├── specialists/
│   ├── prompts/
│   ├── templates/
│   └── rules/
├── dist/                     # ✅ Já existe
├── package.json              # ✅ Já existe
├── README.md                 # ✅ Já existe
└── IMPLEMENTACAO.md          # Este arquivo
```

### Arquivos a Serem Modificados

1. **`src/index.ts`** - Adicionar opção `--ide` com validação
2. **`src/commands/init.ts`** - Lógica de seleção de IDE
3. **`src/core/installer.ts`** - Injeção específica por IDE

---

## 🔧 Modificações Necessárias

### 1) Ponto de Entrada (`src/index.ts`) - AJUSTAR

**Adicionar validação de IDE:**

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init.js';
import { update } from './commands/update.js';
import { status } from './commands/status.js';

const VALID_IDES = ['windsurf', 'cursor', 'antigravity'];

const program = new Command();

program
  .name('maestro')
  .description('CLI para inicializar projetos com Maestro - Desenvolvimento assistido por IA')
  .version('1.0.0')
  .option('-f, --force', 'Sobrescreve arquivos existentes')
  .option('--minimal', 'Instala apenas workflows e rules')
  .option('--ide <ide>', `IDE alvo: ${VALID_IDES.join(', ')} (obrigatório)`)
  .action(async (options) => {
    // Validar IDE
    if (!options.ide) {
      console.error('❌ --ide é obrigatório. Use: --ide windsurf|cursor|antigravity');
      process.exit(1);
    }
    
    if (!VALID_IDES.includes(options.ide)) {
      console.error(`❌ IDE inválida. Use: ${VALID_IDES.join(', ')}`);
      process.exit(1);
    }
    
    await init(options);
  });

program
  .command('init')
  .description('Inicializa Maestro no projeto atual')
  .option('-f, --force', 'Sobrescreve arquivos existentes')
  .option('--minimal', 'Instala apenas workflows e rules')
  .option('--ide <ide>', `IDE alvo: ${VALID_IDES.join(', ')} (obrigatório)`)
  .action((options) => {
    if (!options.ide) {
      console.error('❌ --ide é obrigatório. Use: --ide windsurf|cursor|antigravity');
      process.exit(1);
    }
    init(options);
  });

program
  .command('update')
  .description('Atualiza content para a última versão')
  .option('-f, --force', 'Sobrescreve arquivos modificados')
  .action(update);

program
  .command('status')
  .description('Verifica status do projeto Maestro')
  .action(status);

program.parse();
```

### 2) Comando Init (`src/commands/init.ts`) - AJUSTAR

**Adicionar lógica de IDE específica:**

```typescript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { Installer } from '../core/installer.js';

export interface InitOptions {
  force?: boolean;
  minimal?: boolean;
  ide: string; // Agora obrigatório
}

export async function init(options: InitOptions): Promise<void> {
  const spinner = ora(`Inicializando Maestro para ${options.ide}...`).start();
  
  try {
    // 1. Validar diretório atual
    await validateProjectDir(process.cwd(), options.force);
    
    // 2. Instalar estrutura base
    const installer = new Installer();
    await installer.install({
      targetDir: process.cwd(),
      ide: options.ide,
      minimal: options.minimal || false,
      force: options.force || false
    });
    
    // 3. Configurar IDE específica
    await installer.configureIDE(options.ide);
    
    spinner.succeed(chalk.green(`✅ Maestro inicializado para ${options.ide}!`));
    
    // 4. Mostrar próximos passos
    showNextSteps(options.ide);
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Falha na inicialização'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function validateProjectDir(targetDir: string, force: boolean = false): Promise<void> {
  // Verificar se já tem Maestro
  const maestroDir = path.join(targetDir, '.maestro');
  if (await fs.pathExists(maestroDir) && !force) {
    throw new Error('Projeto Maestro já existe. Use --force para sobrescrever.');
  }
}

function showNextSteps(ide: string): void {
  console.log(chalk.cyan('\n🎯 Próximos Passos:'));
  console.log(chalk.white('1. Abra sua IDE AI'));
  console.log(chalk.white('2. Digite: /maestro'));
  console.log(chalk.white('3. Comece a desenvolver!'));
  
  console.log(chalk.cyan(`\n💡 Configurado para ${ide}:`));
  
  switch (ide) {
    case 'windsurf':
      console.log(chalk.white('• Workflows em .windsurf/workflows/'));
      console.log(chalk.white('• Skills em .windsurf/skills/'));
      console.log(chalk.white('• Regras em .windsurfrules'));
      break;
    case 'cursor':
      console.log(chalk.white('• Commands em .cursor/commands/'));
      console.log(chalk.white('• Skills em .cursor/skills/'));
      console.log(chalk.white('• Regras em .cursorrules'));
      break;
    case 'antigravity':
      console.log(chalk.white('• Workflows em .agent/workflows/'));
      console.log(chalk.white('• Skills em .agent/skills/'));
      console.log(chalk.white('• Regras em .gemini/GEMINI.md'));
      break;
  }
  
  console.log(chalk.white('• Especialistas IA carregados'));
  console.log(chalk.white('• Templates prontos para uso'));
}
```

### 3) Core Installer (`src/core/installer.ts`) - AJUSTAR

**Adicionar injeção específica por IDE:**

```typescript
import fs from 'fs-extra';
import path from 'path';

export interface InstallConfig {
  targetDir: string;
  ide: string;
  minimal: boolean;
  force: boolean;
}

export class Installer {
  async install(config: InstallConfig): Promise<void> {
    // 1. Criar estrutura base
    await this.createBaseStructure(config.targetDir);
    
    // 2. Copiar conteúdo Maestro
    await this.copyMaestroContent(config);
    
    // 3. Gerar arquivos de configuração
    await this.generateConfigFiles(config);
    
    // 4. Customizar para IDE específica
    await this.customizeForIDE(config);
    
    // 5. Criar estado inicial
    await this.createInitialState(config);
  }
  
  private async createBaseStructure(targetDir: string): Promise<void> {
    const dirs = [
      '.maestro',
      '.maestro/history',
      '.maestro/content',
      'docs'
    ];
    
    for (const dir of dirs) {
      await fs.ensureDir(path.join(targetDir, dir));
    }
  }
  
  private async copyMaestroContent(config: InstallConfig): Promise<void> {
    const contentDir = path.join(__dirname, '../../content');
    const targetContentDir = path.join(config.targetDir, '.maestro/content');
    
    if (config.minimal) {
      // Apenas workflows e rules
      await fs.copy(
        path.join(contentDir, 'workflows'),
        path.join(targetContentDir, 'workflows')
      );
      await fs.copy(
        path.join(contentDir, 'rules'),
        path.join(targetContentDir, 'rules')
      );
    } else {
      // Conteúdo completo
      await fs.copy(contentDir, targetContentDir);
    }
  }
  
  private async generateConfigFiles(config: InstallConfig): Promise<void> {
    // Configuração do projeto
    const projectConfig = {
      nome: path.basename(config.targetDir),
      diretorio: config.targetDir,
      nivel: 'simples',
      tipo_artefato: 'internal',
      tier_gate: 'base',
      classificacao_confirmada: false,
      tipo_fluxo: 'novo_projeto',
      fase_atual: 0,
      total_fases: 7,
      entregaveis: {},
      gates_validados: [],
      usar_stitch: false,
      stitch_confirmado: false,
      ide: config.ide,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };
    
    await fs.writeJSON(
      path.join(config.targetDir, '.maestro/estado.json'),
      projectConfig,
      { spaces: 2 }
    );
  }
  
  private async customizeForIDE(config: InstallConfig): Promise<void> {
    switch (config.ide) {
      case 'windsurf':
        await this.setupWindsurf(config.targetDir);
        break;
      case 'cursor':
        await this.setupCursor(config.targetDir);
        break;
      case 'antigravity':
        await this.setupAntigravity(config.targetDir);
        break;
    }
  }
  
  private async setupWindsurf(targetDir: string): Promise<void> {
    // Criar diretórios Windsurf
    await fs.ensureDir(path.join(targetDir, '.windsurf'));
    await fs.ensureDir(path.join(targetDir, '.windsurf/workflows'));
    await fs.ensureDir(path.join(targetDir, '.windsurf/skills'));
    
    // Copiar workflows para .windsurf/workflows/
    const workflowsSource = path.join(targetDir, '.maestro/content/workflows');
    const workflowsTarget = path.join(targetDir, '.windsurf/workflows');
    await fs.copy(workflowsSource, workflowsTarget);
    
    // Copiar skills para .windsurf/skills/
    const skillsSource = path.join(targetDir, '.maestro/content/skills');
    const skillsTarget = path.join(targetDir, '.windsurf/skills');
    await fs.copy(skillsSource, skillsTarget);
    
    // Criar .windsurfrules
    const rulesSource = path.join(targetDir, '.maestro/content/rules/RULES.md');
    const rulesTarget = path.join(targetDir, '.windsurfrules');
    await fs.copy(rulesSource, rulesTarget);
  }
  
  private async setupCursor(targetDir: string): Promise<void> {
    // Criar diretórios Cursor
    await fs.ensureDir(path.join(targetDir, '.cursor'));
    await fs.ensureDir(path.join(targetDir, '.cursor/commands'));
    await fs.ensureDir(path.join(targetDir, '.cursor/skills'));
    
    // Copiar workflows para .cursor/commands/
    const workflowsSource = path.join(targetDir, '.maestro/content/workflows');
    const commandsTarget = path.join(targetDir, '.cursor/commands');
    await fs.copy(workflowsSource, commandsTarget);
    
    // Copiar skills para .cursor/skills/
    const skillsSource = path.join(targetDir, '.maestro/content/skills');
    const skillsTarget = path.join(targetDir, '.cursor/skills');
    await fs.copy(skillsSource, skillsTarget);
    
    // Criar .cursorrules
    const rulesSource = path.join(targetDir, '.maestro/content/rules/RULES.md');
    const rulesTarget = path.join(targetDir, '.cursorrules');
    await fs.copy(rulesSource, rulesTarget);
  }
  
  private async setupAntigravity(targetDir: string): Promise<void> {
    // Criar diretórios Antigravity
    await fs.ensureDir(path.join(targetDir, '.agent'));
    await fs.ensureDir(path.join(targetDir, '.agent/workflows'));
    await fs.ensureDir(path.join(targetDir, '.agent/skills'));
    await fs.ensureDir(path.join(targetDir, '.gemini'));
    
    // Copiar workflows para .agent/workflows/
    const workflowsSource = path.join(targetDir, '.maestro/content/workflows');
    const agentWorkflowsTarget = path.join(targetDir, '.agent/workflows');
    await fs.copy(workflowsSource, agentWorkflowsTarget);
    
    // Copiar skills para .agent/skills/
    const skillsSource = path.join(targetDir, '.maestro/content/skills');
    const agentSkillsTarget = path.join(targetDir, '.agent/skills');
    await fs.copy(skillsSource, agentSkillsTarget);
    
    // Criar .gemini/GEMINI.md
    const geminiSource = path.join(targetDir, '.maestro/content/rules/GEMINI.md');
    const geminiTarget = path.join(targetDir, '.gemini/GEMINI.md');
    await fs.copy(geminiSource, geminiTarget);
  }
  
  private async createInitialState(config: InstallConfig): Promise<void> {
    // Criar arquivo de contexto inicial
    const contextContent = `# Contexto do Projeto Maestro

## Projeto: ${path.basename(config.targetDir)}
## Inicializado: ${new Date().toLocaleDateString('pt-BR')}
## CLI: @maestro-ai/cli v1.0.0
## IDE: ${config.ide}

## Estrutura Criada
- .maestro/ - Configuração e conteúdo Maestro
- docs/ - Documentação do projeto

## Configuração ${config.ide}
${this.getIDEStructure(config.ide)}

## Próximos Passos
1. Abra sua ${config.ide}
2. Digite: /maestro
3. Siga as instruções no chat

## Workflows Disponíveis
- /iniciar-projeto - Iniciar novo projeto
- /avancar-fase - Avançar para próxima fase
- /status-projeto - Ver status e progresso
- /continuar - Continuar fase atual

## Especialistas IA
- Gestão de Produto
- Engenharia de Requisitos
- UX Design
- Arquitetura de Software
- E mais 21 especialistas disponíveis
`;
    
    await fs.writeFile(
      path.join(config.targetDir, 'docs/CONTEXTO.md'),
      contextContent
    );
  }
  
  private getIDEStructure(ide: string): string {
    switch (ide) {
      case 'windsurf':
        return `- .windsurf/workflows/ - Workflows para Windsurf
- .windsurf/skills/ - Skills especializadas
- .windsurfrules - Regras de validação`;
      case 'cursor':
        return `- .cursor/commands/ - Commands para Cursor
- .cursor/skills/ - Skills especializadas
- .cursorrules - Regras de validação`;
      case 'antigravity':
        return `- .agent/workflows/ - Workflows para Antigravity
- .agent/skills/ - Skills especializadas
- .gemini/GEMINI.md - Regras para Gemini`;
      default:
        return '';
    }
  }
  
  async configureIDE(ide: string): Promise<void> {
    // Configurações adicionais podem ser adicionadas aqui
    console.log(`✅ IDE ${ide} configurada com sucesso!`);
  }
}
  
  private async createBaseStructure(targetDir: string): Promise<void> {
    const dirs = [
      '.maestro',
      '.maestro/history',
      '.maestro/content',
      'docs',
      '.agent',
      '.agent/skills',
      '.agent/workflows'
    ];
    
    for (const dir of dirs) {
      await fs.ensureDir(path.join(targetDir, dir));
    }
  }
  
  private async copyMaestroContent(config: InstallConfig): Promise<void> {
    const contentDir = path.join(__dirname, '../../content');
    const targetContentDir = path.join(config.targetDir, '.maestro/content');
    
    if (config.minimal) {
      // Apenas workflows e rules
      await fs.copy(
        path.join(contentDir, 'workflows'),
        path.join(targetContentDir, 'workflows')
      );
      await fs.copy(
        path.join(contentDir, 'rules'),
        path.join(targetContentDir, 'rules')
      );
    } else {
      // Conteúdo completo
      await fs.copy(contentDir, targetContentDir);
    }
  }
  
  private async generateConfigFiles(config: InstallConfig): Promise<void> {
    // Configuração do projeto
    const projectConfig = {
      nome: path.basename(config.targetDir),
      diretorio: config.targetDir,
      nivel: 'simples', // Será atualizado pelo primeiro workflow
      tipo_artefato: 'internal',
      tier_gate: 'base',
      classificacao_confirmada: false,
      tipo_fluxo: 'novo_projeto',
      fase_atual: 0,
      total_fases: 7,
      entregaveis: {},
      gates_validados: [],
      usar_stitch: false,
      stitch_confirmado: false,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };
    
    await fs.writeJSON(
      path.join(config.targetDir, '.maestro/estado.json'),
      projectConfig,
      { spaces: 2 }
    );
    
    // Configuração do CLI
    const cliConfig = {
      version: '1.0.0',
      ide: config.ide,
      minimal: config.minimal,
      installed_at: new Date().toISOString()
    };
    
    await fs.writeJSON(
      path.join(config.targetDir, '.maestro/config.json'),
      cliConfig,
      { spaces: 2 }
    );
  }
  
  private async customizeForIDE(config: InstallConfig): Promise<void> {
    if (config.ide === 'all') {
      // Configurar todas as IDEs
      await this.ideCustomizer.configureAll(config.targetDir);
    } else {
      // Configurar IDE específica
      await this.ideCustomizer.configureIDE(config.targetDir, config.ide);
    }
  }
  
  private async createInitialState(config: InstallConfig): Promise<void> {
    // Criar arquivo de contexto inicial
    const contextContent = `# Contexto do Projeto Maestro

## Projeto: ${path.basename(config.targetDir)}
## Inicializado: ${new Date().toLocaleDateString('pt-BR')}
## CLI: @maestro-ai/cli v1.0.0
## IDE: ${config.ide}

## Estrutura Criada
- .maestro/ - Configuração e conteúdo Maestro
- docs/ - Documentação do projeto
- .agent/ - Skills e workflows para Gemini/Antigravity

## Próximos Passos
1. Abra sua IDE AI
2. Digite: /maestro
3. Siga as instruções no chat

## Workflows Disponíveis
- /iniciar-projeto - Iniciar novo projeto
- /avancar-fase - Avançar para próxima fase
- /status-projeto - Ver status e progresso
- /continuar - Continuar fase atual

## Especialistas IA
- Gestão de Produto
- Engenharia de Requisitos
- UX Design
- Arquitetura de Software
- E mais 21 especialistas disponíveis
`;
    
    await fs.writeFile(
      path.join(config.targetDir, 'docs/CONTEXTO.md'),
      contextContent
    );
  }
  
  async configureIDE(environment: any): Promise<void> {
    // Configurações específicas por IDE
    switch (environment.ide) {
      case 'windsurf':
        await this.configureWindsurf(environment);
        break;
      case 'cursor':
        await this.configureCursor(environment);
        break;
      case 'gemini':
        await this.configureGemini(environment);
        break;
      case 'copilot':
        await this.configureCopilot(environment);
        break;
    }
  }
  
  private async configureWindsurf(environment: any): Promise<void> {
    // Criar configuração Windsurf
    const windsurfConfig = {
      workflows: [
        {
          name: "Maestro",
          description: "Desenvolvimento assistido por IA",
          path: ".maestro/content/workflows"
        }
      ],
      rules: [
        {
          name: "Maestro Rules",
          path: ".maestro/content/rules"
        }
      ]
    };
    
    await fs.writeJSON(
      path.join(process.cwd(), '.windsurf/workflows.json'),
      windsurfConfig,
      { spaces: 2 }
    );
  }
  
  // ... métodos para outras IDEs
}
```

```
.windsurf/
├── workflows/           # Copiado de .maestro/content/workflows/
├── skills/              # Copiado de .maestro/content/skills/
└── .windsurfrules       # Copiado de .maestro/content/rules/RULES.md
```

```
.cursor/
├── commands/           # Copiado de .maestro/content/workflows/
├── skills/              # Copiado de .maestro/content/skills/
└── .cursorrules        # Copiado de .maestro/content/rules/RULES.md
```

```
.agent/
├── workflows/          # Copiado de .maestro/content/workflows/
└── skills/             # Copiado de .maestro/content/skills/
.gemini/
└── GEMINI.md           # Copiado de .maestro/content/rules/GEMINI.md
```

Após implementação, o usuário terá:

1. **Setup instantâneo** - `npx @maestro-ai/cli --ide <nome>`
2. **Arquivos corretos** - Estrutura específica para cada IDE
3. **Chat integration** - Funciona diretamente no chat
4. **Zero configuração** - Apenas instalar e usar
