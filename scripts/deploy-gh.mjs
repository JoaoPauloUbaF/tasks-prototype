import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function sh(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs');
const WORKTREE = path.join(ROOT, '.gh-pages');

// 1) Build web and post-process
sh('node ./scripts/gh-pages-post-export.mjs pre');
sh('npx expo export --platform web --output-dir docs');
sh('node ./scripts/gh-pages-post-export.mjs post');

// 2) Ensure gh-pages worktree exists
try {
  if (!fs.existsSync(WORKTREE) || !fs.existsSync(path.join(WORKTREE, '.git'))) {
    sh('git worktree prune || true');
    if (fs.existsSync(WORKTREE)) sh(`rm -rf ${WORKTREE}`);
    sh('git fetch origin gh-pages:gh-pages || true');
    sh(`git worktree add -B gh-pages ${WORKTREE} origin/gh-pages`);
  }
} catch {}

// 3) Sync docs -> worktree and push
sh(`rsync -av --delete --exclude=.git ${OUT_DIR}/ ${WORKTREE}/`);
sh(`git -C ${WORKTREE} add -A`);
try {
  sh(`git -C ${WORKTREE} commit -m "build: deploy web export to gh-pages"`);
} catch {
  console.log('No changes to commit.');
}
sh(`git -C ${WORKTREE} push origin gh-pages`);

