const async = require('async')
const render = require('consolidate').handlebars.render
const multimatch = require('multimatch')

/**
 * Template in place plugin.
 *
 * @param {Object} skipRender
 * @return {Function}
 */

module.exports = (skipRender) => {
  return function renderTemplate (files, metalsmith, done) {
    const data = metalsmith.metadata()
    async.each(Object.keys(files), (file, next) => {
    // skipping files with skipRender option
      if (skipRender && multimatch([file], skipRender, { dot: true }).length) {
        next()
      } else {
        const str = files[file].contents.toString()
        // do not attempt to render files that do not have mustaches
        // {非数字时}，{}不需要转义
        if (/{{([^{}]+)}}/g.test(str)) {
          render(str, data, (err, res) => {
            if (err) {
              err.message = `[${file}] ${err.message}`
              next(err)
            } else {
              files[file].contents = Buffer.from(res)
              next()
            }
          })
        } else {
          next()
        }
      }
    }, done)
  }
}
