import TWEEN from '@tweenjs/tween.js';

export function deployParachute(parachute, parachuteType) {
  if (parachute.visible) return;

  parachute.visible = true;

  let targetScale = 1;

  if (parachuteType === "circular") {
    targetScale = 1; // base scale for circular parachute
  } else if (parachuteType === "lifting") {
    targetScale = 0.5; // reduce size of lifting parachute to match circular
  }

  parachute.scale.set(0.1, 0.1, 0.1);

  new TWEEN.Tween(parachute.scale)
    .to({ x: targetScale, y: targetScale, z: targetScale }, 800)
    .easing(TWEEN.Easing.Elastic.Out)
    .start();
}
