import { hoverCubes } from "./HoverCubes";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { inWorldConsole } from "./Yuu API/Console";
import { registerStart } from "./Yuu API/RegisterStart";


registerStart(start);
function start() {
  inWorldConsole.visible(true, new Vector3(0, 1.5, 1.5), Quaternion.one);

  console.log('Calling startNewGame!');

  startNewGame('Rainbow');
}

const count = 32;

function startNewGame(theme: Color | 'Rainbow') {
  hoverCubes.setTheme(theme);
  
  hoverCubes.destroyPreviousCubes();

  for (let i = 0; i < count; i++) {
    hoverCubes.spawn();
  }
}