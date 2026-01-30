#!/usr/bin/env node
/**
 * Extract Pirate Kings lore from LORE.md and output JSON + inject into PRESENTATION_GDD.html
 * Run: node scripts/extract-lore.js
 * Or: npm run extract-lore
 *
 * When LORE.md is updated, run this script to regenerate the presentation data.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const lorePath = join(root, 'LORE.md');
const jsonPath = join(root, 'public', 'data', 'pirate-kings-lore.json');
const presentationPath = join(root, 'PRESENTATION_GDD.html');

const IMAGE_MAP = {
  jasper: { image: 'Images/PirateKings/JasperBarrow.png', familiar: 'Images/Familiars/Gloomfeather.png' },
  mordekai: { image: 'Images/PirateKings/Captain_Mordekai_Drakon.png', familiar: 'Images/Familiars/Ssyrix.png' },
  adara: { image: 'Images/PirateKings/Lady_Adara_Thalassa.png', familiar: 'Images/Familiars/Pearl.png' },
  nimue: { image: 'Images/PirateKings/Nimue_Tideborn.png', familiar: 'Images/Familiars/Inkshadow.png' },
  ebon: { image: 'Images/PirateKings/Flameheart_01.png', familiar: 'Images/Familiars/Ember.png' },
};

function parseLore(content) {
  const kings = [];
  const sections = content.split(/\n---\n/);

  for (const section of sections) {
    const headerMatch = section.match(/^### \d+\. (.+?) — (.+)$/m);
    if (!headerMatch) continue;

    const [, name, title] = headerMatch;
    const id = name.toLowerCase()
      .replace(/^(captain|lady)\s+/, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z_]/g, '');
    const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
    const key = slug.includes('jasper') ? 'jasper' : slug.includes('mordekai') ? 'mordekai' : slug.includes('adara') ? 'adara' : slug.includes('nimue') ? 'nimue' : 'ebon';

    const themeMatch = section.match(/\*\*Theme:\*\*\s*(.+?)(?:\n|$)/);
    const alignmentMatch = section.match(/\*\*Alignment:\*\*\s*(.+?)(?:\n|$)/);
    const statusMatch = section.match(/\*\*Status:\*\*\s*(.+?)(?:\n|$)/);

    const backstoryMatch = section.match(/\*\*Backstory\*\*\s*\n([\s\S]+?)(?=\*\*Dragons:\*\*)/);
    const dragonsMatch = section.match(/\*\*Dragons:\*\*\s*(.+?)(?=\n\*\*Familiar:\*\*)/s);
    const familiarMatch = section.match(/\*\*Familiar:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)(?:\n-|\n\*\*Domain)/s);
    const familiarAbilities = [...(section.match(/(?<=\*\*Familiar:\*\*[\s\S]+?)\n- (.+?)(?=\n-|\n\*\*Domain|$)/gs) || [])].map(s => s.replace(/^- /, '').trim());
    const domainMatch = section.match(/\*\*Domain:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)(?:\n-|\n\*\*Player)/s);
    const domainEffects = [...(section.match(/(?<=\*\*Domain:\*\*[\s\S]+?)\n- (.+?)(?=\n-|\n\*\*Player|$)/gs) || [])].map(s => s.replace(/^- /, '').trim());
    const playerHooks = [...(section.match(/(?<=\*\*Player Hooks\*\*[\s\S]+?)\n- (.+?)(?=\n-|$)/gs) || [])].map(s => s.replace(/^- /, '').trim());

    const dragonStance = (dragonsMatch?.[1] || '').toLowerCase().includes('not') || (dragonsMatch?.[1] || '').includes('protects') ? 'protects' : 'hunts';

    const images = IMAGE_MAP[key] || { image: '', familiar: '' };

    kings.push({
      id: key,
      name,
      title,
      image: images.image,
      theme: themeMatch?.[1]?.trim() || '',
      alignment: alignmentMatch?.[1]?.trim() || '',
      status: statusMatch?.[1]?.trim() || '',
      backstory: backstoryMatch?.[1]?.trim() || '',
      dragons: dragonsMatch?.[1]?.trim() || '',
      dragonStance,
      familiar: {
        name: familiarMatch?.[1]?.trim() || '',
        type: familiarMatch?.[2]?.trim() || '',
        image: images.familiar,
        abilities: familiarAbilities.filter(Boolean),
      },
      domain: {
        name: domainMatch?.[1]?.trim() || '',
        desc: domainMatch?.[2]?.trim() || '',
        effects: domainEffects.filter(Boolean),
      },
      playerHooks: playerHooks.filter(Boolean),
    });
  }

  return kings;
}

function extractWithRegex(content) {
  const kings = [];
  const kingBlocks = content.split(/(?=### \d+\. )/).filter(b => b.match(/^### \d+\. /));

  for (const block of kingBlocks) {
    const numName = block.match(/^### (\d+)\. (.+?) — (.+)$/m);
    if (!numName) continue;
    const [, num, name, title] = numName;

    let key = 'ebon';
    if (name.includes('Jasper')) key = 'jasper';
    else if (name.includes('Mordekai')) key = 'mordekai';
    else if (name.includes('Adara')) key = 'adara';
    else if (name.includes('Nimue')) key = 'nimue';

    const theme = block.match(/\*\*Theme:\*\*\s*(.+?)$/m)?.[1]?.trim() || '';
    const alignment = block.match(/\*\*Alignment:\*\*\s*(.+?)$/m)?.[1]?.trim() || '';
    const status = block.match(/\*\*Status:\*\*\s*(.+?)$/m)?.[1]?.trim() || '';

    const backstorySection = block.match(/\*\*Backstory\*\*\s*\n([\s\S]*?)(?=\*\*Dragons:\*\*)/);
    const backstory = backstorySection?.[1]?.trim() || '';

    const dragonsSection = block.match(/\*\*Dragons:\*\*\s*([\s\S]*?)(?=\*\*Familiar:\*\*)/);
    const dragons = dragonsSection?.[1]?.trim() || '';
    const dragonStance = dragons.toLowerCase().includes('not') || dragons.includes('protects') ? 'protects' : 'hunts';

    const familiarLine = block.match(/\*\*Familiar:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)$/m);
    const familiarAbilities = (block.match(/\*\*Familiar:\*\*[\s\S]*?((?:\n\s*-\s*.+)+)/)?.[1] || '')
      .split('\n').filter(l => /^\s*-\s*/.test(l)).map(l => l.replace(/^\s*-\s*/, '').trim()) || [];

    const domainLine = block.match(/\*\*Domain:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)$/m);
    const domainEffects = (block.match(/\*\*Domain:\*\*[\s\S]*?((?:\n\s*-\s*.+)+)/)?.[1] || '')
      .split('\n').filter(l => /^\s*-\s*/.test(l)).map(l => l.replace(/^\s*-\s*/, '').trim()) || [];

    const playerHooks = (block.match(/\*\*Player Hooks\*\*[\s\S]*?((?:\n\s*-\s*.+)+)/)?.[1] || '')
      .split('\n').filter(l => /^\s*-\s*/.test(l)).map(l => l.replace(/^\s*-\s*/, '').trim()).filter(l => l && l !== '--') || [];

    const images = IMAGE_MAP[key];

    kings.push({
      id: key,
      name,
      title,
      image: images?.image || '',
      theme,
      alignment,
      status,
      backstory,
      dragons,
      dragonStance,
      familiar: {
        name: familiarLine?.[1]?.trim() || '',
        type: familiarLine?.[2]?.trim() || '',
        image: images?.familiar || '',
        abilities: familiarAbilities,
      },
      domain: {
        name: domainLine?.[1]?.trim() || '',
        desc: domainLine?.[2]?.trim() || '',
        effects: domainEffects,
      },
      playerHooks,
    });
  }

  return kings;
}

const loreContent = readFileSync(lorePath, 'utf-8');
const kings = extractWithRegex(loreContent);

writeFileSync(jsonPath, JSON.stringify(kings, null, 2), 'utf-8');
console.log(`Wrote ${jsonPath}`);

const presentationContent = readFileSync(presentationPath, 'utf-8');
const placeholder = '<!-- PIRATE_KINGS_LORE_DATA -->';
const injectedScript = `<script>window.PIRATE_KINGS_LORE=${JSON.stringify(kings)};</script>`;

const placeholderRegex = /<!-- PIRATE_KINGS_LORE_DATA -->/;
const existingScriptRegex = /<script>window\.PIRATE_KINGS_LORE=[\s\S]+?<\/script>/;

let newContent;
if (presentationContent.includes(placeholder)) {
  newContent = presentationContent.replace(placeholderRegex, injectedScript);
} else if (existingScriptRegex.test(presentationContent)) {
  newContent = presentationContent.replace(existingScriptRegex, injectedScript);
} else {
  console.warn('Placeholder <!-- PIRATE_KINGS_LORE_DATA --> or existing script not found in PRESENTATION_GDD.html.');
  process.exit(1);
}
writeFileSync(presentationPath, newContent, 'utf-8');
console.log('Injected lore data into PRESENTATION_GDD.html');
