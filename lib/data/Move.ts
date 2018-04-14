import Piece from "./Piece";
import PiecePosition from "./PiecePosition";
import Json from "./api/Json";
import Data from "./Data";

export default class Move extends Data {
    //移動は1〜9で表す
    //0は持ち駒
    constructor(private _fromX: number,
                private _fromY: number,
                private _toX: number,
                private _toY: number,
                private _piece: Piece) {
        super();
    }

    get fromX(): number {
        return this._fromX;
    }

    get fromY(): number {
        return this._fromY;
    }

    get toX(): number {
        return this._toX;
    }

    get toY(): number {
        return this._toY;
    }

    get piece(): Piece {
        return this._piece;
    }

    public copy(): Move {
        return new Move(this._fromX, this._fromY, this. _toX, this._toY, new Piece(this._piece.type, this._piece.isSente));
    }

    /**
     * ObjectをPiecePositionに変換
     * @param {Json} obj
     * @returns {Move}
     */
    public static fromJSON(obj: Json): Move {
        return new Move(
            obj._fromX,
            obj._fromY,
            obj._toX,
            obj._toY,
            Piece.fromJSON(obj._piece)
        );
    }
}