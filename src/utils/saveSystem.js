/**
 * YoHoH — Save system (D.9, D.9a)
 * Persists game state to localStorage: ship, crew, islands, gold, infamy, etc.
 *
 * Schema versioning (Improvements.md §4.1):
 * - Every save carries `schemaVersion` (and legacy alias `version`).
 * - Loaders accept either field; bump SCHEMA_VERSION when state shape changes.
 * - Failure paths log diagnostics so corrupt saves do not silently degrade
 *   to "no save". `loadWithStatus()` returns a `{ status, state }` pair for
 *   callers that want to differentiate cases (e.g. show a toast).
 */

import { log } from './Logger.js';

const SAVE_KEY = 'yohoh-save';
/** Bump this on incompatible state-shape changes. */
export const SCHEMA_VERSION = 1;
/** @deprecated kept for backward-compat with older code that imported SAVE_VERSION */
export const SAVE_VERSION = SCHEMA_VERSION;

/** Load status codes for loadWithStatus(). */
export const LOAD_STATUS = Object.freeze({
  OK: 'ok',
  NONE: 'none',                 // no save in storage
  PARSE_ERROR: 'parse-error',   // JSON.parse threw — corrupt save
  VERSION_MISMATCH: 'version-mismatch', // schema version unknown
  STORAGE_UNAVAILABLE: 'storage-unavailable', // localStorage threw
});

/**
 * Serialize game state for persistence.
 * @param {Object} state - Game state from Game.getSaveState()
 * @returns {string} JSON string
 */
export function serializeSave(state) {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    version: SCHEMA_VERSION, // legacy alias
    savedAt: Date.now(),
    ...state,
  });
}

/** Extract the schema version from a parsed save object, tolerating the legacy `version` key. */
function readSchemaVersion(data) {
  if (data == null || typeof data !== 'object') return null;
  return data.schemaVersion ?? data.version ?? null;
}

/**
 * Deserialize save from JSON. Returns null if invalid; logs a warning on failure.
 * For richer failure info use loadWithStatus().
 * @param {string} json - JSON string from localStorage
 * @returns {Object|null} Parsed state or null
 */
export function deserializeSave(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch (err) {
    log.warn('save', 'Failed to parse save JSON', err);
    return null;
  }
  const v = readSchemaVersion(data);
  if (v !== SCHEMA_VERSION) {
    log.warn('save', `Save schema version mismatch (got ${v}, expected ${SCHEMA_VERSION}); ignoring save.`);
    return null;
  }
  return data;
}

/**
 * Save game state to localStorage.
 * @param {Object} state - From Game.getSaveState()
 * @returns {boolean} Success
 */
export function saveToStorage(state) {
  try {
    const json = serializeSave(state);
    localStorage.setItem(SAVE_KEY, json);
    return true;
  } catch (err) {
    // Common causes: private-browsing, quota exceeded.
    log.warn('save', 'saveToStorage failed', err);
    return false;
  }
}

/**
 * Load game state from localStorage.
 * @returns {Object|null} Parsed state or null if none/invalid
 */
export function loadFromStorage() {
  return loadWithStatus().state;
}

/**
 * Load and report status so callers can distinguish corrupt vs missing saves.
 * @returns {{ status: string, state: Object|null }}
 */
export function loadWithStatus() {
  let json;
  try {
    json = localStorage.getItem(SAVE_KEY);
  } catch (err) {
    log.warn('save', 'localStorage unavailable', err);
    return { status: LOAD_STATUS.STORAGE_UNAVAILABLE, state: null };
  }
  if (!json) return { status: LOAD_STATUS.NONE, state: null };

  let data;
  try {
    data = JSON.parse(json);
  } catch (err) {
    log.warn('save', 'Failed to parse save JSON', err);
    return { status: LOAD_STATUS.PARSE_ERROR, state: null };
  }
  const v = readSchemaVersion(data);
  if (v !== SCHEMA_VERSION) {
    log.warn('save', `Save schema version mismatch (got ${v}, expected ${SCHEMA_VERSION}).`);
    return { status: LOAD_STATUS.VERSION_MISMATCH, state: null };
  }
  return { status: LOAD_STATUS.OK, state: data };
}

/**
 * Check if a valid save exists.
 * @returns {boolean}
 */
export function hasSave() {
  return loadWithStatus().status === LOAD_STATUS.OK;
}

/**
 * Delete save from localStorage.
 */
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    log.warn('save', 'deleteSave failed', err);
  }
}
