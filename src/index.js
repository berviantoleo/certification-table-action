const core = require('@actions/core')
const { updateBadge } = require('./updateBadge')

try {
  const username = core.getInput('username')
  const githubToken = core.getInput('token')
  updateBadge(githubToken, username)
    .then((result) => {
      console.log(result)
      core.setOutput('total', result)
    })
    .catch((error) => {
      core.setFailed(error)
    })
} catch (error) {
  core.setFailed(error)
}
