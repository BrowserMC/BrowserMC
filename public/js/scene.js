import config from './config.js'

let canvas = document.getElementById("renderCanvas")
let engine = new BABYLON.Engine(canvas, true)

const createScene = function () {
  let scene = new BABYLON.Scene(engine)
  let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 0, new BABYLON.Vector3(0, 0, 5), scene)
  camera.attachControl(canvas, true)
  let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)
  let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene)
  /*
  let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  let sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere2.position = new BABYLON.Vector3(2, 3, 4);
  */



  return scene
}

let scene = createScene()
scene.useRightHandedSystem = true

engine.runRenderLoop(function () {
  scene.render()
});

window.addEventListener("resize", function () {
  engine.resize()
});


function showWorldAxis(size) {
  var makeTextPlane = function (text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
  };
  var axisX = BABYLON.Mesh.CreateLines("axisX", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  axisX.color = new BABYLON.Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
  var axisY = BABYLON.Mesh.CreateLines("axisY", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
    new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
  var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
}
showWorldAxis(2)

export default {
  renderBlock(models, offset) {
    console.log(models)
    const renderElement = (element) => {
      console.log(element)
      let from = element.from
      let to = element.to
      let faces = element.faces
      let planes = {
        down: null, // y-
        up: null, // y+
        north: null, // z-
        south: null, // z+
        west: null, // x-
        east: null, //x+
      }
      let planesOptions = {
        down: { width: (to[0] - from[0]) / 16, height: (to[2] - from[2]) / 16 }, // y-
        up: { width: (to[0] - from[0]) / 16, height: (to[2] - from[2]) / 16, }, // y+
        north: { width: (to[0] - from[0]) / 16, height: (to[1] - from[1]) / 16, }, // z-
        south: { width: (to[0] - from[0]) / 16, height: (to[1] - from[1]) / 16, }, // z+
        west: { width: (to[2] - from[2]) / 16, height: (to[1] - from[1]) / 16, }, // x-
        east: { width: (to[2] - from[2]) / 16, height: (to[1] - from[1]) / 16, } //x+
      }

      let xc = (from[0] + to[0]) / 32
      let yc = (from[1] + to[1]) / 32
      let zc = (from[2] + to[2]) / 32

      let planesPosition = {
        down: new BABYLON.Vector3(xc, from[1] / 16, zc), // y-
        up: new BABYLON.Vector3(xc, to[1] / 16, zc), // y+
        north: new BABYLON.Vector3(xc, yc, from[2] / 16), // z-
        south: new BABYLON.Vector3(xc, yc, to[2] / 16), // z+
        west: new BABYLON.Vector3(from[0] / 16, yc, zc), // x-
        east: new BABYLON.Vector3(to[0] / 16, yc, zc), //x+
      }
      let planesRotation = {
        down: new BABYLON.Vector3(- Math.PI / 2, 0, 0), // y-
        up: new BABYLON.Vector3(Math.PI / 2, 0, 0), // y+
        north: new BABYLON.Vector3(0, 0, Math.PI), // z-*
        south: new BABYLON.Vector3(Math.PI, 0, 0), // z+
        west: new BABYLON.Vector3(0, Math.PI / 2, Math.PI), // x-
        east: new BABYLON.Vector3(0, - Math.PI / 2, Math.PI), //x+
      }

      for (let i of Object.keys(faces)) {
        let face = faces[i]
        // TODO: cullface
        let material = new BABYLON.StandardMaterial(i, scene)
        material.diffuseTexture = new BABYLON.Texture(`${config.assetsUrl}blocks/${face.texture.split('/')[1]}.png`, scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE)
        material.diffuseTexture.hasAlpha = true
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        if (face.uv) {
          material.diffuseTexture.uOffset = face.uv[0] / 16
          material.diffuseTexture.vOffset = face.uv[1] / 16
          material.diffuseTexture.uScale = Math.abs(face.uv[0] - face.uv[2]) / 16
          material.diffuseTexture.vScale = Math.abs(face.uv[1] - face.uv[3]) / 16
        } else {
          material.diffuseTexture.uOffset = (1 - planesOptions[i].width) / 2
          material.diffuseTexture.uScale = planesOptions[i].width
          material.diffuseTexture.vOffset = (1 - planesOptions[i].height) / 2
          material.diffuseTexture.vScale = planesOptions[i].height
        }
        console.log('face material', i, material)
        planes[i] = BABYLON.MeshBuilder.CreatePlane(i, planesOptions[i], scene)
        planes[i].material = material
        planes[i].position = planesPosition[i]
        planes[i].rotation = planesRotation[i]
      }
    }

    let block = {
      model: models,
      parts: [],// block.parts[model编号][element编号] = faces
      particle: null
    }

    for (let i = 0; i < models.length; i++) {
      let part = models[i]
      let model = part.model // part.x part.y part.uvlock
      // TODO: uvlock 反过来旋转，向render函数里面传offset
      if (model.textures && model.textures.particle) {
        block.particle = model.textures.particle
      }
      block.parts[i] = []
      for (let j = 0; j < model.elements.length; j++) {
        let element = model.elements[j]
        block.parts[i][j] = renderElement(element)
      }
    }
    // let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  }
}