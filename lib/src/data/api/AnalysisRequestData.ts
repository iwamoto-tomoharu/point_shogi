import PiecePosition from '../PiecePosition'
import ApiData from './ApiData'
import ApiName from '../enum/ApiName'
import EngineCommand from '../EngineCommand'
import Json from './Json'
import EngineOption from '../EngineOption'

export default class AnalysisRequestData {

  constructor (
        private _apiName: ApiName,
        private _piecePosition: PiecePosition,
        private _engineCommand: EngineCommand,
        private _engineOption: EngineOption
    ) {}

  get apiName (): ApiName {
    return this._apiName
  }

  get piecePosition (): PiecePosition {
    return this._piecePosition
  }

  get engineCommand (): EngineCommand {
    return this._engineCommand
  }

  get engineOption (): EngineOption {
    return this._engineOption
  }

  /**
   * ObjectをPiecePositionに変換
   * @param {Json} obj
   * @returns {AnalysisRequestData}
   */
  public static fromJSON (obj: Json): AnalysisRequestData {
    return new AnalysisRequestData(
            obj._apiName,
            PiecePosition.fromJSON(obj._piecePosition),
            EngineCommand.fromJSON(obj._engineCommand),
            EngineOption.fromJSON(obj._engineOption)
        )
  }
}
