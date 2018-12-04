import PieceType from './enum/PieceType'
import Json from './api/Json'

export default class Piece {
  constructor (private _type: PieceType, private _isSente: boolean) {}

  get type (): PieceType {
    return this._type
  }

  get isSente (): boolean {
    return this._isSente
  }

    /**
     * 同じPieceであるか
     * @param {Piece} piece
     * @returns {boolean}
     */
  public equal (piece: Piece): boolean {
    if (!piece) return false
    return this._type === piece._type && this.isSente === piece.isSente
  }

    /**
     * 反転する
     * @returns {Piece}
     */
  public reverse (): Piece {
    return new Piece(this._type, !this._isSente)
  }

    /**
     * JSONをPieceに変換
     * @param {Json} obj
     * @returns {Piece}
     */
  public static fromJSON (obj: Json): Piece {
    return new Piece(obj._type, obj._isSente)
  }

}
