const chalk = require('chalk')
const format = require('util').format

/**
 * Prefix.
 */

const prefix = '\n   vue-cli'
const sep = chalk.gray('·')

module.exports = {
  log (...msg) {
    console.log(chalk.white(prefix), sep, format(...msg))
  },
  success (...msg) {
    console.log(chalk.green(prefix), sep, format(...msg))
  },
  fatal (...err) {
    const msg = err[0] instanceof Error
      ? err.message.trim()
      : format(...err)
    console.error(chalk.red(prefix), sep, msg)
    process.exit(1)
  }
}
