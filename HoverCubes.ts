import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3"
import { Entity } from "./Yuu API/Entity";
import { overTime } from "./Yuu API/MotionOverTime";
import { Player } from "./Yuu API/Player";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive"


export const hoverCubes = {
  destroyPreviousCubes,
  spawn,
  setTheme,
}


const cubes: Entity[] = [];
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

  let isRight = true;
  let asyncID = 0;


  cube.trigger.setOccupiedFunction((payload) => {
    const rightHandPos = Player.rightHand.position.get() ?? Vector3.zero;

    isRight = (rightHandPos.distanceTo(payload.pos) < 0.25);

    asyncID = Async.setInterval(() => {
      const handPos = (isRight ? Player.rightHand.position.get() : Player.leftHand.position.get()) ?? Vector3.up;
      handPos.subtractInPlace(new Vector3(0, 0.25, 0));

      const handForward = (isRight ? Player.rightHand.forward.get() : Player.leftHand.forward.get()) ?? Vector3.forward;
      handForward.y = 0;
      handForward.normalizeInPlace();

      // overTime.rotateTo.start(cube, Quaternion.lookAt(handForward, Vector3.up), 5_000);
      overTime.moveTo.start(cube, handPos, 200);
      // cube.pos = handPos;
    }, 100);
  });

  cube.trigger.setEmptyFunction(() => {
    Async.clearTimer(asyncID);
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