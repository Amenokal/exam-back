export default class Logger {
  static index = 0
  static interval = null

  static setInterval(msg) {
    Logger.index = 0
    Logger.interval = setInterval(() => {
      if(Logger.index >= 2) Logger.index = 0
      else Logger.index += 1

      Logger.printProgress(`${msg} ${new Array(Logger.index + 1).fill('.').join('')}`)
    }, 1000)
  }

  static resetInterval() {
    clearInterval(Logger.interval)
  }

  static printProgress(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg.toString());
  }

  static log(msg) {
    console.log(msg)
  }
}