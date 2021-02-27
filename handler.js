module.exports = {
  join(bot, pkg, conn) {
    const events = require('./events')(bot, conn)

    for (let i of Object.keys(events)) {
      bot.on(i, events[i])
    }
  }
}