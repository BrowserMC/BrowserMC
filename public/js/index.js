import scene from './scene.js'
import loadMcData from './data.js'

(async () => {
  let data = await loadMcData()
  let model = data.getBlockModel(9)
  console.log(model)
  console.log(data.getBlockModel(2058))
  scene.renderBlock(model)
})()




/*
var ws = new WebSocket('ws://localhost:8081')
ws.onopen = function (e) {
  console.log('connected')
  ws.send(JSON.stringify({
    pkg: 'join',
    user: 'testBot',
    passwd: '',
    host: '192.168.2.6',
    port: '25565'
  }))
}
ws.onmessage = function (e) {
  console.log(e.data)
}


var scene = createScene()
engine.runRenderLoop(function () {
  scene.render()
});
window.addEventListener("resize", function () {
  engine.resize()
});
*/