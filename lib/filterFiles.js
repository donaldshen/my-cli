const match = require('minimatch')

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

module.exports = function (filters) {
  return function filter (files, metalsmith, done) {
    if (filters) {
      const fileNames = Object.keys(files)
      const data = metalsmith.metadata()
      Object.keys(filters).forEach((glob) => {
        fileNames.forEach((file) => {
          if (match(file, glob, { dot: true }) && !filters[glob](data)) {
            delete files[file]
            console.log(glob, file)
          }
        })
      })
    }

    done()
  }
}
