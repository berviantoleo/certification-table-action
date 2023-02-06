jest.mock('@actions/github')
jest.mock('axios')

const { updateBadge } = require('../src/updateBadge')
const axios = require('axios')
const github = require('@actions/github')

describe('Update Badge function', () => {
  it('Update Badge Success', async () => {
    // setup download badges
    // return the first list
    axios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          data: {
            credentials: [{
              badge_assertion_url: 'http://test.com',
              url: 'http://badge.com'
            }]
          }
        }
      })
    )

    // return each details
    axios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          image: 'http://image.test.com'
        }
      })
    )

    const dataContent = '<!--START_SECTION:accrediblebadges--> <!--END_SECTION:accrediblebadges-->'
    const base64DataContent = Buffer.from(dataContent, 'utf8').toString('base64')

    github.getOctokit.mockReturnValue({
      rest: {
        repos: {
          getReadme: () => ({
            data: {
              content: base64DataContent
            }
          }),
          createOrUpdateFileContents: () => ({
            status: 200
          })
        }
      }
    })

    github.context = {
      repo: {
        owner: 'leo',
        repo: 'accredible'
      }
    }

    const responseData = await updateBadge('random', 'randomuser')
    expect(responseData).toEqual(1)
  })
})
