/**
 * YoHoH — Centralized render config with fallbacks
 * Single source of truth for per-view rendering options.
 * Used by Renderer, BigMapUI, Minimap to avoid scattered literals.
 */

import {
  CAMERA,
  COMBAT,
  OVERWORLD,
  OVERWORLD_RENDER,
  RENDER,
  SAILING_RENDER,
} from '../config.js';

/** Combat view config (arena, water, ships, projectiles, rocks, cannon arcs) */
export function getCombatRenderConfig() {
  return {
    camera: {
      zoom: CAMERA.combatZoom ?? CAMERA.zoom,
      positionZ: CAMERA.positionZ,
    },
    water: {
      sizeMin: RENDER.waterPlaneSizeMin ?? 800,
      color: RENDER.waterColor,
    },
    arena: {
      width: COMBAT.arenaWidth,
      height: COMBAT.arenaHeight,
      borderColor: RENDER.arenaBorderColor,
      borderZ: RENDER.arenaBorderZ,
    },
    ship: {
      hullColor: RENDER.shipHullColor,
      mastColor: RENDER.shipMastColor,
      sailColor: RENDER.shipSailColor,
    },
    cannon: {
      range: COMBAT.cannonRange,
      arcDeg: COMBAT.cannonArcDeg,
      portColor: RENDER.portArcColor,
      starboardColor: RENDER.starboardArcColor,
      opacity: RENDER.cannonArcOpacity,
      z: RENDER.cannonArcZ,
      segments: RENDER.cannonArcSegments,
      aimArrowSize: RENDER.aimArrowSize,
      aimArrowOpacity: RENDER.aimArrowOpacity,
      aimArrowLengthMult: RENDER.aimArrowLengthMult,
    },
    enemy: {
      hullColor: RENDER.enemyHullColor,
      mastColor: RENDER.enemyMastColor,
      sailColor: RENDER.enemySailColor,
    },
    projectile: { color: RENDER.projectileColor },
    rock: { color: RENDER.rockColor, segments: RENDER.rockSegments },
  };
}

/** Overworld view config (map, islands, routes, ship) */
export function getOverworldRenderConfig() {
  return {
    worldScale: OVERWORLD_RENDER.worldScale,
    islandRadius: OVERWORLD_RENDER.islandRadius,
    routeWidth: OVERWORLD_RENDER.routeWidth,
    ship: {
      radius: RENDER.overworldShipRadius,
      height: RENDER.overworldShipHeight,
      segments: RENDER.overworldShipSegments,
      color: RENDER.shipOverworldColor,
    },
    island: {
      homeColor: RENDER.islandHomeColor,
      dangerColor: RENDER.islandDangerColor,
      appealColor: RENDER.islandAppealColor,
      defaultColor: RENDER.islandDefaultColor,
      currentColor: RENDER.islandCurrentColor ?? 0xffcc44,
      currentRadiusMult: RENDER.islandCurrentRadiusMult ?? 1.4,
      currentRingColor: RENDER.islandCurrentRingColor ?? 0xffdd66,
      currentRingWidth: RENDER.islandCurrentRingWidth ?? 3,
    },
    route: {
      color: RENDER.routeColor,
      hoverColor: RENDER.routeHoverColor,
      hoverWidthMult: RENDER.routeHoverWidthMult ?? 1.3,
      selectedColor: RENDER.routeSelectedColor ?? RENDER.sailingDestColor ?? 0x7bdc9a,
      selectedWidthMult: RENDER.routeSelectedWidthMult ?? 2.5,
      outlineColor: RENDER.routeSelectedOutlineColor ?? 0xffffff,
      outlineWidth: RENDER.routeSelectedOutlineWidth ?? 2, // 0 = no outline
    },
    camera: {
      overworldZoom: CAMERA.overworldZoom ?? 0.25,
      positionZ: CAMERA.positionZ,
    },
  };
}

/** Sailing view config (corridor, water, islands, ship) */
export function getSailingRenderConfig() {
  const worldScale = OVERWORLD_RENDER.worldScale;
  const corridorWidth = SAILING_RENDER?.corridorWidth ?? OVERWORLD_RENDER.sailingCorridorWidth;
  const islandRadius = SAILING_RENDER?.islandRadius ?? (worldScale * (OVERWORLD?.islandRadius ?? 32));

  return {
    worldScale,
    corridorWidth,
    corridorWidthWorld: corridorWidth * worldScale,
    islandRadius,
    water: {
      planeScale: SAILING_RENDER?.waterPlaneScale ?? RENDER.sailingWaterPlaneScale ?? 4,
      gradient: SAILING_RENDER?.waterGradient ?? RENDER.sailingWaterGradient ?? true,
    },
    corridor: {
      color: SAILING_RENDER?.corridorColor ?? RENDER.sailingCorridorColor ?? 0x2a4a6a,
      opacity: SAILING_RENDER?.corridorOpacity ?? RENDER.sailingCorridorOpacity ?? 0.35,
    },
    destMarker: {
      radius: SAILING_RENDER?.destMarkerRadius ?? RENDER.sailingDestRadius,
      opacity: SAILING_RENDER?.destMarkerOpacity ?? RENDER.sailingDestOpacity,
      color: RENDER.sailingDestColor,
    },
    pathRefLength: RENDER.sailingPathRefLength,
    ship: {
      radius: RENDER.sailingShipRadius,
      height: RENDER.sailingShipHeight,
      segments: RENDER.sailingShipSegments,
      color: RENDER.shipOverworldColor,
    },
    camera: {
      zoom: CAMERA.sailingZoom,
      positionZ: CAMERA.positionZ,
    },
  };
}
