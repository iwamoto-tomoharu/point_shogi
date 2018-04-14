import Engine from "./Engine";
import PiecePosition from "../../../lib/data/PiecePosition";
import EngineCommandType from "../../../lib/data/enum/EngineCommandType";
import EngineResponseData from "../../../lib/data/EngineResponseData";
import Move from "../../../lib/data/Move";
import EngineData from "../data/EngineData";
import EngineCommand from "../../../lib/data/EngineCommand";
import EngineOption from "../../../lib/data/EngineOption";

export default class EngineController {
    //TODO:パラメータ化
    private static readonly ENGINE_MAX_SIZE: number = 5;
    private static _instance: EngineController;
    private engines: Engine[] = [];

    private constructor() {}

    public static instance(): EngineController {
        if(!this._instance) {
            this._instance = new EngineController();
        }
        return this._instance;
    }

    /**
     * エンジン実行
     * @param {PiecePosition} position
     * @param {EngineCommandType} commandType
     * @param {number} commandValue
     * @returns {Promise<EngineResponseData>}
     */
     public async exec(position: PiecePosition, command: EngineCommand, option: EngineOption): Promise<EngineResponseData> {
         const engine: Engine = await this.getEnableEngine();
         if(!engine) return null;
         const commandStr: string = `${EngineCommandType[command.type]} ${command.value}`;
         const data: EngineData = await engine.exec(position.toSfen(), commandStr, option.toEngineValue());
         const bestMove: Move = data.bestMove ? position.sfenToMove(data.bestMove) : null;
         return new EngineResponseData(data.status, data.evaluation, bestMove, data.isResign, data.isNyugyoku);
    }

    /**
     * 使用可能なエンジンを取得
     * @returns {Engine}
     */
    private async getEnableEngine(): Promise<Engine> {
        for(let engine of this.engines) {
            if(engine.isEnable) return engine;
        }
        if(this.engines.length < EngineController.ENGINE_MAX_SIZE){
            const engine: Engine = new Engine();
            await engine.initialize();
            this.engines.push(engine);
            return this.engines[this.engines.length - 1];
        }
        return null;
    }
}