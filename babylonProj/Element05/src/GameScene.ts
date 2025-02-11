//-----------------------------------------------------
//TOP OF CODE - IMPORTING BABYLONJS
import setSceneIndex from "./index";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
  StandardMaterial,
  Texture,
  Color3,
  ShadowGenerator,
  PointLight,
  CubeTexture,
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  AnimationPropertiesOverride,
  } from "@babylonjs/core";
  //----------------------------------------------------
  
  //----------------------------------------------------
  //MIDDLE OF CODE - FUNCTIONS
  
  let keyDownMap: any[] = [];

  function importPlayerMesh(scene, x: number, y: number) {
    let tempItem = {flag: false};
    let item = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes, particleSystems, skeletons) {
      let mesh = newMeshes[0];
      let skeleton = skeletons[0];
      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1;
  
      let walkRange: any = skeleton.getAnimationRange("YBot_Walk");
  
      let animating: boolean = false;
  
      // Enable collision detection for the player mesh
      mesh.checkCollisions = true;
  
      scene.onBeforeRenderObservable.add(() => {
        let keydown: boolean = false;
        if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
          mesh.moveWithCollisions(new Vector3(0, 0, 0.1));
          mesh.rotation.y = 0;
          keydown = true;
        }
        if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
          mesh.moveWithCollisions(new Vector3(-0.1, 0, 0));
          mesh.rotation.y = 3 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
          mesh.moveWithCollisions(new Vector3(0, 0, -0.1));
          mesh.rotation.y = 2 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
          mesh.moveWithCollisions(new Vector3(0.1, 0, 0));
          mesh.rotation.y = Math.PI / 2;
          keydown = true;
        }
  
        if (keydown) {
          if (!animating) {
            animating = true;
            scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
          }
        } else {
          animating = false;
          scene.stopAnimation(skeleton);
        }
      });
    });
    return item;
  }

    function actionManager(scene: Scene){
      scene.actionManager = new ActionManager(scene);
  
      scene.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnKeyDownTrigger,
            //parameters: 'w'
          },
          function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
        )
      );
      scene.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnKeyUpTrigger
          },
          function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
        )
      );
      return scene.actionManager;
    } 
  
  //Create Terrain
  function createTerrain(scene: Scene) {
    //Create large ground for valley environment
   const largeGroundMat = new StandardMaterial("largeGroundMat");
   largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
   
   const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
   largeGround.material = largeGroundMat;
    return largeGround;
  }

  //adding detail to the ground
  function createGround(scene: Scene) {
     const groundMat = new StandardMaterial("groundMat");
     groundMat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/sand.jpg");
     groundMat.diffuseTexture.hasAlpha = true;
 
     const ground = MeshBuilder.CreateGround("ground", {width:30, height:30});
     ground.material = groundMat;
     ground.position.y = 0.02;
     return ground;
  }
  //Create Skybox
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;
    return skybox;
  }

  function createMaze(scene: Scene): Mesh[] {
    const wallMat = new StandardMaterial("wallMat", scene);
    wallMat.diffuseTexture = new Texture("textures/walltexture.jpg", scene);
  
    const wallData = [
      // Outer walls
      { position: new Vector3(0, 1, 15), scaling: new Vector3(30, 2, 1) },
      { position: new Vector3(0, 1, -15), scaling: new Vector3(30, 2, 1) }, 
      { position: new Vector3(-15, 1, 0), scaling: new Vector3(1, 2, 30) }, 
      { position: new Vector3(15, 1, 0), scaling: new Vector3(1, 2, 30) }, 
  
      // Inner walls
      { position: new Vector3(-10, 1, 10), scaling: new Vector3(10, 2, 1) }, 
      { position: new Vector3(5, 1, 10), scaling: new Vector3(10, 2, 1) }, 
      { position: new Vector3(-5, 1, 5), scaling: new Vector3(20, 2, 1) }, 
      { position: new Vector3(10, 1, 0), scaling: new Vector3(10, 2, 1) }, 
      { position: new Vector3(5, 1, -5), scaling: new Vector3(10, 2, 1) }, 
      { position: new Vector3(-5, 1, -10), scaling: new Vector3(20, 2, 1) },  
      { position: new Vector3(10, 1, 7.5), scaling: new Vector3(1, 2, 5) }, 
      { position: new Vector3(-15, 1, 0), scaling: new Vector3(1, 2, 10) }, 
      { position: new Vector3(15, 1, 0), scaling: new Vector3(1, 2, 10) }, 
      { position: new Vector3(-10, 1, -7.5), scaling: new Vector3(1, 2, 5) }, 
      { position: new Vector3(10, 1, -7.5), scaling: new Vector3(1, 2, 5) }, 
      { position: new Vector3(0, 1, 2.5), scaling: new Vector3(1, 2, 5) },
    ];
  
    const walls: Mesh[] = wallData.map(data => {
      const wall = MeshBuilder.CreateBox("wall", { height: data.scaling.y, width: data.scaling.x, depth: data.scaling.z }, scene);
      wall.position = data.position;
      wall.material = wallMat;
      
      // Enable collision detection for the wall
      wall.checkCollisions = true;
  
      return wall;
    });
  
    return walls;
  }


  function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh) {
    // only spotlight, point and directional can cast shadows in BabylonJS
    switch (index) {
      case 1: //hemispheric light
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
        hemiLight.intensity = 0.1;
        return hemiLight;
        break;
      case 2: //spot light
        const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
        spotLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        let shadowGenerator = new ShadowGenerator(1024, spotLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return spotLight;
        break;
      case 3: //point light
        const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
        pointLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        shadowGenerator = new ShadowGenerator(1024, pointLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return pointLight;
        break;
    }
  }
 
  function createHemiLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1;
    return light;
  }

  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);

     // Enable collision detection for the camera
     camera.checkCollisions = true;
      camera.collisionRadius = new Vector3(0.5, 0.5, 0.5);
    return camera;
  }
  //----------------------------------------------------------
  
  //----------------------------------------------------------
  //BOTTOM OF CODE - MAIN RENDERING AREA FOR YOUR SCENE
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      terrain?: Mesh;
      ground?: Mesh;
      skybox?: Mesh;
      box?: Mesh;
      maze?: Mesh[];
      light?: Light;
      importMesh?: any;
      actionManager?: any;
      hemisphericLight?: HemisphericLight;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.collisionsEnabled = true;
    that.scene.debugLayer.show();
  
    //further code here
    that.terrain = createTerrain(that.scene);
    that.ground = createGround(that.scene);
    that.skybox = createSkybox(that.scene);
    that.maze = createMaze(that.scene);
    that.importMesh = importPlayerMesh(that.scene, 0, 0);
    that.actionManager = actionManager(that.scene);


    //Scene Lighting main camera
    that.hemisphericLight = createHemiLight(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
  //----------------------------------------------------
