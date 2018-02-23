import Piece from "./Piece";
import PieceType from "./enum/PieceType";

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
     * JSONに変換
     * JSON.stringifyで使用される
     * @returns {{[p: string]: any}}
     */
    public toJSON(): {[key: string]: any} {
        let obj = super.toJSON();
        obj.num = this._num;
        return obj;
    }

    /**
     * JSONをHavePieceに変換
     * @param {{[p: string]: any}} obj
     * @returns {HavePiece}
     */
    public static fromJSON(obj: {[key: string]: any}): HavePiece {
        let piece: Piece = super.fromJSON(obj);
        return new HavePiece(piece.type, piece.isSente, obj.num);
    }
}