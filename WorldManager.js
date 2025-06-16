import * as THREE from 'three';

export function initWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); 

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const clock = new THREE.Clock();

  return { scene, camera, renderer, clock };
}
