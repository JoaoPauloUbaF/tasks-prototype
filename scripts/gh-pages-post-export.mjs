// Create a .nojekyll file for GitHub Pages and ensure a 404.html fallback exists.
// Usage:
//   PUBLIC_URL=https://<user>.github.io/<repo> npm run export:gh
// The "pre" phase cleans/ensures the output dir exists. The "post" phase writes .nojekyll and 404.html.

import fs from 'fs';
import path from 'path';

const OUT_DIR = process.env.OUT_DIR || 'docs';
const phase = process.argv[2];

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

if (phase === 'pre') {
  ensureDir(OUT_DIR);
  // nothing else for pre right now
  process.exit(0);
}

if (phase === 'post') {
  ensureDir(OUT_DIR);
  // 1) Ensure .nojekyll so _expo and other underscored dirs are served
  const nojekyllPath = path.join(OUT_DIR, '.nojekyll');
  try {
    fs.writeFileSync(nojekyllPath, '');
    // console.log(`Wrote ${nojekyllPath}`);
  } catch (e) {
    // ignore
  }

  // 2) Ensure SPA fallback for GitHub Pages
  const indexPath = path.join(OUT_DIR, 'index.html');
  const notFoundPath = path.join(OUT_DIR, '404.html');
  try {
    if (fs.existsSync(indexPath) && !fs.existsSync(notFoundPath)) {
      fs.copyFileSync(indexPath, notFoundPath);
    }
  } catch (e) {
    // ignore
  }

  process.exit(0);
}

