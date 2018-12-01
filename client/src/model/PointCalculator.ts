import AnalysisResponseData from "../../../lib/src/data/api/AnalysisResponseData";
import MyMath from "../../../lib/src/MyMath";
import DifficultyParam from "../data/DifficultyParam";

export default class PointCalculator {
    private static readonly EVAL_SCALING: number = 1 / 600;

    //難易度ごとのパラメータ定義
    // xAxisVertexX * pointPlusFuncSlope = -100 にすると最高点が100点になる
    // (1-xAxisVertexX) * pointMinusFuncSlope = -100 にすると最低点が-100点になる
    private static readonly difficultyParams: DifficultyParam[] = [
        {xAxisVertexX: 0.2, pointPlusFuncSlope: -500, pointMinusFuncSlope: -500},
        {xAxisVertexX: 0.1, pointPlusFuncSlope: -1000, pointMinusFuncSlope: -600},
    ];

    /**
     * 点数を計算
     * -100〜100点で表す
     * @param {AnalysisResponseData} beforeResult
     * @param {AnalysisResponseData} nowResult
     * @param {boolean} isSente
     * @param {number} difficulty
     * @returns {number}
     */
    public static calcPoint(beforeResult: AnalysisResponseData, nowResult: AnalysisResponseData, isSente: boolean, difficulty: number): number {
        if(!(beforeResult && nowResult)) return null;
        //最善手を指した場合は最高点
        if(beforeResult.bestMove.equal(nowResult.bestMove)) return this.getModifyPoint(100, beforeResult.evaluation);

        return PointCalculator.calcPointFromEval(beforeResult.evaluation, nowResult.evaluation, isSente, difficulty);
    }

    /**
     * 評価値から点数を計算
     * @param {number} beforeEval
     * @param {number} nowEval
     * @param {boolean} isSente
     * @param {number} difficulty
     * @returns {number}
     */
    private static calcPointFromEval(beforeEval: number, nowEval: number, isSente: boolean, difficulty: number): number {
        const badValue = this.calcBadValue(beforeEval, nowEval, isSente);
        const diffParam = this.difficultyParams[difficulty];
        const pointLinearFunc = badValue <= diffParam.xAxisVertexX ?
            MyMath.createLinearFunc(diffParam.xAxisVertexX, 0, diffParam.pointPlusFuncSlope) :
            MyMath.createLinearFunc(diffParam.xAxisVertexX, 0, diffParam.pointMinusFuncSlope);
        const linearFuncPoint = pointLinearFunc(badValue);
        return this.getModifyPoint(linearFuncPoint, beforeEval);
    }


    /**
     * 点数を補正
     * @param {number} point
     * @param {number} beforeEval
     * @returns {number}
     */
    private static getModifyPoint(point: number, beforeEval: number): number {
        let modifyPoint = point > 100 ? 100 : point;
        modifyPoint = point < -100 ? -100 : modifyPoint;
        //接戦の指標をかけることで、形勢接近の局面は高く、形勢の離れた局面は低くなる
        //接戦時に好手を指す方が価値が高い
        modifyPoint *= this.closeGameIndicator(beforeEval);
        return Math.round(modifyPoint);
    }

    /**
     * 悪手値(0〜1)を計算
     * @param {number} beforeEval
     * @param {number} nowEval
     * @param {boolean} isSente
     * @returns {number}
     */
    private static calcBadValue(beforeEval: number, nowEval: number, isSente: boolean): number {
        const beforeWinRate = MyMath.sigmoid(beforeEval, this.EVAL_SCALING); //0〜1
        const nowWinRate = MyMath.sigmoid(nowEval, this.EVAL_SCALING); //0〜1
        const rateDiff = isSente ? (beforeWinRate - nowWinRate) : (nowWinRate - beforeWinRate); //-1〜1
        //0以下は好手なので0とする
        return rateDiff > 0 ? rateDiff : 0;
    }

    /**
     * 接戦の指標 (0~1)
     * 高い方が接戦
     * @param {number} evaluation
     * @returns {number}
     */
    private static closeGameIndicator(evaluation: number): number {
        const winRate = MyMath.sigmoid(evaluation, this.EVAL_SCALING);
        return 1 - Math.abs(0.5 - winRate) * 2;
    }
}