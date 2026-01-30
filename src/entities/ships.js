/**
 * YoHoH — Ship class registry and factory
 * Maps ship class ids to constructors for OO instantiation
 */

import { Ship } from './Ship.js';
import { Sloop } from './Sloop.js';
import { Brigantine } from './Brigantine.js';
import { Galleon } from './Galleon.js';

/** Registry: shipClassId -> Ship subclass constructor */
export const SHIP_CLASS_REGISTRY = {
  sloop: Sloop,
  brigantine: Brigantine,
  galleon: Galleon,
};

/** Create a ship instance by class id. Falls back to Sloop if unknown. */
export function createShip(shipClassId, opts = {}) {
  const ShipClass = SHIP_CLASS_REGISTRY[shipClassId] ?? Sloop;
  return new ShipClass(opts);
}

export { Ship, Sloop, Brigantine, Galleon };
