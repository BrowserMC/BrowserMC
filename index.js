require('express')().use(require("serve-static")('public', { 'index': 'index.html' })).listen(8080)
console.log('server running at 8080')

const ws = require('nodejs-websocket')
const mf = require('mineflayer')

const handler = require('./handler')

ws.createServer(function (conn) {
  var bot = {}
  conn.on('text', function (str) {
    var pkg = JSON.parse(str)
    if (pkg.pkg === 'join') {
      bot = mf.createBot({
        username: pkg.user,
        password: pkg.passwd,
        host: pkg.host,
        port: pkg.port,
      })
    }
    handler[pkg.pkg](bot, pkg, conn)
  })
  conn.on('close', function () {
    bot.end()
  })
}).listen(8081)