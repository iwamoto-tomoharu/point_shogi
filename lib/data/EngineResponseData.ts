import Move from "./Move";
import Data from "./Data";

export default class EngineResponseData extends Data {
    constructor(
        protected _status: boolean,
        protected _evaluation: number,
        protected _bestMove: Move,
        protected _isResign: boolean,
        protected _isNyugyoku: boolean,
    ){super();}


    get status(): boolean {
        return this._status;
    }

    get evaluation(): number {
        return this._evaluation;
    }

    get bestMove(): Move {
        return this._bestMove;
    }

    get isResign(): boolean {
        return this._isResign;
    }

    get isNyugyoku(): boolean {
        return this._isNyugyoku;
    }

}