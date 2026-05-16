/**
 * HTML-escape helper for UI string interpolation. (Improvements.md §5.3)
 *
 * Use this around any value that could plausibly become user-editable —
 * island names, crew names, ship names, rumors, descriptions, etc.
 * Config-sourced static labels do not need escaping, but it does no harm.
 *
 * @example
 *   el.innerHTML = `<span>${esc(island.name)}</span>`;
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * @param {*} value Coerced via String(); null/undefined become empty.
 * @returns {string}
 */
export function escapeHtml(value) {
  if (value == null) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] ?? ch);
}

/** Short alias for inline-template use. */
export const esc = escapeHtml;
