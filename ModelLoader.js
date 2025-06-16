import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModels(scene, callback) {
  const loader = new GLTFLoader();

  loader.load('public/models/helicopter.glb', (helicopterGLTF) => {
    const helicopter = helicopterGLTF.scene;

    loader.load('public/models/skydiver.glb', (skydiverGLTF) => {
      const skydiver = skydiverGLTF.scene;
      skydiver.scale.set(2,2,2);
      loader.load('public/models/parachute_circular.glb', (circularGLTF) => {
        const parachuteCircular = circularGLTF.scene;
        parachuteCircular.visible = false;
        parachuteCircular.position.set(0, 2.3, 0);

        loader.load('public/models/parachute_lifting.glb', (liftingGLTF) => {
          const parachuteLifting = liftingGLTF.scene;
          parachuteLifting.visible = false;
          parachuteLifting.position.set(0,1.5, 0);
          parachuteLifting.scale.set(0.3,0.3,0.3);


          skydiver.add(parachuteCircular);
          skydiver.add(parachuteLifting);
          
          helicopter.add(skydiver);
          scene.add(helicopter);

          callback(skydiver, parachuteCircular, parachuteLifting, helicopter);
        });
      });
    });
  });
}
