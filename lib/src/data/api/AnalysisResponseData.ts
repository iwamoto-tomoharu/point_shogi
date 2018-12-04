import EngineResponseData from '../EngineResponseData'
import Move from '../Move'
import ApiData from './ApiData'
import ApiName from '../enum/ApiName'
import Json from './Json'

export default class AnalysisResponseData extends EngineResponseData {

  constructor (
        private _apiName: ApiName,
        engineData: EngineResponseData) {
    super(engineData.status, engineData.evaluation, engineData.bestMove,
              engineData.isResign, engineData.isNyugyoku)
  }

  /**
   * ObjectをPiecePositionに変換
   * @param {Json} obj
   * @returns {AnalysisResponseData}
   */
  public static fromJSON (obj: Json): AnalysisResponseData {
    return new AnalysisResponseData(
            obj._apiName,
            new EngineResponseData(
            obj._status,
            obj._evaluation,
            Move.fromJSON(obj._bestMove),
            obj._isResign,
            obj._isNyugyoku
        ))
  }

}
