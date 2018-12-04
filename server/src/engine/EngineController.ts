import Engine from './Engine'
import EngineCommandType from '../../../lib/src/data/enum/EngineCommandType'
import EngineResponseData from '../../../lib/src/data/EngineResponseData'
import Move from '../../../lib/src/data/Move'
import EngineData from '../data/EngineData'
import EngineCommand from '../../../lib/src/data/EngineCommand'
import EngineOption from '../../../lib/src/data/EngineOption'
import PiecePosition from '../../../lib/src/data/PiecePosition'

export default class EngineController {
  // TODO:パラメータ化
  private static readonly ENGINE_MAX_SIZE: number = 5
  private static _instance: EngineController
  private engines: Set<Engine> = new Set<Engine>()

  private constructor () {}

  public static instance (): EngineController {
    if (!this._instance) {
      this._instance = new EngineController()
    }
    return this._instance
  }

  /**
   * エンジン実行
   * @param {PiecePosition} position
   * @param {EngineCommandType} commandType
   * @param {number} commandValue
   * @returns {Promise<EngineResponseData>}
   */
  public async exec (position: PiecePosition, command: EngineCommand, option: EngineOption): Promise<EngineResponseData> {
    const engine: Engine = await this.getEnableEngine()
    if (!engine) return null
    const commandStr: string = `${EngineCommandType[command.type]} ${command.value}`
    const data: EngineData = await engine.exec(position.toSfen(), commandStr, option.toEngineValue())
    const bestMove: Move = data.bestMove ? position.sfenToMove(data.bestMove) : null
    const evaluation = position.isTurnSente ? data.evaluation : -data.evaluation
    return new EngineResponseData(data.status, evaluation, bestMove, data.isResign, data.isNyugyoku)
  }

  /**
   * 使用可能なエンジンを取得
   * synchronizedできるならしたい
   * タイミングによっては異なるスレッドが同じエンジンを使ってしまう可能性がある
   * @returns {Engine}
   */
  private async getEnableEngine (): Promise<Engine> {
    for (let engine of this.engines) {
      if (!engine.isUsing) {
        engine.isUsing = true
        return engine
      }
    }
    if (this.engines.size < EngineController.ENGINE_MAX_SIZE) {
      const engine: Engine = new Engine()
      this.engines.add(engine)
      await engine.initialize()
      return engine
    }
    return null
  }
}
