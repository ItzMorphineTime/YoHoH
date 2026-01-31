/**
 * YoHoH — Save system (D.9, D.9a)
 * Persists game state to localStorage: ship, crew, islands, gold, infamy, etc.
 */

const SAVE_KEY = 'yohoh-save';
const SAVE_VERSION = 1;

/**
 * Serialize game state for persistence.
 * @param {Object} state - Game state from Game.getSaveState()
 * @returns {string} JSON string
 */
export function serializeSave(state) {
  return JSON.stringify({
    version: SAVE_VERSION,
    savedAt: Date.now(),
    ...state,
  });
}

/**
 * Deserialize save from JSON. Returns null if invalid.
 * @param {string} json - JSON string from localStorage
 * @returns {Object|null} Parsed state or null
 */
export function deserializeSave(json) {
  try {
    const data = JSON.parse(json);
    if (data.version !== SAVE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
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
  } catch {
    return false;
  }
}

/**
 * Load game state from localStorage.
 * @returns {Object|null} Parsed state or null if none/invalid
 */
export function loadFromStorage() {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    return deserializeSave(json);
  } catch {
    return null;
  }
}

/**
 * Check if a valid save exists.
 * @returns {boolean}
 */
export function hasSave() {
  return loadFromStorage() != null;
}

/**
 * Delete save from localStorage.
 */
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
