import { Engine } from "@babylonjs/core";
import createStartScene from "./createStartScene";
import './main.css';

const canvas = document.createElement("canvas");
canvas.id = "renderCanvas";
canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

const engine = new Engine(canvas, true);
const scene = createStartScene(engine, canvas);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});