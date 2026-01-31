/**
 * Procedural water shader — animated waves, Fresnel rim, sun specular
 * Lightweight alternative to THREE.Water (no planar reflection)
 */

import * as THREE from 'three';

const WaterShader = {
  uniforms: {
    time: { value: 0 },
    waterColor: { value: new THREE.Color(0x2563eb) },
    sunColor: { value: new THREE.Color(0xffffff) },
    sunDirection: { value: new THREE.Vector3(0.5, 0.7, 0.5).normalize() },
    alpha: { value: 0.85 },
    waveScale: { value: 8 },
    waveHeight: { value: 0.02 },
    fresnelPower: { value: 2.5 },
    specularPower: { value: 64 },
  },

  vertexShader: /* glsl */`
    uniform float time;
    uniform float waveScale;
    uniform float waveHeight;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Procedural wave displacement (sin-based, no texture)
      float wave1 = sin(pos.x * waveScale + time * 2.0) * cos(pos.y * waveScale + time * 1.5);
      float wave2 = sin((pos.x + pos.y) * waveScale * 0.7 + time * 1.8) * 0.5;
      pos.z += (wave1 + wave2) * waveHeight;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;
      vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform float time;
    uniform vec3 waterColor;
    uniform vec3 sunColor;
    uniform vec3 sunDirection;
    uniform float alpha;
    uniform float fresnelPower;
    uniform float specularPower;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 norm = normalize(vNormal);

      // Fresnel — brighter at grazing angle (rim)
      float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), fresnelPower);
      vec3 fresnelColor = mix(waterColor, vec3(1.0, 1.0, 1.0) * 0.4, fresnel * 0.6);

      // Sun specular highlight
      vec3 reflectDir = reflect(-sunDirection, norm);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
      vec3 specular = sunColor * spec * 0.5;

      // Subtle wave-based variation (procedural)
      float wave = sin(vUv.x * 20.0 + time * 3.0) * sin(vUv.y * 20.0 + time * 2.5) * 0.02;
      vec3 finalColor = fresnelColor + specular + vec3(wave, wave, wave);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

/**
 * Create water material with configurable options
 * @param {Object} opts - { waterColor, alpha, waveScale, waveHeight, sunDirection }
 * @returns {THREE.ShaderMaterial}
 */
export function createWaterMaterial(opts = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(WaterShader.uniforms),
    vertexShader: WaterShader.vertexShader,
    fragmentShader: WaterShader.fragmentShader,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: true,
    depthTest: true,
  });

  if (opts.waterColor != null) material.uniforms.waterColor.value.set(opts.waterColor);
  if (opts.alpha != null) material.uniforms.alpha.value = opts.alpha;
  if (opts.waveScale != null) material.uniforms.waveScale.value = opts.waveScale;
  if (opts.waveHeight != null) material.uniforms.waveHeight.value = opts.waveHeight;
  if (opts.sunDirection) material.uniforms.sunDirection.value.copy(opts.sunDirection);

  return material;
}

/**
 * Update water material time uniform (call each frame)
 * @param {THREE.ShaderMaterial} material
 * @param {number} time - Elapsed time in seconds
 */
export function updateWaterTime(material, time) {
  if (material?.uniforms?.time) material.uniforms.time.value = time;
}
