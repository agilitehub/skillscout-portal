#!/usr/bin/env node
// Global Instructions Rule Applied!
/**
 * Module conformance checks for src/modules (vibe-coding-module + workspace tables rule).
 *
 * Usage:
 *   node scripts/validate-modules.mjs           # exit 1 on hard failures
 *   node scripts/validate-modules.mjs --report  # print metrics + soft warnings
 *   node scripts/validate-modules.mjs --strict-headers  # fail if utils/hooks lack Frontend header
 *
 * Hard failures:
 * - BusinessDashboard/<Feature> missing components/ or utils/
 * - Any import of Table from antd under src/modules
 *
 * Soft warnings (--report): optional styles/, inline style counts, large component files, antd Button imports.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MODULES = path.join(ROOT, 'src', 'modules')

const args = new Set(process.argv.slice(2))
const REPORT = args.has('--report')
const STRICT_HEADERS = args.has('--strict-headers')

const ANT_TABLE_IMPORT_RE =
  /import\s*\{[^}]*\bTable\b[^}]*\}\s*from\s*['"]antd['"]|import\s+Table\s+from\s*['"]antd['"]/

const ANT_BUTTON_IMPORT_RE = /import\s*\{[^}]*\bButton\b[^}]*\}\s*from\s*['"]antd['"]/

const failures = []
const warnings = []

function walkJsFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walkJsFiles(p, acc)
    else if (name.endsWith('.js')) acc.push(p)
  }
  return acc
}

function read(p) {
  return fs.readFileSync(p, 'utf8')
}

/** Business Dashboard feature dirs only (direct children of BusinessDashboard). */
function listBdFeatures() {
  const bd = path.join(MODULES, 'BusinessDashboard')
  if (!fs.existsSync(bd)) return []
  return fs
    .readdirSync(bd)
    .map((name) => path.join(bd, name))
    .filter((p) => fs.statSync(p).isDirectory() && path.basename(p) !== 'styles')
}

function checkBdStructure() {
  const features = listBdFeatures()
  const optionalNoStyles = []

  for (const featPath of features) {
    const name = path.basename(featPath)
    const componentsDir = path.join(featPath, 'components')
    const utilsDir = path.join(featPath, 'utils')
    const stylesDir = path.join(featPath, 'styles')

    if (!fs.existsSync(componentsDir)) {
      failures.push(`Missing directory: ${path.relative(ROOT, componentsDir)}`)
    }
    if (!fs.existsSync(utilsDir)) {
      failures.push(`Missing directory: ${path.relative(ROOT, utilsDir)}`)
    }
    if (!fs.existsSync(stylesDir)) {
      optionalNoStyles.push(name)
    }
  }

  if (REPORT && optionalNoStyles.length) {
    warnings.push(`Features without styles/: ${optionalNoStyles.join(', ')} (optional unless Ant overrides needed)`)
  }
}

function checkAntdTableImports(files) {
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const content = read(file)
    if (ANT_TABLE_IMPORT_RE.test(content)) {
      failures.push(`Forbidden antd Table import in modules: ${rel}`)
    }
  }
}

function checkStrictHeaders(files) {
  if (!STRICT_HEADERS) return
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    if (!rel.includes(`${path.sep}modules${path.sep}`)) continue
    const content = read(file)
    const lines = content.split(/\r?\n/)
    const globalOk = lines[0]?.includes('Global Instructions Rule Applied')
    const frontendOk = lines[1]?.includes('Frontend Instructions Rule Applied')
    const isUi =
      rel.includes(`${path.sep}components${path.sep}`) ||
      rel.endsWith(`${path.sep}Dashboard${path.sep}index.js`) ||
      rel.endsWith(`${path.sep}Login${path.sep}index.js`)

    if (!globalOk) failures.push(`Missing Global header: ${rel}`)
    if (isUi && !frontendOk) failures.push(`Missing Frontend header (UI file): ${rel}`)
    if (!isUi && !frontendOk) failures.push(`Missing Frontend header (strict): ${rel}`)
  }
}

function softReport(files) {
  const inlineByFile = []
  const largeComponents = []
  const antdButtonFiles = []

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    const content = read(file)

    const inlineMatches = content.match(/style=\{\{/g)
    if (inlineMatches) {
      inlineByFile.push({ rel, count: inlineMatches.length })
    }

    if (rel.includes(`${path.sep}components${path.sep}`) && rel.includes(`${path.sep}modules${path.sep}`)) {
      const lineCount = content.split(/\r?\n/).length
      if (lineCount > 300) {
        largeComponents.push({ rel, lines: lineCount })
      }
    }

    if (ANT_BUTTON_IMPORT_RE.test(content)) {
      antdButtonFiles.push(rel)
    }
  }

  inlineByFile.sort((a, b) => b.count - a.count)
  largeComponents.sort((a, b) => b.lines - a.lines)

  console.log('\n--- Inline style={{ counts (top 15) ---')
  inlineByFile.slice(0, 15).forEach(({ rel, count }) => console.log(`  ${count}\t${rel}`))

  console.log('\n--- Components > 300 lines (thin-UI review) ---')
  largeComponents.slice(0, 20).forEach(({ rel, lines }) => console.log(`  ${lines}\t${rel}`))

  if (antdButtonFiles.length) {
    console.log('\n--- antd Button imports (prefer core Button) ---')
    antdButtonFiles.forEach((r) => console.log(`  ${r}`))
  }
}

function main() {
  checkBdStructure()

  const files = walkJsFiles(MODULES)
  checkAntdTableImports(files)
  checkStrictHeaders(files)

  if (REPORT) {
    softReport(files)
  }

  if (warnings.length && REPORT) {
    console.log('\n--- Warnings ---')
    warnings.forEach((w) => console.log(`  ${w}`))
  }

  if (failures.length) {
    console.error('\nModule validation FAILED:\n')
    failures.forEach((f) => console.error(`  - ${f}`))
    process.exit(1)
  }

  if (REPORT || failures.length === 0) {
    console.log('\nModule validation OK.')
  }
}

main()
