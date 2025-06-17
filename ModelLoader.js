import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function loadModels(scene, callback) {
  const loader = new GLTFLoader();

  loader.load('public/models/helicopter.glb', (helicopterGLTF) => {
    const helicopter = helicopterGLTF.scene;
    helicopter.scale.set(10, 10, 10);

    let propeller = null;
    helicopter.traverse((child) => {
      if (child.isMesh && child.name === 'Cube_4') {
        propeller = child;
      }
    });

    loader.load('public/models/skydiver.glb', (skydiverGLTF) => {
      const originalSkydiver = skydiverGLTF.scene;
      const skydiverClone = originalSkydiver.clone();

      originalSkydiver.scale.set(3, 3, 3);
      skydiverClone.scale.set(0.5, 0.5, 0.5);
      skydiverClone.position.set(0, -2, 0);

      loader.load('public/models/parachute_circular.glb', (circularGLTF) => {
        const parachuteCircular = circularGLTF.scene;
        parachuteCircular.visible = false;
        parachuteCircular.position.set(0, 2.3, 0);

        loader.load('public/models/parachute_lifting.glb', (liftingGLTF) => {
          const parachuteLifting = liftingGLTF.scene;
          parachuteLifting.visible = false;
          parachuteLifting.position.set(0, 1.5, 0);
          parachuteLifting.scale.set(0.3, 0.3, 0.3);

          originalSkydiver.add(parachuteCircular);
          originalSkydiver.add(parachuteLifting);

          helicopter.add(skydiverClone);
          scene.add(helicopter);

          callback(originalSkydiver, skydiverClone, parachuteCircular, parachuteLifting, helicopter, propeller);
        });
      });
    });
  });
}
