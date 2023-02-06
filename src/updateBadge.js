const github = require('@actions/github')
const { downloadBadges } = require('./accredible')

const START_COMMENT = '<!--START_SECTION:accrediblebadges-->'
const END_COMMENT = '<!--END_SECTION:accrediblebadges-->'
const REGEX = `${START_COMMENT}[\\s\\S]+${END_COMMENT}`

async function updateBadge (token, username) {
  const octokit = github.getOctokit(token)
  const content = await octokit.rest.repos.getReadme({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  })
  const plainText = Buffer.from(content.data.content, 'base64').toString(
    'utf8'
  )
  const badges = await downloadBadges(username)
  const formatted = badges
    .map((badge) => `[![Badge](${badge.imageUrl})](${badge.badgeUrl})`)
    .join(' ')
  const req = new RegExp(REGEX)
  const resultBadge = plainText.replace(
    req,
    `${START_COMMENT}\n${formatted}\n${END_COMMENT}`
  )
  console.log(`Will replaced with: ${resultBadge}`)
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: content.data.path,
    content: Buffer.from(resultBadge, 'utf8').toString('base64'),
    message: 'Update badges',
    sha: content.data.sha
  })
  console.log(response.status)
  return badges.length
}

module.exports = { updateBadge }
