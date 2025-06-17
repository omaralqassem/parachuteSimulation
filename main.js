import * as THREE from 'three';
import { initWorld } from '/WorldManager.js';
import { loadModels } from '/ModelLoader.js';
import { setupControls } from '/Controls.js';
import { 
  updateSkydiverPhysics, 
  updateParachuteParams, 
  getTerminalVelocity, 
  gravity, 
  setParams, 
  getShockForce 
} from '/physics.js';
import { deployParachute } from '/Animate.js';
import TWEEN from '@tweenjs/tween.js';

let scene, camera, renderer, clock;
let skydiver, parachute, helicopter;
let velocity = new THREE.Vector3(0, 0, 0);
let wind = new THREE.Vector3(2, 0, 0);
let parachuteDeployed = false;
let parachuteType = "circular";
let skydiverReleased = false;
let hasLanded = false;
let parachuteCircular, parachuteLifting;
const followOffset = new THREE.Vector3(0, 10, -15);
let propeller;
let skydiverClone; 
let hud;

function init() {
  ({ scene, camera, renderer, clock } = initWorld());
  setupControls(camera, renderer.domElement);

  setupHUD();
  setupControlsUI();

  loadModels(scene, (originalSkydiver, loadedSkydiverClone, loadedParachuteCircular, loadedParachuteLifting, loadedHelicopter, loadedPropeller) => {
    skydiver = originalSkydiver;
    skydiverClone = loadedSkydiverClone;
    parachuteCircular = loadedParachuteCircular;
    parachuteLifting = loadedParachuteLifting;
    helicopter = loadedHelicopter;
    propeller = loadedPropeller;

    const helicopterHeight = 1000;
    helicopter.position.set(0, helicopterHeight, 0);

    camera.position.set(0, helicopterHeight + 15, 50);
    camera.lookAt(0, helicopterHeight, 0);

    if (camera.controls) {
      camera.controls.target.set(0, helicopterHeight, 0);
      camera.controls.update();
    }

    window.addEventListener('keydown', onKeyDown);

    animate();
  });
}

function onKeyDown(e) {
  const key = e.key.toLowerCase();
  console.log('Key pressed:', key);

  if (key === 'p' && !parachuteDeployed && skydiverReleased) {
    parachute = (parachuteType === 'circular') ? parachuteCircular : parachuteLifting;

    parachuteCircular.visible = (parachuteType === 'circular');
    parachuteLifting.visible = (parachuteType === 'lifting');

    deployParachute(parachute);
    updateParachuteParams(parachuteType, true);
    parachuteDeployed = true;
    getShockForce(30);
  }

  if (key === '1') parachuteType = 'circular';
  if (key === '2') parachuteType = 'lifting';

  if (key === 'r' && !skydiverReleased) {
    const worldPosition = new THREE.Vector3();
    helicopter.getWorldPosition(worldPosition);

    if (helicopter.children.includes(skydiverClone)) {
      helicopter.remove(skydiverClone);
    }

    if (!scene.children.includes(skydiver)) {
      scene.add(skydiver);
    }

    skydiver.position.copy(worldPosition).add(new THREE.Vector3(0, -2, 0));
    velocity.set(0, 0, 0);
    skydiverReleased = true;

    console.log('Skydiver released at', skydiver.position);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (propeller) {
    propeller.rotation.z += delta * 10;
  }

  if (skydiverReleased && skydiver) {
    updateSkydiverPhysics(skydiver, velocity, delta, wind);
    updateHUD(skydiver.position.y, velocity.length());

    if (!hasLanded && skydiver.position.y <= -1.49 && velocity.y === 0) {
      hud.innerHTML += `<br><b>Landing Complete</b>`;
      hasLanded = true;
    }

    // Camera follow
    const desiredPosition = skydiver.position.clone().add(
      followOffset.clone().applyQuaternion(skydiver.quaternion)
    );

    camera.position.lerp(desiredPosition, 0.1);
    camera.lookAt(skydiver.position);
  }

  renderer.render(scene, camera);
}

function setupHUD() {
  hud = document.createElement('div');
  hud.style.position = 'absolute';
  hud.style.top = '10px';
  hud.style.left = '10px';
  hud.style.color = 'white';
  hud.style.backgroundColor = 'rgba(0,0,0,0.6)';
  hud.style.padding = '10px';
  hud.style.fontFamily = 'monospace';
  hud.style.fontSize = '14px';
  hud.style.zIndex = '100';
  hud.style.userSelect = 'none';
  document.body.appendChild(hud);
}

function updateHUD(height, speed) {
  hud.innerHTML = `
    Height: ${height.toFixed(2)} m<br>
    Speed: ${speed.toFixed(2)} m/s<br>
    Parachute: ${parachuteDeployed ? 'Deployed' : 'Not Deployed'}<br>
    Parachute Type: ${parachuteType}
  `;
}

function setupControlsUI() {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '10px';
  container.style.right = '10px';
  container.style.color = 'white';
  container.style.backgroundColor = 'rgba(0,0,0,0.7)';
  container.style.padding = '10px';
  container.style.fontFamily = 'monospace';
  container.style.zIndex = '101';
  container.style.maxWidth = '250px';
  container.style.userSelect = 'none';

  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Restart';
  restartBtn.style.width = '100%';
  restartBtn.style.marginTop = '10px';
  restartBtn.style.padding = '8px';
  restartBtn.style.fontSize = '14px';
  restartBtn.style.cursor = 'pointer';
  restartBtn.onclick = restartSimulation;

  function createInput(labelText, defaultValue, min, max, step, onChange) {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '8px';

    const label = document.createElement('label');
    label.textContent = labelText + ': ';
    label.style.display = 'block';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    input.min = min;
    input.max = max;
    input.step = step;
    input.style.width = '100%';

    input.addEventListener('input', () => {
      onChange(parseFloat(input.value));
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  }

  container.appendChild(createInput('Drag Coefficient (Cd)', 1.0, 0, 5, 0.01, val => {
    setParams({ Cd: val });
  }));

  container.appendChild(createInput('Cross-sectional Area (A)', 1.0, 0.1, 50, 0.1, val => {
    setParams({ A: val });
  }));

  container.appendChild(createInput('Mass (kg)', 80, 10, 200, 1, val => {
    setParams({ mass: val });
  }));

  container.appendChild(createInput('Parachute Tension', 1.0, 0.1, 5, 0.01, val => {
    setParams({ ParachuteTension: val });
  }));

  container.appendChild(createInput('Pitch (alpha °)', 0, -90, 90, 1, val => {
    setParams({ alpha: val });
  }));

  container.appendChild(createInput('Yaw (beta °)', 0, -180, 180, 1, val => {
    setParams({ beta: val });
  }));

  container.appendChild(createInput('Wind Speed (m/s)', 2, -20, 20, 0.1, val => {
    wind.x = val;
  }));

  container.appendChild(restartBtn);
  document.body.appendChild(container);
}

function restartSimulation() {
  if (!skydiver || !skydiverClone || !helicopter || !parachuteCircular || !parachuteLifting) return;

  if (scene.children.includes(skydiver)) {
    scene.remove(skydiver);
  }

  if (!helicopter.children.includes(skydiverClone)) {
    helicopter.add(skydiverClone);
  }

  velocity.set(0, 0, 0);
  setParams({
    Cd: 1.0,
    A: 1.0,
    mass: 80,
    ParachuteTension: 1.0,
    alpha: 0,
    beta: 0
  });

  skydiver.position.set(0, 0, 0);
  skydiver.rotation.set(0, 0, 0);
  skydiver.quaternion.identity();

  parachuteDeployed = false;
  skydiverReleased = false;
  hasLanded = false;

  parachuteCircular.visible = false;
  parachuteLifting.visible = false;
  parachute = null;

  helicopter.position.set(0, 1000, 0);
  camera.position.set(0, 1015, 50);
  camera.lookAt(0, 1000, 0);

  if (camera.controls) {
    camera.controls.target.set(0, 1000, 0);
    camera.controls.update();
  }

  updateHUD(helicopter.position.y, 0);
}

init();
