import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Dependency-free checks for common accidental leaks. Never prints secret values.
const root = process.cwd();
const staged = process.argv.includes('--staged');
const skipped = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vite', '.cache', '.pnpm-store']);
function walk(directory = '') {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
    if (skipped.has(entry.name)) return [];
    const path = directory ? `${directory}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}
let paths;
if (staged) {
  paths = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
} else {
  try {
    paths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\0').filter(Boolean);
  } catch {
    paths = walk();
  }
}
const forbidden = /(^|\/)(?:\.env(?:\..*)?|\.npmrc|\.openai|\.sites(?:-runtime|-checkout[^/]*)?|\.aws|\.ssh|\.codex|\.agents|secrets?|credentials[^/]*|service[-_]account[^/]*)(?:\/|$)|\.(?:pem|key|p12|pfx|keystore)$/i;
const examples = /(^|\/)\.env\.(?:example|sample)$/i;
const rules = [
  ['private key', /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['API secret', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ['credential in URL', /https?:\/\/[^\s/:'"<>]+:[^\s/'"<>@]+@/],
  ['literal secret assignment', /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*['"][A-Za-z0-9_+/=-]{20,}['"]/i],
  ['local user path', /(?:[A-Z]:\\Users\\[^\s\\]+|\/Users\/[^\s/]+|\/home\/[^\s/]+)/i],
  ['personal email', /\b[A-Z0-9._%+-]+@(?:gmail|outlook|hotmail|yahoo|icloud)\.[A-Z]{2,}\b/i],
];
const issues = [];
for (const path of [...new Set(paths)]) {
  if (forbidden.test(path) && !examples.test(path)) issues.push(`${path}: private/local file must not be published`);
  let content;
  try { content = staged ? execFileSync('git', ['show', `:${path}`], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }) : readFileSync(resolve(root, path), 'utf8'); }
  catch { issues.push(`${path}: could not inspect file`); continue; }
  if (content.includes('\0')) continue;
  content.split(/\r?\n/).forEach((line, index) => {
    for (const [name, pattern] of rules) {
      if (pattern.test(line)) issues.push(`${path}:${index + 1}: possible ${name}`);
    }
  });
}
if (issues.length) {
  console.error('Publication check failed. Review these locations (values hidden):\n' + issues.join('\n'));
  process.exitCode = 1;
} else console.log(`Publication check passed: ${paths.length} files inspected; no common secret patterns or private paths found.`);
