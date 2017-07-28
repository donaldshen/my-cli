const render = require('consolidate').handlebars.render
const Handlebars = require('handlebars')
const Metalsmith = require('metalsmith')
const path = require('path')
const askQuestions = require('./askQuestions')
const filterFiles = require('./filterFiles')
const getOptions = require('./getOptions')
const renderTemplate = require('./renderTemplate')

// register handlebars helper
Handlebars.registerHelper({
  if_eq (a, b, opts) {
    return a === b
      ? opts.fn(this)
      : opts.inverse(this)
  },
  unless_eq (a, b, opts) {
    return a === b
      ? opts.inverse(this)
      : opts.fn(this)
  }
})

/**
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate ({name, src, dest}) {
  // get options from js[on] & set project name
  const opts = getOptions({name, src})
  const metalsmith = Metalsmith(path.join(src, 'template'))
  metalsmith.metadata({
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })
  if (opts.helpers) {
    Object
      .keys(opts.helpers)
      .map((key) => {
        Handlebars.registerHelper(key, opts.helpers[key])
      })
  }

  return new Promise((resolve, reject) => {
    metalsmith
      .clean(false)
      .source('.')
      .destination(dest)
      .use(askQuestions(opts.prompts))
      .use(filterFiles(opts.filters))
      .use(renderTemplate(opts.skipRender))
      .build((err, files) => {
        if (err) {
          reject(err)
        } else {
          const data = metalsmith.metadata()
          if (typeof opts.complete === 'function') {
            opts.complete(data)
          } else if (opts.completeMessage) {
            logMessage(opts.completeMessage, data)
          }
          resolve(`Generated "${name}".`)
        }
      })
  })
}

/**
 * Display template complete message.
 *
 * @param {String} message
 * @param {Object} data
 */

function logMessage (message, data) {
  render(message, data, (err, res) => {
    if (err) {
      console.error(`\n   Error when rendering template complete message: ${err.message.trim()}`)
    } else {
      const msg = `\n${res}`.replace(/\r?\n/g, '\n   ')
      console.log(msg)
    }
  })
}
