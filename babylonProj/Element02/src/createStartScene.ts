import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Texture
} from "@babylonjs/core";

export default function createStartScene(engine: Engine, canvas: HTMLCanvasElement) {
  console.log("Creating scene...");
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  console.log("Camera created");

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
  console.log("Light created");

  // Create village ground
  const groundMat = new StandardMaterial("groundMat", scene);
  groundMat.diffuseTexture = new Texture("../../assets/villagegreen.png", scene);
  groundMat.diffuseTexture.hasAlpha = true;
  console.log("Ground material created");

  const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 }, scene);
  ground.material = groundMat;
  console.log("Ground created");

  // Large ground
  const largeGroundMat = new StandardMaterial("largeGroundMat", scene);
  largeGroundMat.diffuseTexture = new Texture("../../assets/valleygrass.png", scene);
  console.log("Large ground material created");

  const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "../../assets/villageheightmap.png", {
    width: 150,
    height: 150,
    subdivisions: 20,
    minHeight: 0,
    maxHeight: 10
  }, scene);
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;
  console.log("Large ground created");

  // Add houses
  for (let i = 0; i < 5; i++) {
    const house = MeshBuilder.CreateBox(`house${i}`, { size: 1 }, scene);
    house.position = new Vector3(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
    const houseMat = new StandardMaterial(`houseMat${i}`, scene);
    houseMat.diffuseTexture = new Texture("../../assets/cubehouse.png", scene);
    house.material = houseMat;
    console.log(`House ${i} created`);
  }

  // Add trees
  for (let i = 0; i < 10; i++) {
    const tree = MeshBuilder.CreatePlane(`tree${i}`, { size: 2 }, scene);
    tree.position = new Vector3(Math.random() * 10 - 5, 1, Math.random() * 10 - 5);
    tree.rotation.y = Math.random() * Math.PI * 2; // Random rotation for variety

    const treeMat = new StandardMaterial(`treeMat${i}`, scene);
    treeMat.diffuseTexture = new Texture("../../assets/palmtree.png", scene); // Example tree texture
    treeMat.diffuseTexture.hasAlpha = true; // Allow transparency

    tree.material = treeMat;
    console.log(`Tree ${i} created`);
  }

  console.log("Scene creation complete");
  return scene;
}