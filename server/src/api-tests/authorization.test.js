import assert from 'assert'
import apiRequest from './api-request'

describe('/api/authorization', () => {
  it('should return 401 for wrong password/subdomain combination', async () => {
    try {
      await apiRequest('POST', '/api/authorization', {
        password: 'wrong',
        subdomain: 'one',
      }, { fail: true })
      return false
    } catch (error) {
      return true
    }
  })

  it('should return 200 for correct password/subdomain combination', async () => {
    await apiRequest('POST', '/api/authorization', {
      password: 'correct',
      subdomain: 'one',
    })
  })
})
