import * as React from "react";
import Props from "./Props";
import Move from "../../../../lib/data/Move";
import * as styles from "../scss/Board.scss";
import BoardPiece from "../../../../lib/data/BoardPiece";
import PieceComponent from "./PieceComponent";

/**
 * 盤面
 */
export default class Board extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        return (
            <div className={styles.boardArea}>
                <img src="image/game/board.png" className={styles.imgBoard}/>
                <div className={styles.pieceArea}>
                    {this.boardPieces()}
                </div>
            </div>
        );
    }

    /**
     * 盤面の駒DOM生成
     * @returns {React.ReactElement<Props>[]}
     */
    private boardPieces(): React.ReactElement<Props>[] {
        if(this.props.value.selectedPiece === null) {
            return this.normalBoardPieces();

        }else {
            return this.selectedBoardPieces();
        }
    }

    /**
     * 通常盤面の駒DOM生成
     * @returns {React.ReactElement<Props>[]}
     */
    private normalBoardPieces(): React.ReactElement<Props>[] {
        const squaresDom: React.ReactElement<Props>[] = [];
        for(let x = 1; x <= 9; x++) {
            for (let y = 1; y <= 9; y++) {
                const piece = this.props.value.position.getPiece(x, y);
                const boardPiece: BoardPiece = piece ? new BoardPiece(piece.type, piece.isSente, x, y) : null;
                //自分の手番で自分の駒のみクリックイベント追加
                const isAddClick = this.props.value.isMyTurn && piece && this.props.value.isMeSente === piece.isSente;
                const onClick = isAddClick ? () => this.props.actions.selectMyPiece(boardPiece) : null;
                if(boardPiece) {
                    squaresDom.push(Board.piece(boardPiece, false, false, onClick));
                }
            }
        }
        return squaresDom;
    }

    /**
     * 駒選択中盤面の駒DOM生成
     * @returns {React.ReactElement<Props>[]}
     */
    private selectedBoardPieces(): React.ReactElement<Props>[] {
        const squaresDom: React.ReactElement<Props>[] = [];
        for(let x = 1; x <= 9; x++) {
            for (let y = 1; y <= 9; y++) {
                const piece = this.props.value.position.getPiece(x, y);
                const boardPiece: BoardPiece = piece ? new BoardPiece(piece.type, piece.isSente, x, y) : null;
                const move = Board.findMove(x, y, this.props.value.selectedLegalMoves);
                const isOffFilter = !move;
                const clickAction = move ? () => this.props.actions.moveMyPiece(move, false) : () => this.props.actions.cancelSelectMyPiece();
                if(boardPiece) {
                    //駒
                    const isSelected = boardPiece.equal(this.props.value.selectedPiece);
                    squaresDom.push(Board.piece(boardPiece, isSelected, isOffFilter, clickAction));
                }else {
                    squaresDom.push(Board.square(x, y, isOffFilter, clickAction, null));
                }
            }
        }
        return squaresDom;
    }

    /**
     * 1つの駒DOM生成
     * @param {BoardPiece} boardPiece
     * @param {boolean} isSelected
     * @param {boolean} isOffFilter
     * @param {() => void} clickAction
     * @returns {React.ReactElement<Props>}
     */
    private static piece(boardPiece: BoardPiece, isSelected: boolean, isOffFilter: boolean, clickAction: () => void): React.ReactElement<Props> {
        const pieceComponent = <PieceComponent piece={boardPiece} className={isSelected ? styles.imgPieceSelected : styles.imgPieceNormal}/>;
        return this.square(boardPiece.x ,boardPiece.y, isOffFilter, clickAction, pieceComponent);
    }

    /**
     * 1つのマス目DOM生成
     * @param {number} x
     * @param {number} y
     * @param {boolean} isOffFilter
     * @param {() => void} clickAction
     * @param {React.ReactElement<Props>} child
     * @returns {React.ReactElement<Props>}
     */
    private static square(x: number, y: number, isOffFilter: boolean, clickAction: () => void, child: React.ReactElement<Props>): React.ReactElement<Props> {
        //駒の位置
        const left = 10 * (9 - x) + 5;
        const top = 85 - 10 * (9 - y);
        const parentStyle = {
            left: `${left}%`,
            top: `${top}%`,
            background: `rgba(0, 0, 0, ${isOffFilter ? 0.2 : 0}`,
        };
        return (
            <div className={styles.squareArea} style={parentStyle} onClick={clickAction} key={`${x}${y}`}>
                {child}
            </div>
        );

    }

    /**
     * Moveの配列から指定の移動先のMoveを取得
     * @param {number} toX
     * @param {number} toY
     * @param {Move[]} checkMoves
     * @returns {Move}
     */
    private static findMove(toX: number, toY: number, checkMoves: Move[]): Move {
        return checkMoves.find((move) => move.toX === toX && move.toY === toY);
    }
}

