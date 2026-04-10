# ============================================================
#   SETUP ENVIRONNEMENT DE TEST COMPLET POUR WINDOWS (POWERSHELL)
#   Compatible: Windows 10/11 (PowerShell 5.1 / 7+)
# ============================================================

$ErrorActionPreference = "Stop"

function Write-Title {
    param([string]$text)
    Write-Host "`n======================================" -ForegroundColor Blue
    Write-Host "  $text" -ForegroundColor White
    Write-Host "======================================`n" -ForegroundColor Blue
}

function Write-Log { param([string]$msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param([string]$msg) Write-Host "[i] $msg" -ForegroundColor Blue }
function Write-Warn { param([string]$msg) Write-Host "[!] $msg" -ForegroundColor Yellow }

# ─────────────────────────────────────────
# 0. VERIFICATIONS INITIALES
# ─────────────────────────────────────────
Write-Title "0. Verifications initiales"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warn "Node.js non trouve. Veuillez l'installer via https://nodejs.org/"
}
else {
    Write-Log "Node.js detecte : $(node -v)"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Warn "npm non trouve."
}
else {
    Write-Log "npm detecte : $(npm -v)"
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Warn "Git non trouve."
}
else {
    Write-Log "Git detecte : $(git --version)"
}

# ─────────────────────────────────────────
# 1. OUTILS DE TEST DE BASE
# ─────────────────────────────────────────
Write-Title "1. Outils de test de base"

Write-Info "Installation des outils globaux npm..."
npm install -g jest vitest mocha chai supertest ts-jest @jest/globals nodemon

Write-Log "Jest        -> test unitaire JS/TS"
Write-Log "Vitest      -> test rapide (Vite ecosystem)"
Write-Log "Mocha+Chai  -> test BDD flexible"
Write-Log "Supertest   -> test API HTTP"
Write-Log "Nodemon     -> rechargement automatique"

# ─────────────────────────────────────────
# 2. FLUX FRONT-END AUTOMATISES
# ─────────────────────────────────────────
Write-Title "2. Flux automatises Front-end"

npm install -g @playwright/test cypress @testing-library/dom @testing-library/jest-dom

Write-Info "Installation des navigateurs Playwright..."
npx playwright install --with-deps chromium firefox webkit

Write-Log "Playwright  -> E2E multi-navigateur"
Write-Log "Cypress     -> E2E visuel interactif"

# ─────────────────────────────────────────
# 3. CREATION DES FICHIERS DE CONFIGURATION
# ─────────────────────────────────────────
Write-Title "3. Creation des fichiers de configuration"

$PROJECT_DIR = Join-Path $Home "test-workspace"
if (-not (Test-Path $PROJECT_DIR)) { New-Item -Path $PROJECT_DIR -ItemType Directory }
Set-Location $PROJECT_DIR

# -- jest.config.js ──────────────────────
$jestConfig = @"
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  verbose: true,
  testTimeout: 10000,
};
"@
$jestConfig | Out-File -FilePath "jest.config.js" -Encoding utf8
Write-Log "jest.config.js cree"

# -- vitest.config.ts ─────────────────────
$vitestConfig = @"
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 80, functions: 80, branches: 80 },
    },
    reporters: ['verbose'],
    testTimeout: 10000,
  },
});
"@
$vitestConfig | Out-File -FilePath "vitest.config.ts" -Encoding utf8
Write-Log "vitest.config.ts cree"

# -- package.json ─────────────────────────
$packageJson = @"
{
  "name": "test-workspace",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  }
}
"@
$packageJson | Out-File -FilePath "package.json" -Encoding utf8
Write-Log "package.json cree"

# ─────────────────────────────────────────
# 4. RECAPITULATIF FINAL
# ─────────────────────────────────────────
Write-Title "Installation terminee"
Write-Host "Dossier : $PROJECT_DIR" -ForegroundColor Green
Write-Host "`nCommandes rapides :"
Write-Host "  npm test      -> Lancer Jest"
Write-Host "  npx playwright test -> Lancer E2E"
Write-Host "`nOuvrez ce dossier dans VSCode pour commencer !"
