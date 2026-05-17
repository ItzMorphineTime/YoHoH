#!/usr/bin/env node
/**
 * Extract structured lore data from LORE.md and update the pitch-deck presentation.
 *
 * Outputs:
 * - public/data/lore.json
 * - docs/data/lore.json
 * - public/data/pirate-kings-lore.json  (backwards compatibility)
 * - docs/data/pirate-kings-lore.json    (backwards compatibility)
 *
 * Also injects window.LORE_DATA and window.PIRATE_KINGS_LORE into index.html/docs/index.html
 * and LOREBOOK.html/docs/LOREBOOK.html when placeholders or previous generated data blocks are present.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const root = [here, join(here, '..'), join(here, '..', '..')].find(p => existsSync(join(p, 'LORE.md')));
if (!root) throw new Error('Could not find LORE.md in current or parent folders.');

const lorePath = join(root, 'LORE.md');
const presentationPath = existsSync(join(root, 'docs', 'index.html')) ? join(root, 'docs', 'index.html') : join(root, 'index.html');
const lorebookPath = existsSync(join(root, 'docs', 'LOREBOOK.html'))
  ? join(root, 'docs', 'LOREBOOK.html')
  : existsSync(join(root, 'LOREBOOK.html'))
    ? join(root, 'LOREBOOK.html')
    : null;
const outputDirs = [join(root, 'public', 'data'), join(root, 'docs', 'data')];

const IMAGE_FALLBACKS = {
  jasper: ['Images/PirateKings/JasperBarrow.png', 'Images/Familiars/Gloomfeather.png'],
  mordekai: ['Images/PirateKings/Captain_Mordekai_Drakon.png', 'Images/Familiars/Ssyrix.png'],
  adara: ['Images/PirateKings/Lady_Adara_Thalassa.png', 'Images/Familiars/Pearl.png'],
  nimue: ['Images/PirateKings/Nimue_Tideborn.png', 'Images/Familiars/Inkshadow.png'],
  ebon: ['Images/PirateKings/Flameheart_01.png', 'Images/Familiars/Ember.png'],
};

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
function clean(s) {
  return String(s || '').replace(/\*\*/g, '').replace(/`/g, '').trim();
}
function stripMd(s) {
  return clean(String(s || '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\|/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}
function h1(md) {
  return md.match(/^#\s+(.+)$/m)?.[1]?.trim() || '';
}
function quote(md) {
  return md.match(/^>\s*\*?"?(.+?)"?\*?\s*$/m)?.[1]?.trim() || '';
}
function h2(md, re) {
  const heads = [...md.matchAll(/^##\s+(.+)$/gm)];
  const i = heads.findIndex(m => re.test(m[1].trim()));
  if (i < 0) return '';
  return md.slice(heads[i].index, heads[i + 1]?.index ?? md.length).trim();
}
function h3(block, re) {
  const heads = [...block.matchAll(/^###\s+(.+)$/gm)];
  const i = heads.findIndex(m => re.test(m[1].trim()));
  if (i < 0) return '';
  return block.slice(heads[i].index, heads[i + 1]?.index ?? block.length).trim();
}
function title(block, level = 2) {
  return block.match(new RegExp(`^#{${level}}\\s+(.+)$`, 'm'))?.[1]?.trim() || '';
}
function removeMainHeading(block, level = 2) {
  return String(block || '').replace(new RegExp(`^#{${level}}\\s+.+\\n?`, 'm'), '').trim();
}
function paragraphs(block) {
  return String(block || '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .filter(p => !/^#{1,6}\s+/.test(p) && !/^[-*]\s+/.test(p) && !/^\|/.test(p) && !/^---$/.test(p));
}
function bullets(block) {
  return String(block || '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^[-*]\s+/.test(l))
    .map(l => l.replace(/^[-*]\s+/, '').trim());
}
function field(block, label) {
  const e = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return block.match(new RegExp(`\\*\\*${e}:\\*\\*\\s*(.+?)\\s*$`, 'm'))?.[1]?.trim() || '';
}
function bodyAfterHeading(block, label, until = []) {
  const e = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = block.match(new RegExp(`\\*\\*${e}\\*\\*\\s*\\n`, 'm'));
  if (!m || m.index == null) return '';
  return takeUntil(block, m.index + m[0].length, until).trim();
}
function bodyAfterField(block, label, until = []) {
  const e = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = block.match(new RegExp(`\\*\\*${e}:\\*\\*\\s*`, 'm'));
  if (!m || m.index == null) return '';
  return takeUntil(block, m.index + m[0].length, until).trim();
}
function takeUntil(block, start, labels) {
  let end = block.length;
  const rest = block.slice(start);
  for (const label of labels) {
    const e = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = rest.match(new RegExp(`^\\*\\*${e}(?::)?\\*\\*`, 'm'));
    if (m && m.index != null) end = Math.min(end, start + m.index);
  }
  return block.slice(start, end);
}
function listAfter(block, startRe, stopRe) {
  const m = block.match(startRe);
  if (!m || m.index == null) return [];
  const rest = block.slice(m.index + m[0].length);
  const stop = rest.search(stopRe);
  return bullets(stop >= 0 ? rest.slice(0, stop) : rest);
}
function table(block) {
  const rows = String(block || '').split('\n').map(l => l.trim()).filter(l => /^\|/.test(l));
  if (rows.length < 3) return [];
  const headers = rows[0].split('|').slice(1, -1).map(h => slug(clean(h)).replace(/-/g, '_'));
  return rows.slice(2).map(r => {
    const cells = r.split('|').slice(1, -1).map(clean);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] || '']));
  });
}
function getH2Blocks(md) {
  const heads = [...md.matchAll(/^##\s+(.+)$/gm)];
  return heads.map((m, i) => ({
    id: slug(m[1]),
    title: m[1].trim(),
    markdown: md.slice(m.index, heads[i + 1]?.index ?? md.length).trim(),
  }));
}
function getH3Sections(block) {
  const body = removeMainHeading(block, 2);
  const heads = [...body.matchAll(/^###\s+(.+)$/gm)];
  if (!heads.length) return [];
  return heads.map((m, i) => {
    const markdown = body.slice(m.index, heads[i + 1]?.index ?? body.length).trim();
    const sectionTitle = m[1].trim();
    const sectionBody = removeMainHeading(markdown, 3);
    return {
      id: slug(sectionTitle),
      title: sectionTitle,
      markdown: sectionBody,
      excerpt: stripMd(paragraphs(sectionBody)[0] || sectionBody),
      bullets: bullets(sectionBody),
    };
  });
}
function extractLoreBook(md) {
  const chapters = getH2Blocks(md).map((b, index) => {
    const body = removeMainHeading(b.markdown, 2);
    const ps = paragraphs(body);
    return {
      id: b.id,
      order: index + 1,
      title: b.title,
      category: b.title.startsWith('Appendix') ? 'Appendix' : b.title.includes('Pirate Kings') ? 'Characters' : b.title.includes('Dragon') ? 'Dragons' : b.title.includes('Lore') || b.title.includes('Crown') || b.title.includes('Barrow') || b.title.includes('Aurelion') || b.title.includes('Rumours') || b.title.includes('Questline') ? 'Myth' : 'World',
      excerpt: stripMd(ps[0] || body),
      markdown: body,
      sections: getH3Sections(b.markdown),
    };
  });
  return {
    title: 'The Shattered Seas Lorebook',
    subtitle: 'A readable sourcebook generated from LORE.md for the pitch deck',
    chapters,
  };
}
function extractWorld(md) {
  const block = h2(md, /^The World:/);
  return { title: title(block).replace(/^The World:\s*/, ''), body: paragraphs(block).join('\n\n'), rumours: bullets(block) };
}
function extractStory(md) {
  const res = [
    /^Story \/ Lore:/,
    /^The Atlantean Hunger$/,
    /^Admiral Barrow's Betrayal$/,
    /^Jasper Barrow and the False Treason$/,
    /^Aurelion's Dive$/,
    /^The Crown Below Ritual$/,
    /^Jasper's Binding$/,
    /^The Crown Below: The Wound That Still Pulses$/,
    /^Public Rumours vs\. Hidden Truth$/,
  ];
  const sections = res.map(re => h2(md, re)).filter(Boolean).map(block => ({
    id: slug(title(block)),
    title: title(block),
    summary: stripMd(paragraphs(removeMainHeading(block, 2))[0] || ''),
    markdown: removeMainHeading(block, 2),
    body: removeMainHeading(block, 2),
    sections: getH3Sections(block),
  }));
  const publicBlock = h2(md, /^Public Rumours vs\. Hidden Truth$/);
  const rumours = bullets(h3(publicBlock, /^Common Sailor Rumours$/));
  const beatTitles = new Set([
    'Story / Lore: The Sundering of the Three Crowns',
    'The Atlantean Hunger',
    "Admiral Barrow's Betrayal",
    'Jasper Barrow and the False Treason',
    "Aurelion's Dive",
    'The Crown Below Ritual',
    "Jasper's Binding",
  ]);
  return {
    title: 'The Sundering of the Three Crowns',
    subtitle: 'The hidden truth beneath every rumour in the Shattered Seas',
    sections,
    beats: sections.filter(s => beatTitles.has(s.title)).map(s => ({
      id: s.id,
      title: s.title.replace(/^Story \/ Lore:\s*/, ''),
      summary: s.summary,
    })),
    rumours,
  };
}
function extractDragons(md) {
  const block = h2(md, /^Dragons:/);
  return {
    title: title(block),
    body: paragraphs(block).join('\n\n'),
    known: table(h3(block, /^Known Dragons/)).map(r => ({ name: r.dragon || '', breed: r.breed_trait || '', whereFound: r.where_found || '' })),
  };
}
function inferId(name) {
  const s = slug(name);
  if (s.includes('jasper')) return 'jasper';
  if (s.includes('mordekai')) return 'mordekai';
  if (s.includes('adara')) return 'adara';
  if (s.includes('nimue')) return 'nimue';
  return 'ebon';
}
function extractKings(md) {
  const block = h2(md, /^The Five Pirate Kings$/);
  return block.split(/(?=^###\s+\d+\.\s+)/m).filter(b => /^###\s+\d+\.\s+/.test(b)).map(b => {
    const m = b.match(/^###\s+(\d+)\.\s+(.+?)\s+—\s+(.+)$/m);
    if (!m) throw new Error('Could not parse Pirate King heading.');
    const [, order, name, kingTitle] = m;
    const id = inferId(name);
    const [fallbackImage, fallbackFamiliar] = IMAGE_FALLBACKS[id] || ['', ''];
    const dragons = bodyAfterField(b, 'Dragons', ['Relationship to the Player', 'Familiar']);
    const explicitStance = clean(field(b, 'Dragon Stance')).toLowerCase();
    const stance = explicitStance || (/does\s+(\*\*)?not(\*\*)?\s+hunt|protects dragons/i.test(dragons) ? 'protects' : 'hunts');
    const familiar = b.match(/^\*\*Familiar:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)\s*$/m);
    const domain = b.match(/^\*\*Domain:\*\*\s*\*([^*]+)\*\s*—\s*(.+?)\s*$/m);
    return {
      id,
      order: Number(order),
      name: name.trim(),
      title: kingTitle.trim(),
      image: field(b, 'Image') || fallbackImage,
      theme: field(b, 'Theme'),
      alignment: field(b, 'Alignment'),
      status: field(b, 'Status'),
      mythicRole: field(b, 'Mythic Role'),
      dragonStance: stance,
      backstory: bodyAfterHeading(b, 'Backstory', ['Dragons']),
      dragons,
      relationshipToPlayer: bodyAfterHeading(b, 'Relationship to the Player', ['Familiar']),
      familiar: {
        name: familiar?.[1]?.trim() || '',
        type: familiar?.[2]?.trim() || '',
        image: field(b, 'Familiar Image') || fallbackFamiliar,
        abilities: listAfter(b, /^\*\*Familiar:\*\*/m, /^\*\*Domain:/m),
      },
      domain: {
        name: domain?.[1]?.trim() || '',
        desc: domain?.[2]?.trim() || '',
        effects: listAfter(b, /^\*\*Domain:\*\*/m, /^\*\*Player Hooks/m),
      },
      playerHooks: listAfter(b, /^\*\*Player Hooks\*\*/m, /^---|^##|^###/m),
    };
  });
}
function extractArchipelago(md) {
  const block = h2(md, /^The Archipelago/);
  return { title: title(block), body: paragraphs(block).join('\n\n'), routeModifiers: bullets(h3(block, /^The Outer Seas$/)) };
}
function extractTone(md) {
  const block = h2(md, /^Tone & Narrative Beats$/);
  return { title: title(block), body: paragraphs(block).join('\n\n'), sections: getH3Sections(block) };
}
function extractReveal(md) {
  const block = h2(md, /^Player-Facing Lore Reveal Structure$/);
  return { title: title(block), body: paragraphs(block).join('\n\n'), layers: getH3Sections(block) };
}
function extractQuestline(md) {
  const block = h2(md, /^Suggested Jasper Questline$/);
  return { title: title(block), quests: getH3Sections(block).map((q, i) => ({ ...q, number: i + 1 })) };
}
function extractDomains(md) {
  return table(h2(md, /^Appendix: Domain Map/)).map(r => ({
    domain: r.domain || '',
    king: r.king || '',
    watersHazards: r.waters_hazards || '',
    dragonStance: r.dragon_stance || '',
    mythicFunction: r.mythic_function || '',
  }));
}
function extractTerms(md) {
  return table(h2(md, /^Appendix: Key Terms/)).map(r => ({ term: r.term || '', meaning: r.meaning || '' }));
}
function extractInternalTruth(md) {
  const block = h2(md, /^Appendix: Internal Truth Summary$/);
  return { title: title(block), body: removeMainHeading(block, 2) };
}
function validate(lore) {
  const errors = [];
  if (lore.pirateKings.length !== 5) errors.push(`Expected 5 Pirate Kings, found ${lore.pirateKings.length}.`);
  if (lore.storyLore.beats.length < 5) errors.push(`Expected at least 5 story beats, found ${lore.storyLore.beats.length}.`);
  if (lore.loreBook.chapters.length < 10) errors.push(`Expected at least 10 lorebook chapters, found ${lore.loreBook.chapters.length}.`);
  if (!lore.reveal.layers.length) errors.push('Expected player-facing reveal layers.');
  if (!lore.jasperQuestline.quests.length) errors.push('Expected Jasper questline entries.');
  for (const k of lore.pirateKings) {
    if (!['protects', 'hunts', 'neutral'].includes(k.dragonStance)) errors.push(`${k.name} has invalid Dragon Stance: ${k.dragonStance}`);
    for (const key of ['name', 'title', 'image', 'theme', 'alignment', 'backstory', 'dragons']) if (!k[key]) errors.push(`${k.name || k.id} missing ${key}.`);
    if (!k.familiar.name || !k.domain.name) errors.push(`${k.name} missing familiar or domain data.`);
  }
  if (errors.length) throw new Error(`Lore validation failed:\n- ${errors.join('\n- ')}`);
}

const md = readFileSync(lorePath, 'utf-8').replace(/\r\n?/g, '\n');
const lore = {
  meta: {
    title: h1(md),
    tagline: quote(md),
    source: 'LORE.md',
    generatedAt: new Date().toISOString(),
  },
  world: extractWorld(md),
  storyLore: extractStory(md),
  loreBook: extractLoreBook(md),
  dragons: extractDragons(md),
  pirateKings: extractKings(md),
  archipelago: extractArchipelago(md),
  tone: extractTone(md),
  reveal: extractReveal(md),
  jasperQuestline: extractQuestline(md),
  domains: extractDomains(md),
  keyTerms: extractTerms(md),
  internalTruth: extractInternalTruth(md),
};
validate(lore);

for (const dir of outputDirs) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'lore.json'), JSON.stringify(lore, null, 2), 'utf-8');
  writeFileSync(join(dir, 'pirate-kings-lore.json'), JSON.stringify(lore.pirateKings, null, 2), 'utf-8');
  console.log(`Wrote ${dir}`);
}

function injectLoreDataIntoHtml(htmlPath, label) {
  if (!htmlPath || !existsSync(htmlPath)) return;
  const html = readFileSync(htmlPath, 'utf-8');
  const inline = `<script>window.LORE_DATA=${JSON.stringify(lore)};window.PIRATE_KINGS_LORE=window.LORE_DATA.pirateKings;</script>`;
  const patterns = [
    /<!--\s*LORE_DATA\s*-->/,
    /<!--\s*PIRATE_KINGS_LORE_DATA\s*-->/,
    /<script>window\.LORE_DATA=[\s\S]*?window\.PIRATE_KINGS_LORE=window\.LORE_DATA\.pirateKings;<\/script>/,
    /<script>window\.PIRATE_KINGS_LORE=[\s\S]*?<\/script>/,
  ];
  const p = patterns.find(re => re.test(html));
  if (!p) throw new Error(`No lore data placeholder or existing lore data script found in ${label}. Add <!-- LORE_DATA --> before the rendering script.`);
  writeFileSync(htmlPath, html.replace(p, inline), 'utf-8');
  console.log(`Injected lore data into ${htmlPath}`);
}

if (existsSync(presentationPath)) injectLoreDataIntoHtml(presentationPath, 'index.html');
if (lorebookPath) injectLoreDataIntoHtml(lorebookPath, 'LOREBOOK.html');
else console.warn('LOREBOOK.html not found; skipping standalone lorebook injection.');

console.log(`Extracted ${lore.pirateKings.length} Pirate Kings, ${lore.storyLore.beats.length} story beats, ${lore.loreBook.chapters.length} lorebook chapters, ${lore.reveal.layers.length} reveal layers, and ${lore.jasperQuestline.quests.length} Jasper quests.`);
