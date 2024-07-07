import { Engine } from "@babylonjs/core";
import createStartScene from "./createStartScene";
import './main.css';

const CanvasName = "renderCanvas";

// Create the canvas element and add it to the DOM
let canvas = document.createElement("canvas");
canvas.id = CanvasName;
canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

// Initialize the Babylon.js engine
let engine = new Engine(canvas, true, {}, true);

// Create the scene using the imported function
let startScene = createStartScene(engine);

// Start the render loop
engine.runRenderLoop(() => {
    startScene.scene.render();
});