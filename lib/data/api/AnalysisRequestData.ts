import PiecePosition from "../PiecePosition";
import ApiData from "./ApiData";
import ApiName from "../enum/ApiName";
import EngineCommand from "../EngineCommand";
import Json from "./Json";
import EngineOption from "../EngineOption";
import Data from "../Data";

export default class AnalysisRequestData extends Data implements ApiData {

    public readonly apiName: ApiName = ApiName.analysis;

    constructor(
        private _piecePosition: PiecePosition,
        private _engineCommand: EngineCommand,
        private _engineOption: EngineOption,
    ){super();}


    get piecePosition(): PiecePosition {
        return this._piecePosition;
    }

    get engineCommand(): EngineCommand {
        return this._engineCommand;
    }

    get engineOption(): EngineOption {
        return this._engineOption;
    }

    /**
     * ObjectをPiecePositionに変換
     * @param {Json} obj
     * @returns {AnalysisRequestData}
     */
    public static fromJSON(obj: Json): AnalysisRequestData {
        return new AnalysisRequestData(
            PiecePosition.fromJSON(obj._piecePosition),
            EngineCommand.fromJSON(obj._engineCommand),
            EngineOption.fromJSON(obj._engineOption),
        );
    }
}