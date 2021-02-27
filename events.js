const Vec3 = require('vec3')

module.exports = (bot, conn) => {
  return {
    login() {
      conn.sendText(JSON.stringify({ pkg: 'login' }))
    },
    chunkColumnLoad(point) {
      let col = bot.world.getColumn(Math.floor(point.x / 16), Math.floor(point.z / 16))
      let chunk = new Array(16)
      for (let x = 0; x < 16; x++) {
        chunk[x] = new Array(256)
        for (let y = 0; y < 256; y++) {
          chunk[x][y] = new Array(16)
          for (let z = 0; z < 16; z++) {
            chunk[x][y][z] = col.getBlock(new Vec3(x, y, z)).stateId
          }
        }
      }
      /*
      let biome = new Array(16)
      for(let x = 0; x < 16; x++) {
          biome[x] = new Array(16)
          for (let z = 0; z < 16; z++) {
              biome[x][z] = col.getBlock(new Vec3(x, 0, z)).biome.id
          }
      }
      */
      conn.sendText(JSON.stringify({
        pkg: 'chunkColumnLoad',
        pos: [Math.floor(point.x / 16), Math.floor(point.z / 16)],
        chunk,
        // biome: biome
      }))
      // console.log(bot.world.getColumn(Math.floor(point.x / 16), Math.floor(point.z / 16)).getBlock(new Vec3(0, 62, 0)))
    },
    chunkColumnUnload(point) {
      conn.sendText(JSON.stringify({
        pkg: 'chunkColumnUnload',
        pos: [Math.floor(point.x / 16), Math.floor(point.z / 16)]
      }))
    },
    blockUpdate(oldBlock, newBlock) {
      // console.log(newBlock)
      // console.log(newBlock.getProperties())
      conn.sendText(JSON.stringify({
        pkg: 'blockUpdate',
        pos: [newBlock.position.x, newBlock.position.y, newBlock.position.z],
        block: newBlock.stateId
      }))
    }
  }
}