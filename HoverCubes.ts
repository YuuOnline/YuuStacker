import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3"
import { Entity } from "./Yuu API/Entity";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive"


export const hoverCubes = {
  destroyPreviousCubes,
  spawn,
}


// Know where other blocks are so they don't overlap

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

  const cube = spawnPrimitive.cube(pos, new Vector3(scale, scale, scale), Quaternion.fromEuler(new Vector3(0, Math.random(), 0)), Color.randomHue(), 0.75, false, 'Animated', undefined);

  cubes.push(cube);
}