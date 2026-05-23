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
const storybookPath = existsSync(join(root, 'docs', 'STORYBOOK.html'))
  ? join(root, 'docs', 'STORYBOOK.html')
  : existsSync(join(root, 'STORYBOOK.html'))
    ? join(root, 'STORYBOOK.html')
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
/**
 * Lore_Presentation_Improvements §1.8: derive chapter category from an
 * explicit map keyed by the chapter title. Previously a long keyword-soup
 * `includes()` chain miscategorised the new Ages chapters as "World" / "Myth"
 * without distinction. The new map keeps the obvious matches and adds a
 * dedicated "Ages" bucket for the four Age chapters + the Cataclysm /
 * Collapse bridges, so the Lorebook chapter grid can sort + colour them
 * coherently.
 */
const LOREBOOK_CATEGORY_MAP = {
  // World / setting
  'The World: The Shattered Seas': 'World',
  'The Archipelago & Your Place in It': 'World',
  // Ages framework
  'The Second Age: The Age of the Drowned Crown': 'Ages',
  'The Corruption of the Deep': 'Ages',
  'The Unbinding Tide': 'Ages',
  'The Third Age: The Age of Free Sails': 'Ages',
  'The Current Age: The Age of Five Crowns': 'Ages',
  // Myth (the original Sundering arc)
  'Story / Lore: The Sundering of the Three Crowns': 'Myth',
  'The Atlantean Hunger': 'Myth',
  "Admiral Barrow's Betrayal": 'Myth',
  'Jasper Barrow and the False Treason': 'Myth',
  "Aurelion's Dive": 'Myth',
  'The Crown Below Ritual': 'Myth',
  "Jasper's Binding": 'Myth',
  'The Crown Below: The Wound That Still Pulses': 'Myth',
  // Characters
  "Ebon's Glory and the Ashen Turn": 'Characters',
  'The Five Pirate Kings': 'Characters',
  // Dragons
  'Dragons: The Last of the Great Beasts': 'Dragons',
  // Reveal / questlines / tone — discovery layer
  'Public Rumours vs. Hidden Truth': 'Reveal',
  'Tone & Narrative Beats': 'Reveal',
  'Player-Facing Lore Reveal Structure': 'Reveal',
  'Suggested Jasper Questline': 'Reveal',
  'Suggested Historical Reveal Questline: The Ages of the Sea': 'Reveal',
};

function categoriseChapter(title) {
  if (LOREBOOK_CATEGORY_MAP[title]) return LOREBOOK_CATEGORY_MAP[title];
  if (title.startsWith('Appendix')) return 'Appendix';
  // Conservative fallback so a future LORE.md edit doesn't silently land
  // unrecognised chapters in "Myth" — surface them as "World" and let the
  // closing summary log warn about uncategorised titles.
  return 'World';
}

function extractLoreBook(md) {
  const chapters = getH2Blocks(md).map((b, index) => {
    const body = removeMainHeading(b.markdown, 2);
    const ps = paragraphs(body);
    return {
      id: b.id,
      order: index + 1,
      title: b.title,
      category: categoriseChapter(b.title),
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
  // Lore_Presentation_Improvements §1.6: preserve the Ages-of-the-World table
  // verbatim so the Lorebook can render it, and split the prose around it so
  // the existing `body` no longer has a blank gap where the table used to be.
  // The table is identified by the headers `Age | Common Name | Dominant Power | What It Means`.
  const bodyRaw = removeMainHeading(block, 2);
  const tableLines = bodyRaw.split('\n').filter(l => /^\|/.test(l));
  const agesTableMd = tableLines.join('\n');
  // Strip the table from the body but preserve the surrounding prose.
  const bodyNoTable = bodyRaw.split('\n').filter(l => !/^\|/.test(l)).join('\n');
  return {
    title: title(block).replace(/^The World:\s*/, ''),
    body: paragraphs(bodyNoTable).join('\n\n'),
    rumours: bullets(block),
    agesTable: agesTableMd, // raw markdown — useful for Lorebook fidelity rendering
  };
}

/**
 * Lore_Presentation_Improvements §1.6: extract the Ages-of-the-World table
 * from `## The World:` as a first-class structured array. The Ages framework
 * is the spine of the expanded lore — surfacing it as `lore.ages` lets every
 * downstream view (overview slide, Age ribbon, king "historical wound" badge)
 * reuse the same data.
 *
 * Returns: [{ age, label, power, summary, key }, ...]
 */
function extractAges(md) {
  const block = h2(md, /^The World:/);
  const rows = table(block);
  if (!rows.length) return [];
  // §1.6 + §2.1 + §2.9: `key` is the full slug (kept for back-compat);
  // `shortKey` matches the beat-ageKey scheme used by `beatAgeMap` so the
  // presentation can use one consistent palette class for both ribbon and beats.
  const SHORT_KEY_MAP = {
    'first-age': 'first',
    'cataclysm': 'cataclysm',
    'second-age': 'second',
    'collapse-event': 'collapse',
    'third-age': 'third',
    'current-age': 'current',
  };
  return rows.map(r => {
    const ageRaw = r.age || '';
    const key = slug(clean(ageRaw));
    return {
      age: clean(ageRaw),
      label: r.common_name || '',
      power: r.dominant_power || '',
      summary: r.what_it_means || '',
      key,
      shortKey: SHORT_KEY_MAP[key] || key,
    };
  });
}
function extractStory(md) {
  // Lore_Presentation_Improvements §1.1: regex list expanded to cover the
  // full Four-Age epic — Sundering, Drowned Crown era, Unbinding Tide collapse,
  // Free Sails era, and Current Age. The previous list stopped at Jasper's
  // Binding, so 90% of the post-Cataclysm history was invisible to the deck.
  const res = [
    /^Story \/ Lore:/,
    /^The Atlantean Hunger$/,
    /^Admiral Barrow's Betrayal$/,
    /^Jasper Barrow and the False Treason$/,
    /^Aurelion's Dive$/,
    /^The Crown Below Ritual$/,
    /^Jasper's Binding$/,
    /^The Crown Below: The Wound That Still Pulses$/,
    /^The Second Age: The Age of the Drowned Crown$/,
    /^The Corruption of the Deep$/,
    /^The Unbinding Tide$/,
    /^The Third Age: The Age of Free Sails$/,
    /^Ebon's Glory and the Ashen Turn$/,
    /^The Current Age: The Age of Five Crowns$/,
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
  // Beat titles now cover all four Ages so the "Mythic Timeline" slide can
  // become a multi-Age epic instead of a First-Age summary.
  const beatTitles = new Set([
    'Story / Lore: The Sundering of the Three Crowns',
    'The Atlantean Hunger',
    "Admiral Barrow's Betrayal",
    'Jasper Barrow and the False Treason',
    "Aurelion's Dive",
    'The Crown Below Ritual',
    "Jasper's Binding",
    'The Second Age: The Age of the Drowned Crown',
    'The Corruption of the Deep',
    'The Unbinding Tide',
    'The Third Age: The Age of Free Sails',
    "Ebon's Glory and the Ashen Turn",
    'The Current Age: The Age of Five Crowns',
  ]);
  // Tag each beat with its Age key so the renderer can group / colour them.
  const beatAgeMap = {
    'Story / Lore: The Sundering of the Three Crowns': 'first',
    'The Atlantean Hunger': 'first',
    "Admiral Barrow's Betrayal": 'first',
    'Jasper Barrow and the False Treason': 'first',
    "Aurelion's Dive": 'cataclysm',
    'The Crown Below Ritual': 'cataclysm',
    "Jasper's Binding": 'cataclysm',
    'The Second Age: The Age of the Drowned Crown': 'second',
    'The Corruption of the Deep': 'second',
    'The Unbinding Tide': 'collapse',
    'The Third Age: The Age of Free Sails': 'third',
    "Ebon's Glory and the Ashen Turn": 'third',
    'The Current Age: The Age of Five Crowns': 'current',
  };
  return {
    title: 'The Sundering of the Three Crowns',
    subtitle: 'The hidden truth beneath every rumour in the Shattered Seas',
    sections,
    beats: sections.filter(s => beatTitles.has(s.title)).map(s => ({
      id: s.id,
      title: s.title.replace(/^Story \/ Lore:\s*/, ''),
      summary: s.summary,
      ageKey: beatAgeMap[s.title] || 'first',
    })),
    rumours,
  };
}
function extractDragons(md) {
  const block = h2(md, /^Dragons:/);
  // Lore_Presentation_Improvements §1.7: capture the "Why Dragons Matter"
  // bullets separately — `paragraphs()` strips bullet lines so they were
  // silently dropped from `body`. Each bullet describes a breed's mythic role
  // and is genuinely useful to the deck's Dragons slide.
  return {
    title: title(block),
    body: paragraphs(block).join('\n\n'),
    matters: bullets(h3(block, /^Why Dragons Matter$/)),
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

/**
 * Lore_Presentation_Improvements §1.2: the historical reveal questline added
 * with the Ages expansion. Parallel to the Jasper questline — the deck's
 * "Two Reveal Paths" slide renders them side-by-side.
 */
function extractHistoricalQuestline(md) {
  const block = h2(md, /^Suggested Historical Reveal Questline: The Ages of the Sea$/);
  return {
    title: title(block),
    quests: getH3Sections(block).map((q, i) => ({ ...q, number: i + 1 })),
  };
}

/**
 * Lore_Presentation_Improvements §1.3: the era / event / notes table from
 * `## Appendix: Historical Timeline`. Feeds the Ages overview slide and the
 * Lorebook timeline page.
 */
function extractHistoricalTimeline(md) {
  return table(h2(md, /^Appendix: Historical Timeline$/)).map(r => ({
    era: r.era || '',
    event: r.event || '',
    notes: r.notes || '',
  }));
}

/**
 * Lore_Presentation_Improvements §1.4: the 9-faction matrix from
 * `## Appendix: Faction Interpretations of History`. Powers the
 * "Whose Story Will You Believe?" deck slide.
 */
function extractFactionInterpretations(md) {
  return table(h2(md, /^Appendix: Faction Interpretations of History$/)).map(r => ({
    faction: r.faction || '',
    description: r.how_they_describe_the_ages || '',
  }));
}

/**
 * Lore_Presentation_Improvements §1.5: writer-room TODO appendix. Surfaced
 * in the deck via a hidden `?writer=1` toggle in Phase 3.
 */
function extractFutureHooks(md) {
  const block = h2(md, /^Appendix: Future Story Hooks/);
  return { title: title(block), sections: getH3Sections(block) };
}

/**
 * Lore_Presentation_Improvements §2.5: derive the per-King historical wound
 * from the `## The Current Age` table (`| King | Historical Wound |`). Each
 * King's slide can then display a one-line "I am the consequence of X age"
 * badge, anchoring them in the Age framework instead of presenting them as
 * isolated character cards.
 *
 * Matches against the first name (e.g. "Jasper Barrow" → "Jasper") since
 * the table cell may include or omit the surname.
 */
function attachKingWounds(kings, md) {
  const currentAge = h2(md, /^The Current Age: The Age of Five Crowns$/);
  if (!currentAge) return;
  const rows = table(currentAge);
  if (!rows.length) return;
  // Strip titles like Captain/Lady/Lord/Admiral/Sir so "Captain Mordekai Drakon"
  // collapses to "mordekai" and matches the bare "Mordekai Drakon" in the table.
  const TITLE_RE = /^(captain|lady|lord|admiral|sir|king|queen|dame)\b\s*/i;
  function firstNameKey(s) {
    const cleaned = clean(s || '').replace(TITLE_RE, '');
    return cleaned.split(/\s+/)[0]?.toLowerCase() || '';
  }
  const woundByFirstName = {};
  for (const r of rows) {
    const key = firstNameKey(r.king || '');
    if (key) woundByFirstName[key] = clean(r.historical_wound || '');
  }
  for (const k of kings) {
    const key = firstNameKey(k.name);
    k.historicalWound = woundByFirstName[key] || '';
  }
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
  // Lore_Presentation_Improvements §1.10: assert on the Ages-expansion fields.
  if (!Array.isArray(lore.ages) || lore.ages.length < 4) {
    errors.push(`Expected at least 4 Ages from the World table, found ${lore.ages?.length ?? 0}.`);
  }
  if (!lore.historicalQuestline || !lore.historicalQuestline.quests?.length) {
    errors.push('Expected historical reveal questline ("Ages of the Sea") with quests.');
  }
  if (!Array.isArray(lore.historicalTimeline) || lore.historicalTimeline.length < 5) {
    errors.push(`Expected at least 5 entries in Historical Timeline, found ${lore.historicalTimeline?.length ?? 0}.`);
  }
  if (!Array.isArray(lore.factionInterpretations) || lore.factionInterpretations.length < 5) {
    errors.push(`Expected at least 5 faction interpretations, found ${lore.factionInterpretations?.length ?? 0}.`);
  }
  for (const k of lore.pirateKings) {
    if (!['protects', 'hunts', 'neutral'].includes(k.dragonStance)) errors.push(`${k.name} has invalid Dragon Stance: ${k.dragonStance}`);
    for (const key of ['name', 'title', 'image', 'theme', 'alignment', 'backstory', 'dragons']) if (!k[key]) errors.push(`${k.name || k.id} missing ${key}.`);
    if (!k.familiar.name || !k.domain.name) errors.push(`${k.name} missing familiar or domain data.`);
    if (!k.historicalWound) errors.push(`${k.name} missing historicalWound — check Current Age table mapping.`);
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
  // Lore_Presentation_Improvements §1.6: first-class Ages framework spine.
  ages: extractAges(md),
  storyLore: extractStory(md),
  loreBook: extractLoreBook(md),
  dragons: extractDragons(md),
  pirateKings: extractKings(md),
  archipelago: extractArchipelago(md),
  tone: extractTone(md),
  reveal: extractReveal(md),
  jasperQuestline: extractQuestline(md),
  // Lore_Presentation_Improvements §1.2-§1.5: new Ages-expansion sections.
  historicalQuestline: extractHistoricalQuestline(md),
  historicalTimeline: extractHistoricalTimeline(md),
  factionInterpretations: extractFactionInterpretations(md),
  futureHooks: extractFutureHooks(md),
  domains: extractDomains(md),
  keyTerms: extractTerms(md),
  internalTruth: extractInternalTruth(md),
};
// §2.5: derive each King's historical wound from the Current Age table.
attachKingWounds(lore.pirateKings, md);
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
if (storybookPath) injectLoreDataIntoHtml(storybookPath, 'STORYBOOK.html');
else console.warn('STORYBOOK.html not found; skipping standalone storybook injection.');

// Lore_Presentation_Improvements §1.9: expanded summary so missing extractors
// are visible after every run. Pre-expansion this only mentioned kings /
// beats / chapters / reveal layers / Jasper quests, so additions to LORE.md
// were silent unless a downstream slide broke.
const catCounts = lore.loreBook.chapters.reduce((acc, c) => {
  acc[c.category] = (acc[c.category] ?? 0) + 1;
  return acc;
}, {});
console.log('Extracted:');
console.log(`  ${lore.pirateKings.length} Pirate Kings (with historicalWound: ${lore.pirateKings.filter(k => k.historicalWound).length})`);
console.log(`  ${lore.ages.length} Ages`);
console.log(`  ${lore.storyLore.beats.length} story beats spanning ${new Set(lore.storyLore.beats.map(b => b.ageKey)).size} ages`);
console.log(`  ${lore.loreBook.chapters.length} lorebook chapters by category:`);
for (const [cat, n] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${cat.padEnd(12)} ${n}`);
}
console.log(`  ${lore.reveal.layers.length} reveal layers`);
console.log(`  ${lore.jasperQuestline.quests.length} Jasper quests`);
console.log(`  ${lore.historicalQuestline.quests.length} historical-reveal quests`);
console.log(`  ${lore.historicalTimeline.length} historical-timeline rows`);
console.log(`  ${lore.factionInterpretations.length} faction interpretations`);
console.log(`  ${lore.futureHooks.sections?.length ?? 0} future-hook TODOs`);
console.log(`  ${lore.domains.length} domains, ${lore.keyTerms.length} key terms`);
