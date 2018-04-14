import Data from "./Data";
import Piece from "./Piece";

export default class BoardPiece extends Data {
    constructor(
        private _x: number, //1〜9
        private _y: number, //1〜9
        private _piece: Piece) {
        super();
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get piece(): Piece {
        return this._piece;
    }
}
