import PiecePosition from "./PiecePosition";
import EngineCommandType from "./enum/EngineCommandType";

export default class AnalysisRequestData {

    constructor(
        private _piecePosition: PiecePosition,
        private _engineCommandType: EngineCommandType,
        private _engineCommandValue: number,
    ){}


    get piecePosition(): PiecePosition {
        return this._piecePosition;
    }

    get engineCommandType(): EngineCommandType {
        return this._engineCommandType;
    }

    get engineCommandValue(): number {
        return this._engineCommandValue;
    }

    /**
     * Objectに変換
     * JSON.stringifyで使用される
     * @returns {{[p: string]: any}}
     */
    public toJSON(): {[key: string]: any} {
        return {
            piecePosition: this._piecePosition.toJSON(),
            engineCommandType: this._engineCommandType,
            engineCommandValue: this._engineCommandValue,
        };
    }

    /**
     * ObjectをPiecePositionに変換
     * @param {{[p: string]: any}} obj
     * @returns {AnalysisRequestData}
     */
    public static fromJSON(obj: {[key: string]: any}): AnalysisRequestData {
        return new AnalysisRequestData(
            PiecePosition.fromJSON(obj.piecePosition),
            obj.engineCommandType,
            obj.engineCommandValue,
        );
    }
}