import AnalysisResponseData from '../../../lib/src/data/api/AnalysisResponseData'
import MyMath from '../../../lib/src/MyMath'
import DifficultyParam from '../data/DifficultyParam'

export default class PointCalculator {
  // 評価値を勝率に変換する時のスケーリング
  // elmoを参考にした値
  private static readonly EVAL_SCALING: number = 1 / 600

  // 難易度ごとのパラメータ定義
  // xAxisVertexX * pointPlusFuncSlope = -100 にすると最高点が100点になる
  // (1-xAxisVertexX) * pointMinusFuncSlope = -100 にすると最低点が-100点になる
  private static readonly difficultyParams: DifficultyParam[] = [
        { xAxisVertexX: 0.2, pointPlusFuncSlope: -500, pointMinusFuncSlope: -500, maxPoint: 100, minPoint: -100 },
        { xAxisVertexX: 0.1, pointPlusFuncSlope: -1000, pointMinusFuncSlope: -750, maxPoint: 100, minPoint: -100 },
        { xAxisVertexX: 0.05, pointPlusFuncSlope: -2000, pointMinusFuncSlope: -1000, maxPoint: 100, minPoint: -100 },
        { xAxisVertexX: 0.05, pointPlusFuncSlope: -1000, pointMinusFuncSlope: -5000, maxPoint: 50, minPoint: -100 }
  ]

  /**
   * 点数を計算
   * -100〜100点で表す
   * @param {AnalysisResponseData} beforeResult
   * @param {AnalysisResponseData} nowResult
   * @param {boolean} isSente
   * @param {number} difficulty
   * @returns {number}
   */
  public static calcPoint (beforeResult: AnalysisResponseData, nowResult: AnalysisResponseData, isSente: boolean, difficulty: number): number {
    if (!(beforeResult && nowResult)) return null
    const diffParam = this.difficultyParams[difficulty]
    // 最善手を指した場合は最高点
    if (beforeResult.bestMove.equal(nowResult.bestMove)) return this.getModifyPoint(diffParam.maxPoint, beforeResult.evaluation, diffParam.maxPoint, diffParam.minPoint)

    return PointCalculator.calcPointFromEval(beforeResult.evaluation, nowResult.evaluation, isSente, diffParam)
  }

  /**
   * 評価値から点数を計算
   * @param {number} beforeEval
   * @param {number} nowEval
   * @param {boolean} isSente
   * @param {DifficultyParam} diffParam
   * @returns {number}
   */
  private static calcPointFromEval (beforeEval: number, nowEval: number, isSente: boolean, diffParam: DifficultyParam): number {
    const badValue = this.calcBadValue(beforeEval, nowEval, isSente)
    const pointLinearFunc = badValue <= diffParam.xAxisVertexX ?
            MyMath.createLinearFunc(diffParam.xAxisVertexX, 0, diffParam.pointPlusFuncSlope) :
            MyMath.createLinearFunc(diffParam.xAxisVertexX, 0, diffParam.pointMinusFuncSlope)
    const linearFuncPoint = pointLinearFunc(badValue)
    return this.getModifyPoint(linearFuncPoint, beforeEval, diffParam.maxPoint, diffParam.minPoint)
  }

  /**
   * 点数を補正
   * @param {number} point
   * @param {number} beforeEval
   * @param {number} maxPoint
   * @param {number} minPoint
   * @returns {number}
   */
  private static getModifyPoint (point: number, beforeEval: number, maxPoint: number, minPoint: number): number {
    let modifyPoint = point > maxPoint ? maxPoint : point
    modifyPoint = point < minPoint ? minPoint : modifyPoint
    // 接戦の指標をかけることで、形勢接近の局面は高く、形勢の離れた局面は低くなる
    // 接戦時に好手を指す方が価値が高い
    modifyPoint *= this.closeGameIndicator(beforeEval)
    return Math.round(modifyPoint)
  }

  /**
   * 悪手値(0〜1)を計算
   * @param {number} beforeEval
   * @param {number} nowEval
   * @param {boolean} isSente
   * @returns {number}
   */
  private static calcBadValue (beforeEval: number, nowEval: number, isSente: boolean): number {
    // 評価値をシグモイド関数で勝率に変換する
    const beforeWinRate = MyMath.sigmoid(beforeEval, this.EVAL_SCALING) // 0〜1
    const nowWinRate = MyMath.sigmoid(nowEval, this.EVAL_SCALING) // 0〜1
    const rateDiff = isSente ? (beforeWinRate - nowWinRate) : (nowWinRate - beforeWinRate) // -1〜1
    // 0以下は好手なので0とする
    return rateDiff > 0 ? rateDiff : 0
  }

  /**
   * 接戦の指標 (0~1)
   * 高い方が接戦
   * @param {number} evaluation
   * @returns {number}
   */
  private static closeGameIndicator (evaluation: number): number {
    const winRate = MyMath.sigmoid(evaluation, this.EVAL_SCALING)
    return 1 - Math.abs(0.5 - winRate) * 2
  }
}
