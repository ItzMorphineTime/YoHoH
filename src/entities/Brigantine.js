/**
 * YoHoH — Brigantine: medium ship
 * Two slots for gunners, sailing, bilge, man_at_arms
 */

import { Ship } from './Ship.js';
import { SHIP_CLASSES } from '../config.js';

export class Brigantine extends Ship {
  static getClassConfig() {
    return SHIP_CLASSES?.brigantine ?? null;
  }

  static get shipClassId() {
    return 'brigantine';
  }

  constructor(opts = {}) {
    super({
      ...opts,
      _classConfig: Brigantine.getClassConfig(),
      shipClassId: 'brigantine',
    });
  }
}
