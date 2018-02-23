import PieceType from "./enum/PieceType";

export default class Piece {
    constructor(private _type:PieceType, private _isSente: boolean) {
    }

    get type(): PieceType {
        return this._type;
    }

    get isSente(): boolean {
        return this._isSente;
    }

    /**
     * JSONに変換
     * JSON.stringifyで使用される
     * @returns {{[p: string]: any}}
     */
    public toJSON(): {[key: string]: any} {
        return {
            type: this._type,
            isSente: this._isSente
        };
    }

    /**
     * JSONをPieceに変換
     * @param {{[p: string]: any}} obj
     * @returns {Piece}
     */
    public static fromJSON(obj: {[key: string]: any}): Piece {
        return new Piece(obj.type, obj.isSente);
    }

}