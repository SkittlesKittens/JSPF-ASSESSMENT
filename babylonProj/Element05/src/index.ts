import { Engine } from "@babylonjs/core";
import MenuScene from "./MenuScene";
import GameScene from "./GameScene";
import './main.css';

// Create canvas and add to DOM
const CanvasName = "renderCanvas";
let canvas = document.createElement("canvas");
canvas.id = CanvasName;
canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

// Initialize Babylon.js engine
let engine = new Engine(canvas, true);

// Initialize scenes
let scenes: any[] = [];
scenes[0] = MenuScene(engine);
scenes[1] = GameScene(engine);

// Function to set active scene
export default function setSceneIndex(i: number) {
    engine.stopRenderLoop(); // Stop current rendering loop

    // Clear previous scene
    if (scenes[i - 1]) {
        scenes[i - 1].scene.dispose();
    }

    // Run render loop for new scene
    engine.runRenderLoop(() => {
        scenes[i].scene.render();
    });
}

// Set initial scene
setSceneIndex(0);