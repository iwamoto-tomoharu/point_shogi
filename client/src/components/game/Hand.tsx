import * as React from 'react'
import Props from './Props'
import CapturedPiece from '../../../../lib/src/data/CapturedPiece'
import ShogiUtility from '../../../../lib/src/utility/ShogiUtility'
import * as styles from '../scss/Hand.scss'
import PieceComponent from './PieceComponent'
import BoardPiece from '../../../../lib/src/data/BoardPiece'
import { PlayingStatus } from '../../modules/GameModule'
import Piece from '../../../../lib/src/data/Piece'

interface HandProps extends Props {
  // 自分の持ち駒か
  isMe: boolean
}

/**
 * 持ち駒
 */
export default class Hand extends React.Component<HandProps, {}> {
  public render (): React.ReactElement<HandProps> {
    const styleClass = this.props.isMe ? styles.handFrontPos : styles.handBackPos
    return (<div className={styleClass}>{this.capturedPiecesComponent()}</div>)
  }

  /**
   * 持ち駒のDOM生成
   * @returns {React.ReactElement<HandProps>[]}
   */
  private capturedPiecesComponent (): React.ReactElement<HandProps>[] {
    const isSente = this.props.value.isMeSente === this.props.isMe
    const targetPieces = Hand.selectAndSortCapturedPieces(this.props.value.position.capturedPieces, isSente)
    const components: React.ReactElement<HandProps>[] = []
    for (let i = 0; i < targetPieces.length; i++) {
      const boardPiece = new BoardPiece(targetPieces[i].type, targetPieces[i].isSente, 0, 0)
      const isSelected = boardPiece.equal(this.props.value.selectedPiece)
      let onClick
      if (isSelected) {
        onClick = () => this.props.actions.cancelSelectMyPiece()
      } else {
              // 自分の手番で自分の駒のみクリックイベント追加
        onClick = this.isAddClick(targetPieces[i]) ? () => this.props.actions.selectMyPiece(boardPiece) : null
      }
      components.push(Hand.capturedPieceComponent(targetPieces[i], isSelected, i, this.props.isMe, onClick))
    }
    return components
  }

  /**
   * 駒にクリックイベントを付与するか
   * @param {Piece} piece
   * @returns {boolean}
   */
  private isAddClick (piece: Piece): boolean {
    if (this.props.value.playingStatus === PlayingStatus.Ended) return false
    if (this.props.value.playingStatus !== PlayingStatus.Thinking) return false
    if (this.props.value.isMeSente !== piece.isSente) return false
    return true
  }

  /**
   * 1つの持ち駒のDOM生成
   * @param {CapturedPiece} capturedPiece
   * @param {boolean} isSelected
   * @param {number} index
   * @param {boolean} isFront
   * @param {() => void} clickAction
   * @returns {React.ReactElement<HandProps>}
   */
  private static capturedPieceComponent (capturedPiece: CapturedPiece, isSelected: boolean,
                                          index: number, isFront: boolean, clickAction: () => void): React.ReactElement<HandProps> {
    return (
            <div className={isFront ? styles.capturedPieceFront : styles.capturedPieceBack} key={index} onClick={clickAction}>
                {capturedPiece.num > 1 ? <div className={isFront ? styles.pieceNumFront : styles.pieceNumBack}>{capturedPiece.num}</div> : null}
                <PieceComponent piece={capturedPiece} isFront={isFront} className={isSelected ? styles.imgPieceSelected : styles.imgPieceNormal}/>
            </div>)
  }

  /**
   * 対象の駒のみ抽出しソート
   * @param {CapturedPiece[]} capturedPieces
   * @param {boolean} isSente
   * @returns {CapturedPiece[]}
   */
  private static selectAndSortCapturedPieces (capturedPieces: CapturedPiece[], isSente: boolean): CapturedPiece[] {
    const selectPieces = capturedPieces.filter((capPiece) => capPiece.num > 0 && capPiece.isSente === isSente)
    return ShogiUtility.sortCapturedPieces(selectPieces, true)
  }
}
