import AnalysisResponseData from "../../../lib/src/data/api/AnalysisResponseData";
import PiecePosition from "../../../lib/src/data/PiecePosition";
import AnalysisRequestData from "../../../lib/src/data/api/AnalysisRequestData";
import EngineOption from "../../../lib/src/data/EngineOption";
import EngineCommand from "../../../lib/src/data/EngineCommand";
import EngineCommandType from "../../../lib/src/data/enum/EngineCommandType";
import AnalysisClient from "./web_client/AnalysisClient";
import ApiName from "../../../lib/src/data/enum/ApiName";

export default class PointCalculator {
    private moveEvalList: AnalysisResponseData[] = [];

    /**
     * 解析実行してポイントを計算
     * @param {PiecePosition} position
     * @param {number} ply
     * @returns {Promise<void>}
     */
    public async execAnalysisAndCalcPoint(position: PiecePosition, ply: number): Promise<number> {
        const command: EngineCommand = new EngineCommand(EngineCommandType.nodes, 100000);
        const option: EngineOption = new EngineOption();
        option.ownBook = false;
        option.threads = 1;
        const requestData: AnalysisRequestData = new AnalysisRequestData(ApiName.analysisPoint, position, command, option);
        const analysisTransceiver: AnalysisClient = new AnalysisClient();
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
        return 10;
        const beforeResult = this.moveEvalList[ply - 1];
        const nowResult = this.moveEvalList[ply];
        if(!(beforeResult && nowResult)) return null;
        return PointCalculator.calcPointFromEval(beforeResult.evaluation, nowResult.evaluation);
    }

    private static calcPointFromEval(beforeEval: number, nowEval: number): number {
        return 10;
    }
}