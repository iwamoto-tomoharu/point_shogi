import * as React from 'react'
import Props from './Props'
import Move from '../../../../lib/src/data/Move'
import * as styles from '../scss/Board.scss'
import BoardPiece from '../../../../lib/src/data/BoardPiece'
import PieceComponent from './PieceComponent'
import { PlayingStatus } from '../../modules/GameModule'
import Piece from '../../../../lib/src/data/Piece'
import PointText from './PointText'
import { MyDialog } from '../util/MyDialog'

/**
 * 盤面
 */
export default class Board extends React.Component<Props, {}> {
  public render (): React.ReactElement<Props> {
    return (
            <div className={styles.boardArea}>
                <img src='image/game/board.png' className={styles.imgBoard}/>
                <div className={styles.pieceArea}>
                    {this.boardPieces()}
                    {this.pointText()}
                </div>
                {this.props.value.playingStatus === PlayingStatus.ChoiceNari ? this.choiceNariPiece() : null}
            </div>
    )
  }

    /**
     * 盤面の駒
     * @returns {React.ReactElement<Props>[]}
     */
  private boardPieces (): React.ReactElement<Props>[] {
    if (this.props.value.playingStatus === PlayingStatus.SelectPiece) {
      return this.selectedBoardPieces()
    } else {
      return this.normalBoardPieces()
    }
  }

    /**
     * 指し手の点数
     * @returns {React.ReactElement<Props>}
     */
  private pointText (): React.ReactElement<Props> {
    const pointComponent = <PointText isStart={this.props.value.animation.isStartPointEffect}
                                          point={this.props.value.point.latestValue}
                                          endPointEffectCallback={() => this.props.actions.endPointEffect()}/>
    const move = this.props.value.point.latestMove
    if (move != null) {
      return Board.pointSquare(move.toX, move.toY, move.piece.isSente, pointComponent)
    } else {
      return <div>{pointComponent}</div>
    }
  }

    /**
     * 通常盤面の駒
     * @returns {React.ReactElement<Props>[]}
     */
  private normalBoardPieces (): React.ReactElement<Props>[] {
    const squaresDom: React.ReactElement<Props>[] = []
    for (let x = 1; x <= 9; x++) {
      for (let y = 1; y <= 9; y++) {
        const piece = this.props.value.position.getPiece(x, y)
        const boardPiece: BoardPiece = piece ? new BoardPiece(piece.type, piece.isSente, x, y) : null
                // 自分の手番で自分の駒のみクリックイベント追加
        const onClick = this.isAddClick(piece) ? () => this.props.actions.selectMyPiece(boardPiece) : null
        if (boardPiece) {
          squaresDom.push(Board.piece(boardPiece, this.props.value.isMeSente, false, false, onClick))
        }
      }
    }
    return squaresDom
  }

    /**
     * 駒選択中盤面の駒
     * @returns {React.ReactElement<Props>[]}
     */
  private selectedBoardPieces (): React.ReactElement<Props>[] {
    const squaresDom: React.ReactElement<Props>[] = []
    for (let x = 1; x <= 9; x++) {
      for (let y = 1; y <= 9; y++) {
        const piece = this.props.value.position.getPiece(x, y)
        const boardPiece: BoardPiece = piece ? new BoardPiece(piece.type, piece.isSente, x, y) : null
        const move = Board.findMove(x, y, this.props.value.selectedLegalMoves)
        const isOffFilter = !move
        const clickAction = move ? () => this.props.actions.moveMyPiece(move, false) :
                    () => this.props.actions.cancelSelectMyPiece()
        if (boardPiece) {
                    // 駒
          const isSelected = boardPiece.equal(this.props.value.selectedPiece)
          squaresDom.push(Board.piece(boardPiece, this.props.value.isMeSente, isSelected, isOffFilter, clickAction))
        } else {
          squaresDom.push(Board.pieceSquare(x, y, this.props.value.isMeSente, isOffFilter, clickAction, null))
        }
      }
    }
    return squaresDom
  }

    /**
     * 成り選択ダイアログ
     * @returns {React.ReactElement<Props>}
     */
  private choiceNariPiece (): React.ReactElement<Props> {
    return <MyDialog isOpen={true}
                         title={'成りますか？'}
                         handleYes={() => this.props.actions.moveMyPiece(this.props.value.nariChoiceMove.nari, true)}
                         handleNo={() => this.props.actions.moveMyPiece(this.props.value.nariChoiceMove.narazu, true)}
                         handleClose={() => this.props.actions.cancelSelectMyPiece()}/>

  }

    /**
     * 1つの駒DOM生成
     * @param {BoardPiece} boardPiece
     * @param {boolean} isMeSente
     * @param {boolean} isSelected
     * @param {boolean} isOffFilter
     * @param {() => void} clickAction
     * @returns {React.ReactElement<Props>}
     */
  private static piece (boardPiece: BoardPiece, isMeSente: boolean, isSelected: boolean,
                         isOffFilter: boolean, clickAction: () => void): React.ReactElement<Props> {
    const isFront = boardPiece.isSente && isMeSente || !boardPiece.isSente && !isMeSente
    const pieceComponent = <PieceComponent piece={boardPiece} isFront={isFront}
                                               className={isSelected ? styles.imgPieceSelected : styles.imgPieceNormal}/>
    return this.pieceSquare(boardPiece.x ,boardPiece.y, isMeSente, isOffFilter, clickAction, pieceComponent)
  }

    /**
     * 1つのマス目DOM生成
     * @param {number} x
     * @param {number} y
     * @param {boolean} isMeSente
     * @param {boolean} isOffFilter
     * @param {() => void} clickAction
     * @param {React.ReactElement<Props>} child
     * @returns {React.ReactElement<Props>}
     */
  private static pieceSquare (x: number, y: number, isMeSente: boolean, isOffFilter: boolean,
                          clickAction: () => void, child: React.ReactElement<Props>): React.ReactElement<Props> {
        // 駒の位置
    const boardX = isMeSente ? x : 10 - x
    const boardY = isMeSente ? y : 10 - y
    const parentStyle = this.squareStyle(boardX, boardY, isOffFilter)
    return (
            <div className={styles.pieceSquareArea} style={parentStyle} onClick={clickAction} key={`${boardX}${boardY}`}>
                {child}
            </div>
    )
  }

  private static pointSquare (x: number, y: number, isMeSente: boolean, child: React.ReactElement<Props>): React.ReactElement<Props> {
        // 駒の位置
    const boardX = isMeSente ? x : 10 - x
    const boardY = isMeSente ? y : 10 - y
    const parentStyle = this.squareStyle(boardX, boardY, false)
    return (
            <div className={styles.pointSquareArea} style={parentStyle}>
                {child}
            </div>
    )

  }

    /**
     * 1つのマス目のstyle
     * @param {number} boardX
     * @param {number} boardY
     * @param {boolean} isOffFilter
     * @returns {{[p: string]: string}}
     */
  private static squareStyle (boardX: number, boardY: number, isOffFilter: boolean): {[key: string]: string} {
    const left = 10 * (9 - boardX) + 5
    const top = 85 - 10 * (9 - boardY)
    const parentStyle = {
      left: `${left}%`,
      top: `${top}%`,
      background: `rgba(0, 0, 0, ${isOffFilter ? 0.2 : 0}`
    }
    return parentStyle
  }

    /**
     * 駒にクリックイベントを付与するか
     * @param {Piece} piece
     * @returns {boolean}
     */
  private isAddClick (piece: Piece): boolean {
    if (this.props.value.playingStatus === PlayingStatus.Ended) return false
    if (this.props.value.playingStatus !== PlayingStatus.Thinking) return false
    if (!piece) return false
    if (this.props.value.isMeSente !== piece.isSente) return false
    return true
  }

    /**
     * Moveの配列から指定の移動先のMoveを取得
     * @param {number} toX
     * @param {number} toY
     * @param {Move[]} checkMoves
     * @returns {Move}
     */
  private static findMove (toX: number, toY: number, checkMoves: Move[]): Move {
    return checkMoves.find((move) => move.toX === toX && move.toY === toY)
  }
}
