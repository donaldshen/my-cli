const inquirer = require('inquirer')

/**
 * Create a middleware for asking questions.
 *
 * @param {Object} prompts
 */

module.exports = function ask (prompts) {
  return function (files, metalsmith, done) {
    const data = metalsmith.metadata()

    inquirer
      .prompt(Object.keys(prompts).map(key => transform(key, prompts)))
      .then((answers) => {
        Object.keys(answers).forEach((key) => {
          if (Array.isArray(answers[key])) {
            data[key] = {}
            answers[key].forEach((ans) => {
              data[key][ans] = true
            })
          } else {
            data[key] = answers[key]
          }
        })
        done()
      })
  }
}

function transform (key, prompts) {
  const prompt = prompts[key]

  // Support types from prompt-for which was used before
  const promptMapping = {
    string: 'input',
    'boolean': 'confirm'
  }

  return {
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    'default': prompt.default,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true),
    when: prompt.when || true
  }
}
