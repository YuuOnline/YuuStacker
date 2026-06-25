import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3"
import { Controller } from "./Yuu API/Controller";
import { Entity } from "./Yuu API/Entity";
import { overTime } from "./Yuu API/MotionOverTime";
import { Player } from "./Yuu API/Player";
import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive"


export const hoverCubes = {
  destroyPreviousCubes,
  spawn,
  setTheme,
}


registerStart(start);
function start() {
  Async.setInterval(() => { loop(); }, 50);

  Controller.subscribe('rightGrip', 'Released', () => { rightHandCube = undefined; });
  Controller.subscribe('leftGrip', 'Released', () => { leftHandCube = undefined; });
}

function loop() {
  cubes.forEach((cube) => {
    if (!stackedCubes.includes(cube) && cube !== leftHandCube && cube !== rightHandCube) {
      if (Math.random() > 0.95) {
        const pos = cube.pos;
        const curY = pos.y;

        pos.y = 0.875 + (Math.random() * 0.25);

        overTime.moveTo.start(cube, pos, Math.floor((Math.abs(curY - pos.y) / 0.25) * 6_000));
      }

      if (Math.random() > 0.95) {
        // overTime.rotateTo.start(cube, Quaternion.fromEuler(new Vector3(0, Math.random() * 2 * Math.PI, 0)), 10_000);
      }
    }
  });

  if (rightHandCube) {
    const handPos = Player.rightHand.position.get() ?? Vector3.up;
    handPos.subtractInPlace(new Vector3(0, 0.25, 0));

    const handForward = Player.rightHand.forward.get() ?? Vector3.forward;
    handForward.y = 0;
    handForward.normalizeInPlace();

    overTime.moveTo.start(rightHandCube, handPos, 100);
    // overTime.rotateTo.start(rightHandCube, Quaternion.lookAt(handForward, Vector3.up), 5_000);
  }

  if (leftHandCube) {
    const handPos = Player.leftHand.position.get() ?? Vector3.up;
    handPos.subtractInPlace(new Vector3(0, 0.25, 0));

    const handForward = Player.leftHand.forward.get() ?? Vector3.forward;
    handForward.y = 0;
    handForward.normalizeInPlace();

    overTime.moveTo.start(leftHandCube, handPos, 100);
    // overTime.rotateTo.start(leftHandCube, Quaternion.lookAt(handForward, Vector3.up), 5_000);
  }
}


const cubes: Entity[] = [];
const stackedCubes: Entity[] = [];

let leftHandCube: Entity | undefined;
let rightHandCube: Entity | undefined;

const gridPositionsOccupied: string[] = [];

function destroyPreviousCubes() {
  cubes.forEach((cube) => {
    cube.destroy();
  });

  gridPositionsOccupied.length = 0;
}

const gridSpaceDiameter = 0.45;
const numberOfTilesOutwards = 12;
const scale = 0.25;

function spawn() {
  const yCoord = 1;

  let xCoord = Math.floor(Math.random() * ((numberOfTilesOutwards * 2) + 1)) - numberOfTilesOutwards;
  let zCoord = Math.floor(Math.random() * (numberOfTilesOutwards + 1));

  let key = xCoord.toString() + '|' + zCoord.toString();

  let i = 0;

  while (gridPositionsOccupied.includes(key) && i < 256) {
    xCoord = Math.floor(Math.random() * ((numberOfTilesOutwards * 2) + 1)) - numberOfTilesOutwards;
    zCoord = Math.floor(Math.random() * (numberOfTilesOutwards + 1));

    key = xCoord.toString() + '|' + zCoord.toString();

    i++;
  }

  gridPositionsOccupied.push(key);

  const pos = new Vector3(xCoord * gridSpaceDiameter, yCoord, -zCoord * gridSpaceDiameter);

  const cube = spawnPrimitive.cube(pos, new Vector3(scale, scale, scale), Quaternion.fromEuler(new Vector3(0, Math.random(), 0)), colors[colorIndex], 0.75, false, 'Animated', undefined);

  colorIndex = (colorIndex + 1) % colors.length;

  cubes.push(cube);

  cube.trigger.initialize(scale, scale * 2);

  cube.trigger.setOccupiedFunction((payload) => {
    const rightHandPos = Player.rightHand.position.get() ?? Vector3.zero;

    if (rightHandPos.distanceTo(payload.pos) < 0.25) {
      if (rightHandCube === undefined) {
        rightHandCube = cube;
      }
    }
    else {
      if (leftHandCube === undefined) {
        leftHandCube = cube;
      }
    }
  });
}


const colors: Color[] = [];
let colorIndex = 0;

function setTheme(theme: Color | 'Rainbow') {
  colors.length = 0;
  colorIndex = 0;

  if (theme === 'Rainbow') {
    colors.push(Color.red);
    colors.push(new Color(1, 0.5, 0));
    colors.push(Color.yellow);
    colors.push(Color.green);
    colors.push(Color.blue);
    colors.push(new Color(0.5, 0, 1));
    colors.push(Color.magenta);
  }
  else {
    colors.push(theme);

    const hue = toHSV(theme).x;

    colors.push(Color.fromHSV((hue + 0.05) % 1, 1, 0.5));
    colors.push(Color.fromHSV((hue + 0.1) % 1, 1, 1));
    colors.push(Color.fromHSV((hue + 0.15) % 1, 1, 0.5));
    colors.push(Color.fromHSV((hue + 0.95) % 1, 1, 0.5));
    colors.push(Color.fromHSV((hue + 0.9) % 1, 1, 1));
    colors.push(Color.fromHSV((hue + 0.85) % 1, 1, 0.5));
  }
}

function toHSV(color: Color): Vector3 {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const v = max;

  if (delta !== 0) {
    s = delta / max;

    if (max === color.r) {
      h = ((color.g - color.b) / delta) % 6;
    } else if (max === color.g) {
      h = (color.b - color.r) / delta + 2;
    } else {
      h = (color.r - color.g) / delta + 4;
    }

    h /= 6;
    if (h < 0) h += 1;
  }

  return new Vector3(h, s, v);
}