jest.mock('@actions/github')
const { updateTable } = require('../src/updateTable')
const axios = require('axios')
const github = require('@actions/github')

describe('Update Table function', () => {
  it('Update Table Success', async () => {
    // setup download badges
    // return the first list
    const newDate = new Date().toISOString()

    axios.get.mockReturnValueOnce(
      Promise.resolve({
        data: {
          results: [{
            Name: 'Sample Cert',
            Expiration: { iso: newDate },
            AchievedDate: { iso: newDate },
            Link: 'https://test.com'
          }]
        }
      })
    )

    const dataContent = '<!--START_SECTION:certificationtable--> <!--END_SECTION:certificationtable-->'
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

    const responseData = await updateTable('random')
    expect(responseData).toEqual(1)
  })
})
