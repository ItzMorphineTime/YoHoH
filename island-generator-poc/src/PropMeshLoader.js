/**
 * Load and cache FBX prop meshes from 3D_Models/Props
 * Falls back to placeholder geometry if FBX load fails
 */

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { getPropType } from './PropTypes.js';

const loader = new FBXLoader();
const cache = new Map(); // type -> THREE.Group
const loadPromises = new Map(); // type -> Promise

function createPlaceholder(def, scale = 0.08) {
  const color = def?.color ?? 0x888888;
  const material = new THREE.MeshLambertMaterial({ color });

  // Sign: vertical post + board, sized to fill 1 tile (max dim 1.0)
  if (def?.placeholderShape === 'signpost' || def?.id === 'sign') {
    const group = new THREE.Group();
    const postHeight = 1.0; // fills 1 tile vertically
    const postRadius = 0.04;
    const postGeom = new THREE.CylinderGeometry(postRadius, postRadius * 1.1, postHeight, 8);
    const post = new THREE.Mesh(postGeom, material);
    post.position.y = postHeight / 2; // base at origin
    group.add(post);

    const boardW = 0.5;
    const boardH = 0.25;
    const boardThick = 0.04;
    const boardGeom = new THREE.BoxGeometry(boardW, boardThick, boardH);
    const board = new THREE.Mesh(boardGeom, material);
    board.position.y = postHeight + boardThick / 2;
    group.add(board);

    // Rotate to match island Z-up (placeholder uses Y-up); +90° so sign stands right-side up
    group.rotation.x = Math.PI / 2;
    return group;
  }

  // Other placeholders: max dimension 1.0, base at origin
  let geometry;
  let mesh;
  const s = 1.0; // max dim 1.0 for tile fit
  switch (def?.placeholderShape ?? 'sphere') {
    case 'sphere':
      geometry = new THREE.SphereGeometry(s / 2, 8, 6);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = s / 2;
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(s * 0.2, s * 0.25, s, 8);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = s / 2;
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(s * 0.3, s, 8);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = s / 2;
      break;
    case 'box':
      geometry = new THREE.BoxGeometry(s * 0.2, s, s * 0.1);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = s / 2;
      break;
    default:
      geometry = new THREE.SphereGeometry(s / 2, 8, 6);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = s / 2;
  }
  const group = new THREE.Group();
  group.add(mesh);
  group.rotation.x = -Math.PI / 2; // Y-up → Z-up for island
  return group;
}

function normalizeFbxGroup(group) {
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  // Scale to max dimension 1.0 so renderProps can fit to 1 tile
  const scale = 1.0 / maxDim;
  group.scale.setScalar(scale);
  group.rotation.x = Math.PI / 2; // FBX Y-up → our Z-up; +90° so props stand right-side up
  // Wrap in parent so base offset is preserved when renderProps sets position.
  // Island uses Z for height; FBX Y-up becomes Z after rotation, so offset in Z.
  const wrapper = new THREE.Group();
  wrapper.add(group);
  group.position.z = -box.min.y * scale; // base at wrapper origin (Z = up in island)
  return wrapper;
}

/**
 * Load FBX for a prop type. Returns cached or loads. Resolves to THREE.Object3D (cloneable).
 * @param {string} type - Prop type id (e.g. rock_01)
 * @returns {Promise<THREE.Object3D>}
 */
export function loadPropMesh(type) {
  if (cache.has(type)) {
    return Promise.resolve(cache.get(type));
  }
  if (loadPromises.has(type)) {
    return loadPromises.get(type);
  }
  const def = getPropType(type);
  if (!def?.fbxPath) {
    const placeholder = createPlaceholder(def);
    cache.set(type, placeholder);
    return Promise.resolve(placeholder);
  }
  const promise = new Promise((resolve) => {
    loader.load(
      def.fbxPath,
      (group) => {
        const normalized = normalizeFbxGroup(group);
        cache.set(type, normalized);
        resolve(normalized);
      },
      undefined,
      () => {
        const placeholder = createPlaceholder(def);
        cache.set(type, placeholder);
        resolve(placeholder);
      }
    );
  });
  loadPromises.set(type, promise);
  return promise;
}

/**
 * Get a clone of the prop mesh for the given type. Sync if cached, else returns placeholder.
 * @param {string} type
 * @returns {THREE.Object3D}
 */
export function getPropMeshClone(type) {
  const def = getPropType(type);
  const cached = cache.get(type);
  if (cached) {
    const clone = cached.clone(true);
    clone.userData.fromPropCache = true;
    clone.traverse((c) => {
      if (c.isMesh && c.material) {
        c.material = c.material.clone();
      }
    });
    return clone;
  }
  const placeholder = createPlaceholder(def);
  placeholder.userData.fromPropCache = false;
  return placeholder;
}
