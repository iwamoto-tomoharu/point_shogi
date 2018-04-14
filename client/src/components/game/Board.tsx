import * as React from "react";
import Props from "./Props";
import Move from "../../../../lib/data/Move";
import * as styles from "../css/Board.scss";
import PieceType from "../../../../lib/data/enum/PieceType";
import Piece from "../../../../lib/data/Piece";
import PiecePosition from "../../../../lib/data/PiecePosition";
import BoardPiece from "../../../../lib/data/BoardPiece";

export class Board extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        return (
            <div className={styles.boardArea}>
                <img src="image/game/board.png" className={styles.imgBoard}/>
                <div className={styles.pieceArea}>
                    {this.boardPieces(this.props.value.position, this.props.value.selectedPiece)}
                </div>
                <button onClick={() =>
                    this.props.actions.moveMyPiece(new Move(7, 7, 7, 6, new Piece(PieceType.fu, true)))}>76歩</button>
                <button onClick={() =>
                    this.props.actions.moveMyPiece(new Move(2, 7, 2, 6, new Piece(PieceType.fu, true)))}>26歩</button>
            </div>
        );
    }

    /**
     * 盤上の駒DOM生成
     * @param {PiecePosition} piecePosition
     * @param {BoardPiece} selectedPiece
     * @returns {React.ReactElement<Props>[]}
     */
    private boardPieces(piecePosition: PiecePosition, selectedPiece: BoardPiece): React.ReactElement<Props>[] {
        const piecesDom: React.ReactElement<Props>[] = [];
        for(let x = 1; x <= 9; x++) {
            for(let y = 1; y <= 9; y++) {
                const piece = piecePosition.getPiece(x, y);
                if(!piece) continue;
                const boardPiece = new BoardPiece(x, y, piece);
                const isSelected = Board.isSelectedPiece(boardPiece, selectedPiece);
                piecesDom.push(this.piece(boardPiece, isSelected));
            }
        }
        return piecesDom;
    }

    // private boardSquares(piecePosition: PiecePosition, selectedPiece: BoardPiece): React.ReactElement<Props>[] {
    //     if(selectedPiece === null) {
    //         return this.normalBoardSquares(piecePosition);
    //
    //     }else {
    //         return this.selectedBoardSquares(piecePosition, selectedPiece);
    //     }
    // }

    // /**
    //  * 通常盤面のマス目DOM生成
    //  * @param {PiecePosition} piecePosition
    //  * @returns {React.ReactElement<Props>[]}
    //  */
    // private normalBoardSquares(piecePosition: PiecePosition): React.ReactElement<Props>[] {
    //
    // }
    //
    // /**
    //  * 駒選択中盤面のマス目DOM生成
    //  * @param {PiecePosition} piecePosition
    //  * @param {BoardPiece} selectedPiece
    //  * @returns {React.ReactElement<Props>[]}
    //  */
    // private selectedBoardSquares(piecePosition: PiecePosition, selectedPiece: BoardPiece): React.ReactElement<Props>[] {
    //
    // }

    /**
     * 1つの駒DOM生成
     * @param {BoardPiece} boardPiece
     * @param {boolean} isSelected 選択中であるか
     * @returns {React.ReactElement<Props>}
     */
    private piece(boardPiece: BoardPiece, isSelected: boolean): React.ReactElement<Props> {
        //駒の位置
        const leftBase = 9.95 * (9 - boardPiece.x);
        const topBase = 10 * (9 - boardPiece.y);
        const normalPos = {left: leftBase + 5, top: 85 - topBase}; //通常
        const selectedPos = {left: normalPos.left - 1.5, top: normalPos.top - 1.5}; //選択中
        const pos = isSelected ? selectedPos: normalPos;
        const style = {
            left: `${pos.left}%`,
            top: `${pos.top}%`,
        };
        const pieceName = PieceType[boardPiece.piece.type];
        const sengo = boardPiece.piece.isSente ? "sente" : "gote";
        return (
            <img src={`image/game/piece/${sengo}/${pieceName}.png`}
                 className={styles.imgPiece}
                 style={style}
                 key={`${boardPiece.x}${boardPiece.y}${pieceName}`}
                 onClick={() => this.props.actions.selectMyPiece(boardPiece)}
            />
        );
    }



    /**
     * 選択中の駒であるか
     * @param {BoardPiece} boardPiece
     * @param {BoardPiece} selectedPiece
     * @returns {boolean}
     */
    private static isSelectedPiece(boardPiece: BoardPiece, selectedPiece: BoardPiece): boolean {
        if(selectedPiece == null) return false;
        return (
            boardPiece.x === selectedPiece.x &&
            boardPiece.y === selectedPiece.y &&
            boardPiece.piece.equal(selectedPiece.piece)
        );
    }


}

