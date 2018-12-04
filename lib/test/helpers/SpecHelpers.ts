import Move from '../../src/data/Move'

export default class SpecHelpers {
  public static isContainMoves (moves: Move[], move: Move): boolean {
    return moves.some((m) => m.equal(move))
  }
}
