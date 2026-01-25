#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init.js';
import { update } from './commands/update.js';
import chalk from 'chalk';
import { createInterface } from 'readline';

const VALID_IDES = ['windsurf', 'cursor', 'antigravity'];

async function promptForIDE(): Promise<string> {
    while (true) {
        console.log(chalk.cyan('\n🎯 Selecione sua IDE de desenvolvimento:\n'));
        
        VALID_IDES.forEach((ide, index) => {
            console.log(chalk.white(`${index + 1}. ${ide}`));
        });
        
        console.log(chalk.yellow('\nDigite o número da IDE desejada:'));
        
        const answer = await new Promise<string>((resolve) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
        
        const choice = parseInt(answer);
        if (choice >= 1 && choice <= VALID_IDES.length) {
            return VALID_IDES[choice - 1];
        }
        
        console.log(chalk.red('❌ Opção inválida. Por favor, digite um número entre 1 e 3.'));
        // Loop continua para perguntar novamente
    }
}

async function promptForIDEWithDefault(): Promise<string> {
    while (true) {
        console.log(chalk.cyan('\n🎯 Selecione sua IDE de desenvolvimento:\n'));
        
        VALID_IDES.forEach((ide, index) => {
            console.log(chalk.white(`${index + 1}. ${ide}`));
        });
        
        console.log(chalk.yellow('\nDigite o número da IDE desejada (ou pressione Enter para Windsurf):'));
        
        const answer = await new Promise<string>((resolve) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
        
        if (answer === '') {
            return 'windsurf'; // Default
        }
        
        const numChoice = parseInt(answer);
        if (numChoice >= 1 && numChoice <= VALID_IDES.length) {
            return VALID_IDES[numChoice - 1];
        }
        
        console.log(chalk.red('❌ Opção inválida. Por favor, digite um número entre 1 e 3.'));
        // Loop continua para perguntar novamente
    }
}

const program = new Command();

program
    .name('maestro')
    .description('CLI para inicializar projetos com Maestro - Desenvolvimento assistido por IA')
    .version('1.0.0')
    .option('-f, --force', 'Sobrescreve arquivos existentes')
    .option('--minimal', 'Instala apenas workflows e rules')
    .option('--ide <ide>', `IDE alvo: ${VALID_IDES.join(', ')} (opcional)`)
    .action(async (options) => {
        let selectedIDE = options.ide;
        
        // Se não foi especificada, perguntar ao usuário
        if (!selectedIDE) {
            selectedIDE = await promptForIDEWithDefault();
        } else {
            // Validar IDE se foi especificada
            if (!VALID_IDES.includes(selectedIDE)) {
                console.error(`❌ IDE inválida. Use: ${VALID_IDES.join(', ')}`);
                console.log(chalk.cyan('\nOpções válidas:'));
                VALID_IDES.forEach((ide, index) => {
                    console.log(chalk.white(`  ${index + 1}. ${ide}`));
                });
                process.exit(1);
            }
        }
        
        await init({ ...options, ide: selectedIDE });
    });

program
    .command('init')
    .description('Inicializa Maestro no projeto atual')
    .option('-f, --force', 'Sobrescreve arquivos existentes')
    .option('--minimal', 'Instala apenas workflows e rules')
    .option('--ide <ide>', `IDE alvo: ${VALID_IDES.join(', ')} (opcional)`)
    .action(async (options) => {
        let selectedIDE = options.ide;
        
        // Se não foi especificada, perguntar ao usuário
        if (!selectedIDE) {
            selectedIDE = await promptForIDE();
        } else {
            // Validar IDE se foi especificada
            if (!VALID_IDES.includes(selectedIDE)) {
                console.error(`❌ IDE inválida. Use: ${VALID_IDES.join(', ')}`);
                console.log(chalk.cyan('\nOpções válidas:'));
                VALID_IDES.forEach((ide, index) => {
                    console.log(chalk.white(`  ${index + 1}. ${ide}`));
                });
                process.exit(1);
            }
        }
        
        init({ ...options, ide: selectedIDE });
    });

program
    .command('update')
    .description('Atualiza content para a última versão')
    .option('-f, --force', 'Sobrescreve arquivos modificados')
    .action(update);

program.parse();
