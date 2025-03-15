jest.mock('axios')

const axios = require('axios')

const { downloadCertifications } = require('../src/downloadCertifications')

describe('Download Certifications', () => {
  it('Wrong credentials response should return undefined', async () => {
    axios.get.mockResolvedValue(
      {
        data: {
          results: null
        }
      }
    )

    const returnData = await downloadCertifications()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(returnData).toBeFalsy()
  })

  it('Correct credentials response should return the list', async () => {
    const newDate = new Date().toISOString()
    // return the list
    axios.get.mockResolvedValue(
      {
        data: {
          results: [{
            Name: 'Sample Cert',
            Expiration: { iso: newDate },
            AchievedDate: { iso: newDate },
            Link: 'https://test.com'
          }]
        }
      }
    )

    const returnData = await downloadCertifications()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(returnData).toEqual([{
      Name: 'Sample Cert',
      Link: 'https://test.com',
      Expiration: { iso: newDate },
      AchievedDate: { iso: newDate }
    }])
  })
})
