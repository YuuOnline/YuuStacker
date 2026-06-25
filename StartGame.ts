import { spawnHoverCube } from "./SpawnHoverCube";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { inWorldConsole } from "./Yuu API/Console";
import { registerStart } from "./Yuu API/RegisterStart";


registerStart(start);
function start() {
  inWorldConsole.visible(true, new Vector3(0, 1.5, -1.5));

  console.log('Calling startNewGame!');

  startNewGame();
}

const count = 32;

function startNewGame() {
  for (let i = 0; i < count; i++) {
    spawnHoverCube.spawn();
  }
}