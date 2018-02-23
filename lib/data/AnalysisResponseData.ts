import EngineResponseData from "./EngineResponseData";
import Move from "./Move";

export default class AnalysisResponseData extends EngineResponseData {

    constructor(engineData: EngineResponseData) {
        super(engineData.status, engineData.evaluation, engineData.bestMove,
              engineData.isResign, engineData.isNyugyoku);
    }

    /**
     * Objectに変換
     * JSON.stringifyで使用される
     * @returns {{[p: string]: any}}
     */
    public toJSON(): {[key: string]: any} {
        return {
            status: this._status,
            evaluation: this._evaluation,
            bestMove: this._bestMove.toJSON(),
            isResign: this._isResign,
            isNyugyoku: this._isNyugyoku,
        };
    }

    /**
     * ObjectをPiecePositionに変換
     * @param {{[p: string]: any}} obj
     * @returns {AnalysisResponseData}
     */
    public static fromJSON(obj: {[key: string]: any}): AnalysisResponseData {
        return new AnalysisResponseData(
            new EngineResponseData(
            obj.status,
            obj.evaluation,
            Move.fromJSON(obj.bestMove),
            obj.isResign,
            obj.isNyugyoku,
        ));
    }

}