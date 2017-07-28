const path = require('path')
const exists = require('fs').existsSync
const validateName = require('validate-npm-package-name')
const getGitUser = require('./git-user')

/**
 * Read prompts metadata.
 *
 * @param {String} src
 * @return {Object}
 */

module.exports = ({name, src}) => {
  const opts = getMetadata(src)
  if (!opts.prompts) {
    opts.prompts = {}
  }

  // set project name & its validate method
  setDefault(opts, 'name', name)
  setValidateName(opts)

  // set author if there is local git user
  const author = getGitUser()
  if (author) {
    setDefault(opts, 'author', author)
  }

  const si = opts.skipRender
  if (typeof si === 'string') {
    opts.skipRender = [si]
  }

  return opts
}

/**
 * Gets the metadata from either a meta.json or meta.js file.
 *
 * @param  {String} src
 * @return {Object}
 */

function getMetadata (src) {
  const json = path.join(src, 'meta.json')
  const js = path.join(src, 'meta.js')
  let opts

  if (exists(json)) {
    opts = require(json)
  } else if (exists(js)) {
    opts = require(path.resolve(js))
    if (!(opts instanceof Object)) {
      throw new Error('meta.js needs to expose an object')
    }
  } else {
    opts = {}
  }

  return opts
}

/**
 * Set the default value for a prompt question
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault (opts, key, val) {
  const p = opts.prompts
  // typeof只适用primitive type，其他情况下会有糟糕的表现。如null，ie8-的function
  if (p[key] instanceof Object) {
    p[key]['default'] = val
  } else {
    p[key] = {
      type: 'string',
      'default': val
    }
  }
}

function setValidateName (opts) {
  const name = opts.prompts.name
  const customValidate = name.validate
  name.validate = function (name) {
    const its = validateName(name)
    if (its.validForNewPackages) {
      return customValidate instanceof Function
        ? customValidate(name)
        : true
    } else {
      const errors = (its.errors || []).concat(its.warnings || [])
      return `Sorry, ${errors.join(' and ')}.`
    }
  }
}
