const exec = require('child_process').execSync

module.exports = function () {
  let name
  let email

  try {
    name = exec('git config --get user.name', { encoding: 'utf8' })
    email = exec('git config --get user.email', { encoding: 'utf8' })
  } catch (e) {
    throw e
  }

  name = name ? name.trim() : ''
  email = email ? `<${email.trim()}>` : ''
  return `${name} ${email}`.trim()
}
