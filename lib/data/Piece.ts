import PieceType from "./enum/PieceType";
import Data from "./Data";
import Json from "./api/Json";

export default class Piece extends Data {
    constructor(private _type:PieceType, private _isSente: boolean) {
        super();
    }

    get type(): PieceType {
        return this._type;
    }

    get isSente(): boolean {
        return this._isSente;
    }

    /**
     * 同じPieceであるか
     * @param {Piece} piece
     * @returns {boolean}
     */
    public equal(piece: Piece): boolean {
        return this._type === piece._type && this.isSente && piece.isSente;
    }

    /**
     * JSONをPieceに変換
     * @param {Json} obj
     * @returns {Piece}
     */
    public static fromJSON(obj: Json): Piece {
        return new Piece(obj._type, obj._isSente);
    }

}