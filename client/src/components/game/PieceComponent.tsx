import * as React from 'react'
import PieceType from '../../../../lib/src/data/enum/PieceType'
import Piece from '../../../../lib/src/data/Piece'

interface PieceProps {
  piece: Piece
  isFront: boolean
  className: string
}

/**
 * 駒
 */
export default class PieceComponent extends React.Component<PieceProps, {}> {
  public render (): React.ReactElement<PieceProps> {
    const pieceName = PieceType[this.props.piece.type]
    const sengo = this.props.isFront ? 'sente' : 'gote'
    return (
            <img src={`image/game/piece/${sengo}/${pieceName}.png`}
                 className={this.props.className}
            />
    )
  }

}
