import EngineCommandType from './enum/EngineCommandType'
import Json from './api/Json'

export default class EngineCommand {
  constructor (
        private _type: EngineCommandType,
        private _value: number
    ) {}

  get type (): EngineCommandType {
    return this._type
  }

  get value (): number {
    return this._value
  }

  /**
   * ObjectをPiecePositionに変換
   * @param {Json} obj
   * @returns {EngineCommand}
   */
  public static fromJSON (obj: Json): EngineCommand {
    return new EngineCommand(
            obj._type,
            obj._value
        )
  }
}
