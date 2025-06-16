import TWEEN from '@tweenjs/tween.js';

export function deployParachute(parachute) {
  if (parachute.visible) return;

  parachute.visible = true;
  parachute.scale.set(0.1, 0.1, 0.1);

  new TWEEN.Tween(parachute.scale)
    .to({ x: 1, y: 1, z: 1 }, 800)
    .easing(TWEEN.Easing.Elastic.Out)
    .start();
}
  