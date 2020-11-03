const dotenv = require('dotenv')
dotenv.config({ path: 'dev.env' })
dotenv.config({ path: 'local.env' })
const { program } = require('commander')
const createTestCafe = require('testcafe')

const listProcessor = (value) => value.split(/,\s?/)

program.option(
  '--src <file-or-glob>',
  'The file or directory from which to run the tests',
  listProcessor
)
program.option('-f, --fixture <fixture>', 'A specific fixture to run tests for')
program.requiredOption(
  '-b, --browser <browser>',
  'The browser where the tests are run',
  listProcessor
)
program.parse()

const runTests = async () => {
  const testcafe = await createTestCafe()
  try {
    let runner = testcafe.createRunner()
    runner = program.src ? runner.src(program.src) : runner
    runner = program.fixture
      ? runner.filter((_, fixtureName) => fixtureName === program.fixture)
      : runner
    const numFailedTests = await runner.browsers(program.browser).run()
    await testcafe.close()
    if (numFailedTests > 0) {
      process.exit(1)
    }
  } catch (e) {
    console.error(e)
    await testcafe.close()
    process.exit(1)
  }
}

runTests()
