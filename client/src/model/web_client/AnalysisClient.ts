import AnalysisResponseData from '../../../../lib/src/data/api/AnalysisResponseData'
import AnalysisRequestData from '../../../../lib/src/data/api/AnalysisRequestData'
import * as request from 'superagent'
import Logger from '../../../../lib/src/Logger'

export default class AnalysisClient {

  private static readonly BASE_URL: string = 'http://localhost:3000'
  private static readonly END_POINT: string = 'analysis'
  /**
   * 解析実行
   * @param {AnalysisRequestData} requestData
   * @returns {Promise<AnalysisResponseData>}
   */
  public analyze (requestData: AnalysisRequestData): Promise<AnalysisResponseData> {
    return new Promise<AnalysisResponseData>(
            (resolve, reject) => {
              Logger.httpRequest(requestData)
              request.post(`${AnalysisClient.BASE_URL}/${AnalysisClient.END_POINT}`)
                    .send(requestData)
                    .then((res) => {
                      Logger.httpResponse(res.body)
                      resolve(AnalysisResponseData.fromJSON(res.body))
                    })
            }
        )
  }

}
