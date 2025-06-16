import * as THREE from 'three';

const gravity = 9.81; 
const airDensity = 1.225; 

let Cd = 1.0;
let A = 1.0;
let mass = 80;
let ParachuteTension = 1.0;
let alpha = 0;
let beta = 0;

function getGravityForce() {
  return mass * gravity;
}

function getRelativeVelocity(velocityVector, windVector) {
  return velocityVector.clone().sub(windVector);
}

function getDragForce(velocityVector) {
  const speed = velocityVector.length();
  if (speed === 0) return new THREE.Vector3(0, 0, 0);
  const direction = velocityVector.clone().normalize();
  const dragMagnitude = 0.5 * Cd * airDensity * A * speed * speed;
  return direction.multiplyScalar(-dragMagnitude);
}

function getDirectionalDrag(velocityVector) {
  const baseDrag = getDragForce(velocityVector);

const angleFactorX = Math.abs(Math.cos(THREE.MathUtils.degToRad(alpha)));
const angleFactorZ = Math.abs(Math.cos(THREE.MathUtils.degToRad(beta)));

  return new THREE.Vector3(
    baseDrag.x * angleFactorX,
    baseDrag.y,
    baseDrag.z * angleFactorZ
  );
}

function updateParachuteParams(parachuteType, isDeployed) {
  if (!isDeployed) return;

  if (parachuteType === "circular") {
    Cd = 1.5;
    A = 15;
  } else if (parachuteType === "lifting") {
    Cd = 1.2;
    A = 25;
  }

  Cd *= ParachuteTension;
  A *= ParachuteTension;
}

function updateSkydiverPhysics(skydiver, velocity, deltaTime, windVector = new THREE.Vector3(0, 0, 0)) {
  const gravityForce = new THREE.Vector3(0, -getGravityForce(), 0);
  const relativeVelocity = getRelativeVelocity(velocity, windVector);
  const dragForce = getDirectionalDrag(relativeVelocity);

  const totalForce = gravityForce.clone().add(dragForce);
  const acceleration = totalForce.divideScalar(mass);

  velocity.add(acceleration.multiplyScalar(deltaTime));

  const newPosition = skydiver.position.clone().add(velocity.clone().multiplyScalar(deltaTime));
  const groundLevel = -1.5;

  if (newPosition.y <= groundLevel) {
    newPosition.y = groundLevel;
    velocity.set(0, 0, 0);
  }

  skydiver.position.copy(newPosition);
}

function getTerminalVelocity() {
  return Math.sqrt((2 * mass * gravity) / (Cd * A * airDensity));
}

function getShockForce(upwardAccel) {
  return mass * gravity + mass * upwardAccel;
}

function setParams(params) {
  if (typeof params.Cd === 'number') Cd = params.Cd;
  if (typeof params.A === 'number') A = params.A;
  if (typeof params.mass === 'number') mass = params.mass;
  if (typeof params.ParachuteTension === 'number') ParachuteTension = params.ParachuteTension;
  if (typeof params.alpha === 'number') alpha = params.alpha;
  if (typeof params.beta === 'number') beta = params.beta;
}

export {
  updateSkydiverPhysics,
  updateParachuteParams,
  getTerminalVelocity,
  gravity,
  setParams,
  getShockForce,
  Cd,
  A,
  mass,
  ParachuteTension,
  alpha,
  beta
};
