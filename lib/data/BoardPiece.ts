import Piece from "./Piece";
import PieceType from "./enum/PieceType";

export default class BoardPiece extends Piece {
    constructor(
        type:PieceType,
        isSente: boolean,
        private _x: number, //1〜9
        private _y: number, //1〜9
        ) {
        super(type, isSente);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    /**
     * 同じBoardPieceか
     * @param {BoardPiece} piece
     * @returns {boolean}
     */
    public equal(piece: BoardPiece): boolean {
        if(!piece) return false;
        return super.equal(piece) && this._x === piece.x && this._y === piece.y;
    }

}
