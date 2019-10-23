import { join } from 'path'
import { parseFileSync } from 'envfile'

const TEST_ENV = parseFileSync(join(__dirname, '../test.env'))

if (TEST_ENV) {
  Object.keys(TEST_ENV).forEach(property => {
    process.env[property] = TEST_ENV[property]
  })
}
