import * as THREE from 'three';


const scene = new THREE.Scene();
const cubeGeometry = new THREE.BoxGeometry(1,1,1
)
const cubeMaterial =  new THREE.MeshBasicMaterial({color:'red'})
const cubemesh = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
)

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



var helicopter;
var loader = new GLTFLoader();
loader.load('./helicopter_model/scene.gltf', function (gltf) {
  helicopter = gltf.scene;
  helicopter.position.set(0, h0, 0);
  helicopter.scale.set(15, 15, 15);
  scene.add(helicopter);
});
var spiner = new THREE.Mesh( new THREE.BoxGeometry( 20, 1, 2 ), new THREE.MeshBasicMaterial( { color: 0xCF0333 } ) );
scene.add(spiner);
spiner.position.set(2, 7, -50);