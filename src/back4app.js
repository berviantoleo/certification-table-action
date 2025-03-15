const axios = require('axios')

const publicUrl = 'https://parseapi.back4app.com'
const applicationIdHeader = 'X-Parse-Application-Id'
const applicationId = process.env.APPLICATION_ID
const restAPIKeyHeader = 'X-Parse-REST-API-Key'
const restAPIKey = process.env.REST_API_KEY

const back4AppService = axios.create({
  baseURL: publicUrl,
  headers: {
    [applicationIdHeader]: applicationId,
    [restAPIKeyHeader]: restAPIKey,
    accept: 'application/json'
  }
})

module.exports = { back4AppService }
