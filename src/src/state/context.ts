/**
 * Global project context management
 * Tracks the current project directory across tool calls
 */

import { existsSync } from "fs";
import { join } from "path";

// Global state: stores the current project directory
let currentProjectDirectory: string | null = null;

// Path to state file
const ESTADO_FILE = ".maestro/estado.json";

/**
 * Check if a directory contains a valid Maestro project
 */
export function isValidProject(dir: string): boolean {
    const estadoPath = join(dir, ESTADO_FILE);
    return existsSync(estadoPath);
}

/**
 * Set the current project directory
 */
export function setCurrentDirectory(dir: string): void {
    currentProjectDirectory = dir;
}

/**
 * Get the current project directory
 * Falls back to process.cwd() if not set
 */
export function getCurrentDirectory(): string {
    return currentProjectDirectory || process.cwd();
}

/**
 * Clear the current project directory
 */
export function clearCurrentDirectory(): void {
    currentProjectDirectory = null;
}

/**
 * Check if a project directory is currently tracked
 */
export function hasCurrentDirectory(): boolean {
    return currentProjectDirectory !== null;
}

/**
 * Get default projects directory based on environment
 * In production (Docker), use /app/projects (where volume is mounted)
 * In development, use current working directory
 */
export function getDefaultProjectsDirectory(): string {
    return process.env.NODE_ENV === "production" 
        ? "/app/projects" 
        : process.cwd();
}

/**
 * Get project directory from args or fallback to current/cwd
 * Also performs auto-detection of existing projects
 */
export function resolveDirectory(argsDir?: string): string {
    // If directory provided, use it and update global state
    if (argsDir) {
        setCurrentDirectory(argsDir);
        return argsDir;
    }

    // If we have a current directory, use it
    if (currentProjectDirectory) {
        return currentProjectDirectory;
    }

    // Fallback to cwd
    const cwd = process.cwd();

    // Check if cwd has a valid project
    if (isValidProject(cwd)) {
        setCurrentDirectory(cwd);
        return cwd;
    }

    return cwd;
}

/**
 * Try to auto-detect and load a project from a directory
 * Returns the directory if valid, null otherwise
 */
export function tryAutoDetect(dir: string): string | null {
    if (isValidProject(dir)) {
        setCurrentDirectory(dir);
        return dir;
    }
    return null;
}
