import Move from "./data/Move";
import PiecePosition from "./data/PiecePosition";
import HavePiece from "./data/HavePiece";
import Piece from "./data/Piece";
import PieceType from "./data/enum/PieceType";
import ShogiUtility from "./utility/ShogiUtility";
import Direction from "./data/Direction";
import Vector from "./data/Vector";

export default class Rule {
    /**
     * 合法手であるか
     * 先手側の指し手とする
     * @param move
     * @param pPosition
     * @returns {boolean}
     */
    public static isLegalMove(move: Move, pPosition: PiecePosition): boolean {
        let legalMoves: Move[] = this.getLegalMoveList(pPosition);
        console.log(legalMoves);
        console.log(move);
        return this.isIncluedeMoves(move, legalMoves);
    }

    /**
     * 合法手リストを取得
     * @param pPosition
     * @returns {Move[]}
     */
    public static getLegalMoveList(pPosition: PiecePosition): Move[] {
        //盤面
        let boardMoves: Move[] = this.getBoardLegalMoveList(pPosition);
        //持ち駒
        let havePieceMoves: Move[] = this.getHavePieceLegalMoveList(pPosition);
        let retMoves: Move[] = boardMoves.concat(havePieceMoves);
        //自玉に相手の利きがあるものは除く
        retMoves = this.removeDirectionMatchMyKing(retMoves, pPosition);
        //飛角歩の不成は除く(合法手ではあるがほぼ不要なので)
        retMoves = this.removeHiKaFuNarazu(retMoves);
        return retMoves;
    }

    /**
     * 合法手の局面を取得
     * @param pPosition
     * @returns {PiecePosition[]}
     */
    public static getLegalPositionList(pPosition: PiecePosition): PiecePosition[] {
        let legalMoves: Move[] = this.getLegalMoveList(pPosition);
        console.debug(legalMoves);
        let legalPosList: PiecePosition[] = [];
        for(let move of legalMoves){
            legalPosList.push(pPosition.getNextPosition(move));
        }
        return legalPosList;
    }

    /**
     * 盤面の合法手リストを取得
     * @param pPosition
     * @returns {Move[]}
     */
    private static getBoardLegalMoveList(pPosition: PiecePosition): Move[] {
        let retMoves: Move[] = [];
        //盤面
        for(let x = 0; x < pPosition.position.length; x++) {
            for (let y = 0; y < pPosition.position[x].length; y++) {
                let moves: Move[] = this.getPieceLegalMoves(x, y, pPosition.position);
                if(moves == null) continue;
                retMoves = retMoves.concat(moves);
            }
        }
        return retMoves;
    }

    /**
     * 持ち駒の合法手リストを取得
     * @param pPosition
     * @returns {Move[]}
     */
    private static getHavePieceLegalMoveList(pPosition: PiecePosition): Move[] {
        let retMoves: Move[] = [];
        for(let i = 0; i < pPosition.havePieces.length; i++) {
            let moves: Move[] = this.getHavePieceLegalMoves(pPosition.havePieces[i], pPosition);
            if(moves == null) continue;
            retMoves = retMoves.concat(moves);
        }
        return retMoves;
    }

    /**
     * リストの中に指定した手が含まれているか
     * @param move
     * @param legalMoves
     * @returns {boolean}
     */
    private static isIncluedeMoves(move: Move, legalMoves: Move[]): boolean {
        for(let legalMove of legalMoves) {
            if(legalMove.fromX == move.fromX &&
                legalMove.fromY == move.fromY &&
                legalMove.toX == move.toX &&
                legalMove.toY == move.toY &&
                legalMove.piece.type == move.piece.type &&
                legalMove.piece.isSente == move.piece.isSente) {
                return true;
            }
        }
        return false;
    }

    /**
     * 持ち駒の合法手を取得
     * @param havePiece
     * @param position
     * @returns {Move[]}
     */
    private static getHavePieceLegalMoves(havePiece: HavePiece, pPosition: PiecePosition): Move[] {
        if(!havePiece.isSente) return null;
        let position: Piece[][] = pPosition.position;
        let moves: Move[] = [];
        let movePiece: Piece = new Piece(havePiece.type, havePiece.isSente);
        for(let x = 0; x < position.length; x++) {
            for(let y = 0; y < position[x].length; y++) {
                let piece: Piece = position[x][y];
                if(piece != null) continue;
                if(!this.isLegalMovePosition(y + 1, havePiece)) continue;
                if(this.isNiFuMove(x, havePiece, position)) continue;
                if(this.isUtiFuCheckmate(x + 1, y + 1, havePiece, pPosition)) continue;

                moves.push(new Move(0, 0, x + 1, y + 1, movePiece));
            }
        }
        return moves;
    }

    /**
     * 移動できない位置のMoveではないか
     * @param toY(1〜9)
     * @param piece
     * @returns {boolean}
     */
    private static isLegalMovePosition(toY: number, piece: Piece): boolean {
        if(!ShogiUtility.isFuKeKy(piece.type)) return true;
        if(piece.type == PieceType.fu || piece.type == PieceType.kyo) {
            //一段目は不可
            return (toY > 1 && piece.isSente) || (toY < 9 && !piece.isSente);
        }
        if(piece.type == PieceType.kei) {
            //一段目二段目は不可
            return (toY > 2 && piece.isSente) || (toY < 8 && !piece.isSente);
        }
    }

    /**
     * 二歩であるか
     * @param x
     * @param havePiece
     * @param position
     * @returns {boolean}
     */
    private static isNiFuMove(x: number, havePiece: HavePiece, position: Piece[][]): boolean {
        if(havePiece.type != PieceType.fu) return false;
        for(let y = 0; y < position[x].length; y++) {
            let piece: Piece = position[x][y];
            if(piece == null) continue;
            if(piece.isSente && piece.type == PieceType.fu) return true;
        }
        return false;
    }

    /**
     * 打ち歩詰めであるか
     * @param toX
     * @param toY
     * @param havePiece
     * @param pPosition
     * @returns {boolean}
     */
    private static isUtiFuCheckmate(toX: number, toY: number, havePiece: HavePiece, pPosition: PiecePosition): boolean {
        if(havePiece.type != PieceType.fu) return false;
        let move: Move = new Move(0 , 0, toX, toY, new Piece(havePiece.type, havePiece.isSente));
        let nextPosition: PiecePosition = pPosition.getNextPosition(move).getReverse();
        //次の局面で合法手が存在しない場合は詰みなので打ち歩と判断する
        let legalMoves: Move[] = this.getBoardLegalMoveList(nextPosition);
        legalMoves = this.removeDirectionMatchMyKing(legalMoves, nextPosition);
        let isUtiFu: boolean = legalMoves.length == 0;
        return isUtiFu;
    }


    /**
     * 盤上の指定した位置の駒の合法手を取得
     * @param x
     * @param y
     * @param position
     * @returns {Move[]}
     */
    private static getPieceLegalMoves(x: number, y: number, position: Piece[][]): Move[] {
        let piece: Piece = position[x][y];
        if(piece == null) return null;
        if(!piece.isSente) return null;
        let dirKeys: number[] = Direction.dirKeys(piece.type);
        if(ShogiUtility.isHiKaKy(piece.type)) {
            return this.getHiKaKyoPieceLegalMoves(x, y, dirKeys, position);
        }else if(ShogiUtility.isUmRy(piece.type)) {
            let hiKaPieceType: PieceType = ShogiUtility.umRyReverse(piece.type);
            let dirHiKaKeys: number[] = Direction.dirKeys(hiKaPieceType);
            let moves1: Move[] = this.getHiKaKyoPieceLegalMoves(x, y, dirHiKaKeys, position);
            let moves2: Move[] = this.getNormalPieceLegalMoves(x, y, dirKeys, position);
            return moves1.concat(moves2);
        }else {
            return this.getNormalPieceLegalMoves(x, y, dirKeys, position);
        }
    }

    /**
     * 通常の駒の合法手を取得
     * @param x
     * @param y
     * @param dirKeys
     * @param position
     * @returns {any}
     */
    private static getNormalPieceLegalMoves(x: number, y: number, dirKeys: number[], position: Piece[][]): Move[] {
        let piece: Piece = position[x][y];
        let moves: Move[] = [];
        for(let key of dirKeys) {
            let directions: {x: number, y: number}[] = Direction.dirValue[key];
            for(let dir of directions) {
                //駒の利きを取得
                let toX: number = x + dir.x;
                let toY: number = y + dir.y;
                //範囲外は無視
                if(0 > toX || toX >= 9 || 0 > toY || toY >= 9) continue;
                // 自分の駒がある場合無視
                let toPiece: Piece = position[toX][toY];
                if(toPiece != null && toPiece.isSente) continue;
                let move: Move = new Move(x + 1, y + 1, toX + 1, toY + 1, piece);
                //移動先は合法か
                if(this.isLegalMovePosition(move.toY, move.piece)) {
                    //合法手として追加
                    moves.push(move);
                }
                //成りも追加
                if(this.isLegalNari(move)) {
                    moves.push(this.getNariMove(move));
                }
            }
        }
        return moves;
    }

    /**
     * 飛角香の合法手を取得
     * @param x
     * @param y
     * @param dirKeys
     * @param position
     * @returns {any}
     */
    private static getHiKaKyoPieceLegalMoves(x: number, y: number, dirKeys: number[], position: Piece[][]): Move[] {
        let piece: Piece = position[x][y];
        let moves: Move[] = [];
        for(let key of dirKeys) {
            let directions: {x: number, y: number}[] = Direction.dirValue[key];
            for(let dir of directions) {
                //駒の利きを取得
                let toX: number = x + dir.x;
                let toY: number = y + dir.y;
                //範囲外は終了
                if(0 > toX || toX >= 9 || 0 > toY || toY >= 9) break;
                // 自分の駒がある場合終了
                let toPiece: Piece = position[toX][toY];
                if(toPiece != null && toPiece.isSente) break;
                let move: Move = new Move(x + 1, y + 1, toX + 1, toY + 1, piece);
                //移動先は合法か
                if(this.isLegalMovePosition(move.toY, move.piece)) {
                    //合法手として追加
                    moves.push(move);
                }
                //成りも追加
                if(this.isLegalNari(move)) {
                    moves.push(this.getNariMove(move));
                }
                // 相手の駒がある場合終了
                if(toPiece != null) break;
            }
        }
        return moves;
    }

    /**
     * 成りが合法手の移動であるか
     * @param move
     */
    private static isLegalNari(move: Move): boolean {
        let nariMap: {[key: number]: number} = ShogiUtility.nariMap();
        if(!nariMap.hasOwnProperty(move.piece.type.toString())) return false;
        if((move.toY > 3 && move.piece.isSente) ||
            (move.toY < 7 && !move.piece.isSente)) return false;
        return true;
    }

    /**
     * 成りの移動を取得
     * @param move
     * @returns {null}
     */
    private static getNariMove(move: Move): Move {
        let nariMap: {[key: number]: number} = ShogiUtility.nariMap();
        if(!nariMap.hasOwnProperty(move.piece.type.toString())) return null;
        let nariPieceType: PieceType = nariMap[move.piece.type];
        let nariPiece: Piece = new Piece(nariPieceType, move.piece.isSente);
        return new Move(move.fromX, move.fromY, move.toX, move.toY, nariPiece);
    }

    /**
     * 自玉に相手の利きがあるMoveを除く
     * @param moves
     */
    private static removeDirectionMatchMyKing(moves: Move[], pPosition: PiecePosition): Move[] {

        //移動後の配置を取得
        let nextPositions: PiecePosition[] = [];
        for(let i = 0; i < moves.length; i++){
            nextPositions.push(pPosition.getNextPosition(moves[i]).getReverse());
        }

        let removedMoves: Move[] = [];
        for(let i = 0; i < nextPositions.length; i++){
            //移動後の配置から盤上の合法手を取得
            let legalNextMoves: Move[] = this.getBoardLegalMoveList(nextPositions[i]);
            //合法手の中に玉を取る手がある場合は自玉に相手の利きがあるMoveと判断し除外する
            let kingVectors: Vector[] = nextPositions[i].getPiecesXY(new Piece(PieceType.ou, false));
            let myKingXY: Vector = kingVectors[0];
            if(!this.isDetectMoveXY(myKingXY, legalNextMoves)) {
                removedMoves.push(moves[i].copy());
            }
        }
        return removedMoves;
    }

    /**
     * 指定した位置に移動するMoveが存在するか
     * @param xy
     * @param moves
     */
    private static isDetectMoveXY(xy: Vector, moves: Move[]): boolean {
        for(let move of moves){
            if(move.toX == xy.x + 1 && move.toY == xy.y + 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 飛角歩の不成をMoveから除く
     * @param moves
     */
    private static removeHiKaFuNarazu(moves: Move[]): Move[] {
        let removedMoves: Move[] = [];

        for(let move of moves) {
            if(ShogiUtility.isHiKaFu(move.piece.type)) {
                //不成と成りが存在する場合、不成の方を追加しない
                if(this.isMatchBoardFromTo(move, moves)) {
                    continue;
                }
            }
            removedMoves.push(move.copy());
        }
        return removedMoves;
    }

    /**
     * 同じ箇所に移動するmoveが存在するか(持ち駒は含めない)
     * @param move
     * @param moves
     */
    private static isMatchBoardFromTo(searchMove: Move, moves: Move[]): boolean {
        if(searchMove.fromX == 0 && searchMove.fromY == 0) return false;

        let detectCount = 0;
        for(let move of moves) {
            if(move.fromX == searchMove.fromX && move.fromY && searchMove.fromY &&
            move.toX == searchMove.toX && move.toY == searchMove.toY) {
                detectCount++;
            }
        }
        return detectCount >= 2;
    }

}