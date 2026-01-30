/**
 * YoHoH — Galleon: large warship
 * Three slots for gunners/sailing/bilge, two for carpenter/navigator/man_at_arms
 */

import { Ship } from './Ship.js';
import { SHIP_CLASSES } from '../config.js';

export class Galleon extends Ship {
  static getClassConfig() {
    return SHIP_CLASSES?.galleon ?? null;
  }

  static get shipClassId() {
    return 'galleon';
  }

  constructor(opts = {}) {
    super({
      ...opts,
      _classConfig: Galleon.getClassConfig(),
      shipClassId: 'galleon',
    });
  }
}
