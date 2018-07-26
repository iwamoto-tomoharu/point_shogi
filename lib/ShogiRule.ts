import Move from "./data/Move";
import PiecePosition from "./data/PiecePosition";
import HavePiece from "./data/CapturedPiece";
import Piece from "./data/Piece";
import PieceType from "./data/enum/PieceType";
import ShogiUtility from "./utility/ShogiUtility";
import Direction from "./data/Direction";
import Vector from "./data/Vector";
import InvalidMoveError from "./error/InvalidMoveError";

export default class ShogiRule {
    /**
     * 合法手であるか
     * @param move
     * @param pPosition
     * @returns {boolean}
     */
    public static isLegalMove(move: Move, pPosition: PiecePosition): boolean {
        const legalMoves: Move[] = this.getLegalMoveList(pPosition);
        return this.isIncluedeMoves(move, legalMoves);
    }

    /**
     * 合法手リストを取得
     * @param pPosition
     * @returns {Move[]}
     */
    public static getLegalMoveList(pPosition: PiecePosition): Move[] {
        //後手番の時は盤面を反転する
        const pos = pPosition.isTurnSente ? pPosition : pPosition.getReverse();
        //盤面
        const boardMoves: Move[] = this.getBoardLegalMoveList(pos);
        //持ち駒
        const capturedPieceMoves: Move[] = this.getHavePieceLegalMoveList(pos);
        let moves: Move[] = boardMoves.concat(capturedPieceMoves);
        //自玉に相手の利きがあるものは除く
        moves = this.removeDirectionMatchMyKing(moves, pos);
        // //飛角歩の不成は除く(合法手ではあるがほぼ不要なので)
        // retMoves = this.removeHiKaFuNarazu(moves);

        //
        const retMoves = pPosition.isTurnSente ? moves : moves.map((move) => move.reverse());
        return retMoves;
    }

    /**
     * 合法手の局面を取得
     * @param pPosition
     * @returns {PiecePosition[]}
     */
    public static getLegalPositionList(pPosition: PiecePosition): PiecePosition[] {
        const legalMoves: Move[] = this.getLegalMoveList(pPosition);
        const legalPosList: PiecePosition[] = [];
        for(let move of legalMoves){
            legalPosList.push(pPosition.getNextPosition(move));
        }
        return legalPosList;
    }

    /**
     * 成りチェックが必要なMoveか
     * @param {PiecePosition} pPosition
     * @param {Move} move
     * @returns {boolean}
     */
    public static isNeedChoiceNari(pPosition: PiecePosition, move: Move): boolean {
        const originPiece = pPosition.getPiece(move.fromX, move.fromY);
        if(!originPiece) return false;
        //moveが成り駒の可能性があるので移動元の駒に変換する
        const checkMove = new Move(move.fromX, move.fromY, move.toX, move.toY, originPiece);
        return this.isLegalNari(checkMove);
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
            for(let y = 0; y < pPosition.position[x].length; y++) {
                const moves: Move[] = this.getPieceLegalMoves(x, y, pPosition.position);
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
        for(let i = 0; i < pPosition.capturedPieces.length; i++) {
            const moves: Move[] = this.getHavePieceLegalMoves(pPosition.capturedPieces[i], pPosition);
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
     * @param capturedPiece
     * @param position
     * @returns {Move[]}
     */
    private static getHavePieceLegalMoves(capturedPiece: HavePiece, pPosition: PiecePosition): Move[] {
        if(!capturedPiece.isSente) return null;
        const position: Piece[][] = pPosition.position;
        const moves: Move[] = [];
        const movePiece: Piece = new Piece(capturedPiece.type, capturedPiece.isSente);
        for(let x = 0; x < position.length; x++) {
            for(let y = 0; y < position[x].length; y++) {
                const piece: Piece = position[x][y];
                if(piece != null) continue;
                if(!this.isLegalMovePosition(y + 1, capturedPiece)) continue;
                if(this.isNiFuMove(x, capturedPiece, position)) continue;
                if(this.isUtiFuCheckmate(x + 1, y + 1, capturedPiece, pPosition)) continue;

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
     * @param capturedPiece
     * @param position
     * @returns {boolean}
     */
    private static isNiFuMove(x: number, capturedPiece: HavePiece, position: Piece[][]): boolean {
        if(capturedPiece.type != PieceType.fu) return false;
        for(let y = 0; y < position[x].length; y++) {
            const piece: Piece = position[x][y];
            if(piece == null) continue;
            if(piece.isSente && piece.type == PieceType.fu) return true;
        }
        return false;
    }

    /**
     * 打ち歩詰めであるか
     * @param toX
     * @param toY
     * @param capturedPiece
     * @param pPosition
     * @returns {boolean}
     */
    private static isUtiFuCheckmate(toX: number, toY: number, capturedPiece: HavePiece, pPosition: PiecePosition): boolean {
        if(capturedPiece.type != PieceType.fu) return false;
        const move: Move = new Move(0 , 0, toX, toY, new Piece(capturedPiece.type, capturedPiece.isSente));
        try {
            const nextPosition: PiecePosition = pPosition.getNextPosition(move).getReverse();
            //次の局面で合法手が存在しない場合は詰みなので打ち歩と判断する
            let legalMoves: Move[] = this.getBoardLegalMoveList(nextPosition);
            legalMoves = this.removeDirectionMatchMyKing(legalMoves, nextPosition);
            const isUtiFu: boolean = legalMoves.length == 0;
            return isUtiFu;
        } catch (err) {
            //getNextPositionで不正なmoveになる可能性があるのでキャッチする
            if (err instanceof InvalidMoveError) {
                return false;
            }
            throw err;
        }
    }

    /**
     * 成りが合法手の移動であるか
     * @param move
     */
    private static isLegalNari(move: Move): boolean {
        const nariMap: {[key: number]: number} = ShogiUtility.nariMap;
        if(!nariMap.hasOwnProperty(move.piece.type.toString())) return false;
        if(move.piece.isSente) {
            if(move.toY <= 3) return true;
            if(move.fromX <= 3) return true;
        }else {
            if(move.toY >= 7) return true;
            if(move.fromX >= 7) return true;
        }
        return false;
    }

    /**
     * 盤上の指定した位置の駒の合法手を取得
     * @param x
     * @param y
     * @param position
     * @returns {Move[]}
     */
    private static getPieceLegalMoves(x: number, y: number, position: Piece[][]): Move[] {
        const piece: Piece = position[x][y];
        if(piece == null) return null;
        if(!piece.isSente) return null;
        const dirKeys: number[] = Direction.dirKeys(piece.type);
        if(ShogiUtility.isHiKaKy(piece.type)) {
            return this.getHiKaKyoPieceLegalMoves(x, y, dirKeys, position);
        }else if(ShogiUtility.isUmRy(piece.type)) {
            const hiKaPieceType: PieceType = ShogiUtility.umRyReverse(piece.type);
            const dirHiKaKeys: number[] = Direction.dirKeys(hiKaPieceType);
            const moves1: Move[] = this.getHiKaKyoPieceLegalMoves(x, y, dirHiKaKeys, position);
            const moves2: Move[] = this.getNormalPieceLegalMoves(x, y, dirKeys, position);
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
        const piece: Piece = position[x][y];
        const moves: Move[] = [];
        for(let key of dirKeys) {
            const directions: {x: number, y: number}[] = Direction.dirValue[key];
            for(let dir of directions) {
                //駒の利きを取得
                const toX: number = x + dir.x;
                const toY: number = y + dir.y;
                //範囲外は無視
                if(0 > toX || toX >= 9 || 0 > toY || toY >= 9) continue;
                // 自分の駒がある場合無視
                const toPiece: Piece = position[toX][toY];
                if(toPiece != null && toPiece.isSente) continue;
                const move: Move = new Move(x + 1, y + 1, toX + 1, toY + 1, piece);
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
        const piece: Piece = position[x][y];
        const moves: Move[] = [];
        for(let key of dirKeys) {
            const directions: {x: number, y: number}[] = Direction.dirValue[key];
            for(let dir of directions) {
                //駒の利きを取得
                const toX: number = x + dir.x;
                const toY: number = y + dir.y;
                //範囲外は終了
                if(0 > toX || toX >= 9 || 0 > toY || toY >= 9) break;
                // 自分の駒がある場合終了
                const toPiece: Piece = position[toX][toY];
                if(toPiece != null && toPiece.isSente) break;
                const move: Move = new Move(x + 1, y + 1, toX + 1, toY + 1, piece);
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
     * 成りの移動を取得
     * @param move
     * @returns {null}
     */
    private static getNariMove(move: Move): Move {
        const nariMap: {[key: number]: number} = ShogiUtility.nariMap;
        if(!nariMap.hasOwnProperty(move.piece.type.toString())) return null;
        const nariPieceType: PieceType = nariMap[move.piece.type];
        const nariPiece: Piece = new Piece(nariPieceType, move.piece.isSente);
        return new Move(move.fromX, move.fromY, move.toX, move.toY, nariPiece);
    }

    /**
     * 自玉に相手の利きがあるMoveを除く
     * @param moves
     */
    private static removeDirectionMatchMyKing(moves: Move[], pPosition: PiecePosition): Move[] {

        //移動後の配置を取得
        const nextPositions: PiecePosition[] = [];
        for(let move of moves){
            nextPositions.push(pPosition.getNextPosition(move).getReverse());
        }

        const removedMoves: Move[] = [];
        for(let i = 0; i < nextPositions.length; i++){
            //移動後の配置から盤上の合法手を取得
            const legalNextMoves: Move[] = this.getBoardLegalMoveList(nextPositions[i]);
            //合法手の中に玉を取る手がある場合は自玉に相手の利きがあるMoveと判断し除外する
            const kingVectors: Vector[] = nextPositions[i].getPiecesXY(new Piece(PieceType.ou, false));
            const myKingXY: Vector = kingVectors[0];
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
        const remainMoves: Move[] = [];
        for(let move of moves) {
            if(ShogiUtility.isHiKaFu(move.piece.type)) {
                //不成と成りが存在する場合、不成の方を追加しない
                if(this.isMatchBoardFromTo(move, moves)) {
                    continue;
                }
            }
            remainMoves.push(move.copy());
        }
        return remainMoves;
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
            if(move.fromX === searchMove.fromX && move.fromY === searchMove.fromY &&
            move.toX === searchMove.toX && move.toY === searchMove.toY) {
                detectCount++;
            }
        }
        return detectCount >= 2;
    }

}