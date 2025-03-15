const github = require('@actions/github')
const { downloadCertifications } = require('./downloadCertifications')

const START_COMMENT = '<!--START_SECTION:certificationtable-->'
const END_COMMENT = '<!--END_SECTION:certificationtable-->'
const REGEX = `${START_COMMENT}[\\s\\S]+${END_COMMENT}`

async function updateTable (token) {
  const octokit = github.getOctokit(token)
  const content = await octokit.rest.repos.getReadme({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  })
  const plainText = Buffer.from(content.data.content, 'base64').toString(
    'utf8'
  )
  const tableHeader = '|Name|Expiration|Achieved Date|Evidence Link|\n|:----:|:----:|:----:|:----:|\n'
  const certifications = await downloadCertifications()
  const formatted = certifications
    .map((certification) => `|${certification.Name}|${certification.Expiration ? new Date(certification.Expiration.iso) : '-'}|${new Date(certification.AchievedDate.iso)}|[Evidence](${certification.Link})|`)
    .join('\n')
  const req = new RegExp(REGEX)
  const resultTable = plainText.replace(
    req,
    `${START_COMMENT}\n${tableHeader}${formatted}\n${END_COMMENT}`
  )
  console.log(`Will replaced with: ${resultTable}`)
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: content.data.path,
    content: Buffer.from(resultTable, 'utf8').toString('base64'),
    message: 'Update table',
    sha: content.data.sha
  })
  console.log(response.status)
  return certifications.length
}

module.exports = { updateTable }
