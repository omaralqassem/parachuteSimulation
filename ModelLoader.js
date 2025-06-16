import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModels(scene, callback) {
  const loader = new GLTFLoader();

  loader.load('public/models/helicopter.glb', (helicopterGLTF) => {
    const helicopter = helicopterGLTF.scene;

    loader.load('public/models/skydiver.glb', (skydiverGLTF) => {
      const skydiver = skydiverGLTF.scene;

      loader.load('public/models/parachute.glb', (parachuteGLTF) => {
        const parachute = parachuteGLTF.scene;
        parachute.visible = false;
        parachute.position.set(0, 1.5, 0);

        skydiver.add(parachute);
        helicopter.add(skydiver);
        scene.add(helicopter);

        callback(skydiver, parachute, helicopter);
      });
    });
  });
}
