import * as Express from 'express'
import * as bodyParser from 'body-parser'
import analysis from './routes/AnalysisRouter'

export default class ExpressServer {
  public static start (): void {
    const app: Express.Application = Express()

    app.listen(3000, () => {
      console.log('app listening on port 3000!')
    })

    app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            // CORSの設定。別ドメインからのアクセスを許可する。
            // TODO: 本番は指定したドメインのみ許可する
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })
    app.use(bodyParser.json())
    app.use('/analysis', analysis)
  }
}
