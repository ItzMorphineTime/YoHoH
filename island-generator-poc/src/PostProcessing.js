/**
 * Post-processing pipeline for island generator
 * EffectComposer with SSAO, Bloom, FXAA, Film passes
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

export class PostProcessing {
  /**
   * @param {THREE.WebGLRenderer} renderer
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   */
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    const size = renderer.getSize(new THREE.Vector2());
    const pixelRatio = renderer.getPixelRatio();
    const w = size.width;
    const h = size.height;
    const ssaoW = Math.max(256, Math.floor(w * pixelRatio * 0.5));
    const ssaoH = Math.max(256, Math.floor(h * pixelRatio * 0.5));

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.ssaoPass = new SSAOPass(scene, camera, ssaoW, ssaoH, 32);
    this.ssaoPass.kernelRadius = 8;
    this.ssaoPass.minDistance = 0.005;
    this.ssaoPass.maxDistance = 0.1;
    this.ssaoPass.enabled = false;
    this.composer.addPass(this.ssaoPass);

    const resolution = new THREE.Vector2(w * pixelRatio, h * pixelRatio);
    this.bloomPass = new UnrealBloomPass(resolution, 1, 0.4, 0.85);
    this.bloomPass.enabled = false;
    this.composer.addPass(this.bloomPass);

    this.fxaaPass = new ShaderPass(FXAAShader);
    this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pixelRatio), 1 / (h * pixelRatio));
    this.fxaaPass.enabled = false;
    this.composer.addPass(this.fxaaPass);

    this.filmPass = new FilmPass(0.5, false);
    this.filmPass.enabled = false;
    this.composer.addPass(this.filmPass);

    this.composer.addPass(new OutputPass());

    this._originalToneMapping = renderer.toneMapping;
    this._originalToneMappingExposure = renderer.toneMappingExposure;
  }

  /**
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this._enabled = !!enabled;
    // OutputPass uses tone mapping; set when post-processing is on
    if (enabled) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;
    } else {
      this.renderer.toneMapping = this._originalToneMapping;
      this.renderer.toneMappingExposure = this._originalToneMappingExposure;
    }
  }

  isEnabled() {
    return !!this._enabled;
  }

  /**
   * @param {number} [deltaTime]
   */
  render(deltaTime) {
    if (!this._enabled) return false;
    this.composer.render(deltaTime);
    return true;
  }

  setSize(width, height) {
    const pixelRatio = this.renderer.getPixelRatio();
    this.composer.setSize(width, height);
    this.composer.setPixelRatio(pixelRatio);
    const ssaoW = Math.max(256, Math.floor(width * pixelRatio * 0.5));
    const ssaoH = Math.max(256, Math.floor(height * pixelRatio * 0.5));
    this.ssaoPass.setSize(ssaoW, ssaoH);
    this.bloomPass.resolution.set(width * pixelRatio, height * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (width * pixelRatio),
      1 / (height * pixelRatio)
    );
  }

  setBloom(enabled) {
    this.bloomPass.enabled = !!enabled;
  }

  setBloomStrength(value) {
    this.bloomPass.strength = value;
  }

  setBloomRadius(value) {
    this.bloomPass.radius = value;
  }

  setBloomThreshold(value) {
    this.bloomPass.threshold = value;
  }

  setFXAA(enabled) {
    this.fxaaPass.enabled = !!enabled;
  }

  setFilm(enabled) {
    this.filmPass.enabled = !!enabled;
  }

  setFilmIntensity(value) {
    this.filmPass.uniforms['intensity'].value = value;
  }

  setFilmGrayscale(value) {
    this.filmPass.uniforms['grayscale'].value = !!value;
  }

  setSSAO(enabled) {
    this.ssaoPass.enabled = !!enabled;
  }

  setSSAOKernelRadius(value) {
    this.ssaoPass.kernelRadius = value;
  }

  setSSAOMinDistance(value) {
    this.ssaoPass.minDistance = value;
  }

  setSSAOMaxDistance(value) {
    this.ssaoPass.maxDistance = value;
  }

  setToneMappingExposure(value) {
    this.renderer.toneMappingExposure = value;
  }

  dispose() {
    this.composer.dispose();
  }
}
