import AnalysisResponseData from "../../../lib/data/api/AnalysisResponseData";
import PiecePosition from "../../../lib/data/PiecePosition";
import AnalysisRequestData from "../../../lib/data/api/AnalysisRequestData";
import EngineOption from "../../../lib/data/EngineOption";
import EngineCommand from "../../../lib/data/EngineCommand";
import EngineCommandType from "../../../lib/data/enum/EngineCommandType";
import AnalysisTransceiver from "./web_client/AnalysisTransceiver";
import ApiName from "../../../lib/data/enum/ApiName";

export default class PointCalculator {
    private moveEvalList: AnalysisResponseData[] = [];

    /**
     * 解析実行してポイントを計算
     * @param {PiecePosition} position
     * @param {number} ply
     * @returns {Promise<void>}
     */
    public async execAnalysisAndCalcPoint(position: PiecePosition, ply: number): Promise<number> {
        const command: EngineCommand = new EngineCommand(EngineCommandType.byoyomi, 1);
        const option: EngineOption = new EngineOption();
        option.ownBook = false;
        const requestData: AnalysisRequestData = new AnalysisRequestData(ApiName.analysisPoint, position, command, option);
        const analysisTransceiver: AnalysisTransceiver = new AnalysisTransceiver();
        const data: AnalysisResponseData = await analysisTransceiver.analyze(requestData);
        this.moveEvalList[ply] = data;
        return this.calcPoint(ply);
    }

    /**
     * 点数を計算
     * 指定した局面の指し手を-100〜100点で表す
     * @param {number} ply
     * @returns {number}
     */
    private calcPoint(ply: number): number {
        const beforeResult = this.moveEvalList[ply - 1];
        const nowResult = this.moveEvalList[ply];
        if(!(beforeResult && nowResult)) return null;
        return PointCalculator.calcPointFromEval(beforeResult.evaluation, nowResult.evaluation);
    }

    private static calcPointFromEval(beforeEval: number, nowEval: number): number {
        return 10;
    }
}