import Piece from './Piece'
import PiecePosition from './PiecePosition'
import Json from './api/Json'

export default class Move {
  // 移動は1〜9で表す
  // 0は持ち駒
  constructor (private _fromX: number,
                private _fromY: number,
                private _toX: number,
                private _toY: number,
                private _piece: Piece) {}

  get fromX (): number {
    return this._fromX
  }

  get fromY (): number {
    return this._fromY
  }

  get toX (): number {
    return this._toX
  }

  get toY (): number {
    return this._toY
  }

  get piece (): Piece {
    return this._piece
  }

  public copy (): Move {
    return new Move(this._fromX, this._fromY, this. _toX, this._toY, new Piece(this._piece.type, this._piece.isSente))
  }

  public equal (move: Move): boolean {
    return move.fromX === this._fromX && move.fromY === this._fromY &&
            move.toX === this._toX && move.toY === this._toY && move.piece.equal(this._piece)
  }

  /**
   * 反転する
   * @returns {Move}
   */
  public reverse (): Move {
    return new Move(Move.posReverse(this._fromX), Move.posReverse(this._fromY),
            Move.posReverse(this._toX), Move.posReverse(this._toY), this._piece.reverse())
  }

  /**
   * ObjectをPiecePositionに変換
   * @param {Json} obj
   * @returns {Move}
   */
  public static fromJSON (obj: Json): Move {
    return new Move(
            obj._fromX,
            obj._fromY,
            obj._toX,
            obj._toY,
            Piece.fromJSON(obj._piece)
        )
  }

  public toString (): string {
    return `${this.fromX}${this.fromY}${this.toX}${this.toY} piece:${this.piece.type} isSente:${this.piece.isSente}`
  }

  private static posReverse (pos: number): number {
    if (pos === 0) return pos
    return 10 - pos
  }

}
