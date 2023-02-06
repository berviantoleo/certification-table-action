jest.mock('axios')

const axios = require('axios')
const { downloadBadges } = require('../src/accredible')

describe('Download Badges', () => {
  it('Wrong credentials response should return undefined', async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: null
      })
    )

    const returnData = await downloadBadges('random')
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(returnData).toBeFalsy()
  })

  it('Failed get image link should return undefined', async () => {
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
      Promise.reject(new Error('failed'))
    )

    const returnData = await downloadBadges('random')
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(returnData).toBeFalsy()
  })

  it('Correct credentials response should return the list', async () => {
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

    const returnData = await downloadBadges('random')
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(returnData).toEqual([{
      imageUrl: 'http://image.test.com',
      badgeUrl: 'http://badge.com'
    }])
  })
})
