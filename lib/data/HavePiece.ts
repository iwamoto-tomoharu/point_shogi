import Piece from "./Piece";
import PieceType from "./enum/PieceType";
import Json from "./api/Json";

export default class HavePiece extends Piece {
    constructor(pieceType: PieceType, isSente: boolean, private _num: number = 0) {
        //TODO:成駒は表にする

        super(pieceType, isSente);
    }

    get num(): number {
        return this._num;
    }

    set num(num: number) {
        this._num = num;
    }

    /**
     * JSONをHavePieceに変換
     * @param {Json} obj
     * @returns {HavePiece}
     */
    public static fromJSON(obj: Json): HavePiece {
        const piece: Piece = super.fromJSON(obj);
        return new HavePiece(piece.type, piece.isSente, obj._num);
    }
}