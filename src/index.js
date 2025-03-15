const core = require('@actions/core')
const { updateTable } = require('./updateTable')

try {
  const githubToken = core.getInput('token')
  updateTable(githubToken)
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
