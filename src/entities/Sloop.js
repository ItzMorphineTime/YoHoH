/**
 * YoHoH — Sloop: small, agile ship
 * Single slot per station, fast turn rate
 */

import { Ship } from './Ship.js';
import { SHIP_CLASSES } from '../config.js';

export class Sloop extends Ship {
  static getClassConfig() {
    return SHIP_CLASSES?.sloop ?? null;
  }

  static get shipClassId() {
    return 'sloop';
  }

  constructor(opts = {}) {
    super({
      ...opts,
      _classConfig: Sloop.getClassConfig(),
      shipClassId: 'sloop',
    });
  }
}
