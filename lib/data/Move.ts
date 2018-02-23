import Piece from "./Piece";
import PiecePosition from "./PiecePosition";

export default class Move {
    //移動は1〜9で表す
    //0は持ち駒
    constructor(private _fromX: number,
                private _fromY: number,
                private _toX: number,
                private _toY: number,
                private _piece: Piece) {
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
     * Objectに変換
     * JSON.stringifyで使用される
     * @returns {{[p: string]: any}}
     */
    public toJSON(): {[key: string]: any} {
        return {
            fromX: this._fromX,
            fromY: this._fromY,
            toX: this._toX,
            toY: this._toY,
            piece: this._piece.toJSON(),
        };
    }

    /**
     * ObjectをPiecePositionに変換
     * @param {{[p: string]: any}} obj
     * @returns {Move}
     */
    public static fromJSON(obj: {[key: string]: any}): Move {
        return new Move(
            obj.fromX,
            obj.fromY,
            obj.toX,
            obj.toY,
            Piece.fromJSON(obj.piece)
        );
    }
}