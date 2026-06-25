import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3"
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive"


export const spawnHoverCube = {
  spawn,
}


// Know where other blocks are so they don't overlap

const diameter = 8;
const radius = diameter / 2;
const scale = 0.35;

function spawn() {
  spawnPrimitive.cube(new Vector3((Math.random() * diameter) - radius, 1, Math.random() * -diameter), new Vector3(scale, scale, scale), Quaternion.fromEuler(new Vector3(0, Math.random(), 0)), Color.randomHue(), 0.75, false, 'Animated', undefined);
}