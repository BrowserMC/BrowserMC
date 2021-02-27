let canvas = document.getElementById("renderCanvas")
let engine = new BABYLON.Engine(canvas, true)

const createScene = function () {
  let scene = new BABYLON.Scene(engine)
  let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene)
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

engine.runRenderLoop(function () {
  scene.render()
});

window.addEventListener("resize", function () {
  engine.resize()
});

export default {
  renderBlock(model) {
    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
    let block = {
      top: null,
      east: null,
      
    }
  }
}