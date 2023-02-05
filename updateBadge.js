const github = require("@actions/github");
const { downloadBadges } = require("./accredible");

const START_COMMENT = "<!--START_SECTION:accrediblebadges-->";
const END_COMMENT = "<!--END_SECTION:accrediblebadges-->";
const REGEX = `${START_COMMENT}[\\s\\S]+${END_COMMENT}`;

async function updateBadge(token, username) {
  const octokit = github.getOctokit(token);
  const content = await octokit.rest.repos.getReadme({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });
  const plainText = atob(content.data.content);
  const badges = await downloadBadges(username);
  const formatted = string.join(
    " ",
    badges.map((badge) => `[![Badge](${badge.imageUrl})](${badge.badgeUrl})`)
  );
  const req = new RegExp(REGEX);
  const resultBadge = plainText.replace(
    req,
    `${START_COMMENT}\n${formatted}\n${END_COMMENT}`
  );
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    content: btoa(resultBadge),
  });
  console.log(response.status);
  return badges.length;
}

module.exports = { updateBadge };
