import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, StandardMaterial, Texture, Color3 } from "@babylonjs/core";

export default function createStartScene(engine: Engine) {
    // Create a new scene
    const scene = new Scene(engine);

    // Create a camera and attach it to the canvas
    const camera = new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
    camera.attachControl(engine.getRenderingCanvas(), true);

    // Create a hemispheric light
    const light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    // Create a basic box
    const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.y = 1;

    // Apply a material to the box
    const boxMaterial = new StandardMaterial("boxMaterial", scene);
    boxMaterial.diffuseTexture = new Texture("path/to/your/texture.jpg", scene);
    box.material = boxMaterial;

    // Return the scene object
    return { scene };
}