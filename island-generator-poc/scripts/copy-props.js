/**
 * Copy 3D_Models/Props to public/props for serving
 * Run before dev/build so FBX assets are available
 */
import { cpSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, '..', '3D_Models', 'Props');
const dest = join(root, 'public', 'props');

if (!existsSync(src)) {
  console.warn('copy-props: 3D_Models/Props not found at', src);
  process.exit(0);
}
mkdirSync(dest, { recursive: true });
const dirs = ['BerryBush_01', 'BerryBush_02', 'OakTree_01', 'PalmTree_01', 'PalmTree_02', 'Rock_01', 'Rock_06'];
for (const d of dirs) {
  const s = join(src, d);
  if (existsSync(s)) {
    cpSync(s, join(dest, d), { recursive: true });
    console.log('Copied', d);
  }
}
