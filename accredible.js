const axios = require("axios");

async function downloadBadges(username) {
  const response = await axios.get(
    `https://api.accredible.com/v1/credential-net/users/${username}/user_wallet`
  );
  const credentials = response.data?.data?.credentials;
  if (!Array.isArray(credentials)) {
    return;
  }
  const followUpLink = credentials.map(
    (credential) => credential.badge_assertion_url
  );
  const badgeLink = credentials.map((credential) => credential.url);
  const taskLink = followUpLink.map((link) => axios.get(link));
  const taskResult = await Promise.allSettled(taskLink);
  const imageUrl = taskResult
    .filter((result) => result.status === "fulfilled")
    .map((data) => data.value?.data?.image);
  if (imageUrl.length != badgeLink.length) {
    return;
  }

  console.log(`Get ${imageUrl.length} badges`);

  return imageUrl.map((url, index) => ({
    imageUrl: url,
    badgeUrl: badgeLink[index],
  }));
}

module.exports = { downloadBadges };

// downloadBadges('berviantoleo').then(result => console.log(result));
