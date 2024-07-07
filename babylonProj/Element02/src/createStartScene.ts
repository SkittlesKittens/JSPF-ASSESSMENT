//-----------------------------------------------------
//TOP OF CODE - IMPORTING BABYLONJS
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
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
    Space,
    ShadowGenerator,
    PointLight,
    DirectionalLight,
    CubeTexture,
  } from "@babylonjs/core";
  //----------------------------------------------------
  
  //----------------------------------------------------
  //MIDDLE OF CODE - FUNCTIONS
  
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
     //Create Village ground
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

  //PREVIOUS METHODS
  // function createSpotLight(scene: Scene, px: number, py: number, pz: number) {
  //   var light = new SpotLight("spotLight", new Vector3(-1, 1, -1), new Vector3(0, -1, 0), Math.PI / 2, 10, scene);
  //   light.diffuse = new Color3(0.39, 0.44, 0.91);
  //   light.specular = new Color3(0.22, 0.31, 0.79);
  //   return light;
  // }
  
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
      hemisphericLight?: HemisphericLight;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    //further code here
    that.terrain = createTerrain(that.scene);
    that.ground = createGround(that.scene);
    that.skybox = createSkybox(that.scene);
    that.maze = createMaze(that.scene);

    //Scene Lighting main camera
    that.hemisphericLight = createHemiLight(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
  //----------------------------------------------------
