const { back4AppService } = require('./back4app')

async function downloadCertifications () {
  const response = await back4AppService.get(
    'classes/Certification?order=-Expiration,-AchievedDate'
  )
  const credentials = response?.data?.results
  if (!Array.isArray(credentials)) {
    return
  }

  console.log(`Get ${credentials.length} certifications`)

  return credentials
}

module.exports = { downloadCertifications }

// downloadCertifications().then(result => console.log(result))
