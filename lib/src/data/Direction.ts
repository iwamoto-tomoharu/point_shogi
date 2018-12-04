import PieceType from './enum/PieceType'
import DirPieceType from './enum/DirPieceType'

export default class Direction {

  public static dirKeys (pieceType: PieceType): number[] {
    return {
      [PieceType.fu]: [DirPieceType.fu],
      [PieceType.kyo]: [DirPieceType.kyo],
      [PieceType.kei]: [DirPieceType.kei],
      [PieceType.gin]: [DirPieceType.gin],
      [PieceType.kin]: [DirPieceType.kin],
      [PieceType.ou]: [DirPieceType.ou],
      [PieceType.kaku]: [DirPieceType.kaku_1, DirPieceType.kaku_2, DirPieceType.kaku_3, DirPieceType.kaku_4],
      [PieceType.hisya]: [DirPieceType.hisya_1, DirPieceType.hisya_2, DirPieceType.hisya_3, DirPieceType.hisya_4],
      [PieceType.to]: [DirPieceType.to],
      [PieceType.narikyo]: [DirPieceType.narikyo],
      [PieceType.narikei]: [DirPieceType.narikei],
      [PieceType.narigin]: [DirPieceType.narigin],
      [PieceType.uma]: [DirPieceType.uma],
      [PieceType.ryu]: [DirPieceType.ryu]
    }[pieceType]
  }

  public static get dirValue (): {[key: number]: {x: number, y: number}[]} {
    return {
      [DirPieceType.fu]: [
                { x: 0, y: -1 }
      ],
      [DirPieceType.kyo]: [
                { x: 0, y: -1 },
                { x: 0, y: -2 },
                { x: 0, y: -3 },
                { x: 0, y: -4 },
                { x: 0, y: -5 },
                { x: 0, y: -6 },
                { x: 0, y: -7 },
                { x: 0, y: -8 }
      ],
      [DirPieceType.kei]: [
                { x:  1, y: -2 },
                { x: -1, y: -2 }
      ],
      [DirPieceType.gin]: [
                { x:  1, y: -1 },
                { x:  1, y:  1 },
                { x:  0, y: -1 },
                { x: -1, y: -1 },
                { x: -1, y:  1 }
      ],
      [DirPieceType.kin]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.ou]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  1, y:  1 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 },
                { x: -1, y:  1 }
      ],
      [DirPieceType.to]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.narikyo]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.narikei]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.narigin]: [
                { x:  1, y: -1 },
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y: -1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.uma]: [
                { x:  1, y:  0 },
                { x:  0, y: -1 },
                { x:  0, y:  1 },
                { x: -1, y:  0 }
      ],
      [DirPieceType.ryu]: [
                { x:  1, y:  1 },
                { x:  1, y: -1 },
                { x: -1, y:  1 },
                { x: -1, y: -1 }
      ],
      [DirPieceType.kaku_1]: [
                { x: -1, y: -1 },
                { x: -2, y: -2 },
                { x: -3, y: -3 },
                { x: -4, y: -4 },
                { x: -5, y: -5 },
                { x: -6, y: -6 },
                { x: -7, y: -7 },
                { x: -8, y: -8 }
      ],
      [DirPieceType.kaku_2]: [
                { x: -1, y:  1 },
                { x: -2, y:  2 },
                { x: -3, y:  3 },
                { x: -4, y:  4 },
                { x: -5, y:  5 },
                { x: -6, y:  6 },
                { x: -7, y:  7 },
                { x: -8, y:  8 }
      ],
      [DirPieceType.kaku_3]: [
                { x:  1, y: -1 },
                { x:  2, y: -2 },
                { x:  3, y: -3 },
                { x:  4, y: -4 },
                { x:  5, y: -5 },
                { x:  6, y: -6 },
                { x:  7, y: -7 },
                { x:  8, y: -8 }
      ],
      [DirPieceType.kaku_4]: [
                { x:  1, y:  1 },
                { x:  2, y:  2 },
                { x:  3, y:  3 },
                { x:  4, y:  4 },
                { x:  5, y:  5 },
                { x:  6, y:  6 },
                { x:  7, y:  7 },
                { x:  8, y:  8 }
      ],
      [DirPieceType.hisya_1]: [
                { x: -1, y:  0 },
                { x: -2, y:  0 },
                { x: -3, y:  0 },
                { x: -4, y:  0 },
                { x: -5, y:  0 },
                { x: -6, y:  0 },
                { x: -7, y:  0 },
                { x: -8, y:  0 }
      ],
      [DirPieceType.hisya_2]: [
                { x:  1, y:  0 },
                { x:  2, y:  0 },
                { x:  3, y:  0 },
                { x:  4, y:  0 },
                { x:  5, y:  0 },
                { x:  6, y:  0 },
                { x:  7, y:  0 },
                { x:  8, y:  0 }
      ],
      [DirPieceType.hisya_3]: [
                { x:  0, y: -1 },
                { x:  0, y: -2 },
                { x:  0, y: -3 },
                { x:  0, y: -4 },
                { x:  0, y: -5 },
                { x:  0, y: -6 },
                { x:  0, y: -7 },
                { x:  0, y: -8 }
      ],
      [DirPieceType.hisya_4]: [
                { x:  0, y:  1 },
                { x:  0, y:  2 },
                { x:  0, y:  3 },
                { x:  0, y:  4 },
                { x:  0, y:  5 },
                { x:  0, y:  6 },
                { x:  0, y:  7 },
                { x:  0, y:  8 }
      ]
    }
  }
}
