import CreateBrowser from './CreateBrowser/CreateBrowser'
import { config } from 'dotenv'
import { parse, join } from 'path'
import { mkdirSync } from 'fs'
import { CaptchaBalanceError } from './errors/CaptchaBalanceError'

async function main () {
  try {
    config({ path: join(parse(__dirname).dir, '.env') })
    mkdirSync(join(process.cwd(), 'saida'), { recursive: true })
    mkdirSync(join(process.cwd(), 'entrada'), { recursive: true })
    const newBrowser = new CreateBrowser()
    const { browser, page } = await newBrowser.init()
    await page.waitForTimeout(10000)
    await newBrowser.closeAll(browser)
    return { status: true }
  } catch (error) {
    if (error instanceof CaptchaBalanceError) {
      return { status: true, error: 'Sem creditos para burlar o captcha' }
    }
    console.log(error)
    return { status: false }
  }
}

(async () => {
  let canFinish : any
  do {
    canFinish = await main()
  } while (canFinish.status === false)
})()
