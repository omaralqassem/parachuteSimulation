import * as THREE from 'three';


const scene = new THREE.Scene();

scene.add(cubemesh)

const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 200);
camera.position.set(0, h0, 20);
camera.zoom = 10;
camera.updateProjectionMatrix();


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const color = 0xFFFFFF; 
const intensity = 5; 
const light = new THREE.PointLight(color, intensity);
light.position.set(-2, h0, 50);
scene.add(light);



