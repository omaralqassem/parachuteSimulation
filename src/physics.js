// physics laws
const gravity = 9.81; // m/s²
const airDensity = 1.225; // kg/m³

// Adjustable parameters 
let Cd = 1.0;   
let A = 1.0;     
let mass = 80;   
let windSpeed = 0;
let ParachuteTension = 1.0;     
let alpha = 0;  
let beta = 0;  



function getGravityForce() {
  return mass * gravity;
}

function getDragForce(velocityVector) {
  const speed = velocityVector.length();
  const direction = velocityVector.clone().normalize();
  const dragMagnitude = 0.5 * Cd * airDensity * A * speed * speed;
  return direction.multiplyScalar(-dragMagnitude); 
}

function getRelativeVelocity(velocityVector, windVector) {
  return velocityVector.clone().sub(windVector);
}

function getTerminalVelocity(mass, Cd, A) {
  return Math.sqrt((2 * mass * g) / (Cd * airDensity * A));
}

function getWindDrift(windSpeed, time) {
  return windSpeed * time;
}

function getShockForce(upwardAccel) {
  return mass * g + mass * upwardAccel;
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

function getDirectionalDrag(velocityVector) {
  const baseDrag = getDragForce(velocityVector);
  
  const angleFactorX = Math.cos(THREE.MathUtils.degToRad(alpha));
  const angleFactorZ = Math.cos(THREE.MathUtils.degToRad(beta));

  return new THREE.Vector3(
    baseDrag.x * angleFactorX,
    baseDrag.y,
    baseDrag.z * angleFactorZ
  );
}


export {
  getGravityForce,
  getDragForce,
  getRelativeVelocity,
  getTerminalVelocity,
  getWindDrift,
  getShockForce,
  updateParachuteParams,
  getDirectionalDrag,
  Cd, A, g, airDensity
};
