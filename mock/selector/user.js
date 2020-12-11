const users = require('./data/users.tmp.json')
const { pagination } = require('../utils')

module.exports = [
  {
    url: '/api/thraex/user/page',
    type: 'get',
    response: config => {
      const { page, size } = config.query

      const list = [...users]

      return {
        code: 20000,
        data: pagination(page, size, list),
        total: list.length
      }
    }
  },
  {
    url: '/api/thraex/user/ids',
    type: 'get',
    response: () => ({ code: 20000, data: users })
  }
]
