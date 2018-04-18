import Piece from "./Piece";
import CapturedPiece from "./CapturedPiece";
import Move from "./Move";
import Vector from "./Vector";
import PieceType from "./enum/PieceType";
import ShogiUtility from "../utility/ShogiUtility";
import Data from "./Data";
import Json from "./api/Json";

export default class PiecePosition extends Data {
    private static readonly SFEN_HAVE_PIECE_MAP: {[key: string]: PieceType} = {
        "P": PieceType.fu,
        "L": PieceType.kyo,
        "N": PieceType.kei,
        "S": PieceType.gin,
        "G": PieceType.kin,
        "B": PieceType.kaku,
        "R": PieceType.hisya,
    };

    private static readonly TO_SFEN_PIECE_MAP: {[key: number]: string} = {
        [PieceType.fu]: "p",
        [PieceType.kyo]: "l",
        [PieceType.kei]: "n",
        [PieceType.gin]: "s",
        [PieceType.kin]: "g",
        [PieceType.kaku]: "b",
        [PieceType.hisya]: "r",
        [PieceType.ou]: "k",
        [PieceType.to]: "+p",
        [PieceType.narikyo]: "+l",
        [PieceType.narikei]: "+n",
        [PieceType.narigin]: "+s",
        [PieceType.uma]: "+b",
        [PieceType.ryu]: "+r",
    };

    constructor(
        private _position: Piece[][] = null,
        private _capturedPieces: CapturedPiece[] = [],
        private _isTurnSente: boolean = true,
    ) {
        super();
        this._position = _position || this.initPosition();
    }

    public getPiece(x: number, y: number) :Piece {
        if(x == 0 || y == 0) return null;
        return this._position[x - 1][y - 1];
    }

    get position(): Piece[][] {
        return this._position;
    }

    get capturedPieces(): CapturedPiece[] {
        return this._capturedPieces;
    }

    get isTurnSente(): boolean {
        return this._isTurnSente;
    }

    /**
     * 一手局面を進める
     * @param {Move} move
     * @returns {PiecePosition}
     */
    public next(move: Move): PiecePosition {
        this.move(move);
        this._isTurnSente = !move.piece.isSente;
        return this;
    }

    /***
     /* 現局面から指定した指し手を進めた局面を取得
     /*/
    public getNextPosition(move: Move): PiecePosition {
        const nextPos: PiecePosition = this.copy();
        return nextPos.next(move);
    }

    /**
     * 反転させた局面を取得
     *
     * @returns {PiecePosition}
     */
    public getReverse(): PiecePosition {
        const revPieces: Piece[][] = this.initPosition();
        for(let x = 0; x < this._position.length; x++){
            for(let y = 0; y < this.position[x].length; y++){
                revPieces[8 - x][8 - y] = this._position[x][y] != null ?
                    new Piece(this._position[x][y].type, !this._position[x][y].isSente) : null;
            }
        }
        const revHavePieces: CapturedPiece[] = [];
        for(let capturedPiece of this._capturedPieces) {
            revHavePieces.push(new CapturedPiece(capturedPiece.type, !capturedPiece.isSente, capturedPiece.num));
        }

        return new PiecePosition(revPieces, revHavePieces, !this._isTurnSente);
    }

    /**
     * 指定した駒の位置を取得
     * @param piece
     * @returns {Vector[]}
     */
    public getPiecesXY(piece: Piece): Vector[] {
        const detectVectors: Vector[] = [];
        for(let x = 0; x < this._position.length; x++){
            for(let y = 0; y < this.position[x].length; y++){
                if(this._position[x][y] == null) continue;
                if(this._position[x][y].type == piece.type && this._position[x][y].isSente == piece.isSente) {
                    detectVectors.push(new Vector(x, y));
                }
            }
        }
        return detectVectors;
    }

    /**
     * SFEN形式に変換
     * @param {number} ply
     * @returns {string}
     */
    public toSfen(ply: number = 1): string {
        const color: string = this._isTurnSente ? "b" : "w";
        return `${this.toSfenBoard()} ${color} ${this.toSfenHave()} ${ply}`;
    }

    /**
     * SFEN形式の駒移動文字列をMoveに変換
     * @param sfen
     * @returns {Move}
     */
    public sfenToMove(sfen: string): Move {
        let sfenPieces: string = "";
        for(let key in PiecePosition.SFEN_HAVE_PIECE_MAP) {
            sfenPieces += key;
        }
        const check = new RegExp(`(([1-9][a-i])|([${sfenPieces}][\\*]))[1-9][a-i]\\+*`);
        if(!check.test(sfen)) throw new Error(`invalid param ${sfen}`);

        const charAry: string[] = sfen.split("");
        const beforeACharCode: number = "a".charCodeAt(0) - 1;
        let piece: Piece;
        let fromX: number;
        let fromY: number;
        const toX: number = Number(charAry[2]);
        const toY: number = charAry[3].charCodeAt(0) - beforeACharCode;
        const isHavePieceMove: boolean = charAry[1] == "*";
        const isNari: boolean = charAry[4] === "+";
        if(isHavePieceMove) {
            const pieceStr: string = charAry[0];
            const pieceType: PieceType = PiecePosition.SFEN_HAVE_PIECE_MAP[pieceStr];
            piece = new Piece(pieceType, this.isTurnSente);
            fromX = 0;
            fromY = 0;
        }else {
            fromX = Number(charAry[0]);
            fromY = charAry[1].charCodeAt(0) - beforeACharCode;
            piece = this.getPiece(fromX, fromY);
            if(isNari) piece = new Piece(ShogiUtility.nariMap()[piece.type], piece.isSente);
            if(piece === null) throw new Error(`invalid move from ${sfen}`);
        }
        return new Move(fromX, fromY, toX, toY, piece);
    }

    /**
     * Jsonに変換
     * JSON.stringifyで使用される
     * @returns {Json}
     */
    public toJSON(): Json {
        return {
            _position: this.toPostionJSON(),
            _capturedPieces: this.toHavePiecesJSON(),
            _isTurnSente: this._isTurnSente
        };
    }

    /**
     * JsonをPiecePositionに変換
     * @param {Json} obj
     * @returns {PiecePosition}
     */
    public static fromJSON(obj: Json): PiecePosition {
        return new PiecePosition(
            this.fromJSONtoPosition(obj._position),
            this.fromJSONtoHavePieces(obj._capturedPieces),
            obj._isTurnSente);
    }

    /**
     * 駒の移動
     * @param {Move} move
     */
    private move(move: Move): void {
        //TODO:動かす駒があるか

        //TODO:動かす先に自分の駒がないか

        //異動先に駒がある場合は持ち駒にする
        const nextOppPiece: Piece = this.getPiece(move.toX, move.toY);
        if(nextOppPiece != null) {
            this.setHavePiece(new Piece(ShogiUtility.getNariToNormalPiece(nextOppPiece.type), !nextOppPiece.isSente));
        }
        this.delPiece(move.fromX, move.fromY, move.piece);
        this.setPiece(move.toX, move.toY, move.piece);
    }


    /**
     * positionをJSONに変換
     * @returns {Json[][]}
     */
    private toPostionJSON(): Json[][] {
        const posObj = new Array(9);
        for(let x = 0; x < 9; x++) {
            posObj[x] = new Array(9);
            for(let y = 0; y < 9; y++) {
                posObj[x][y] = this._position[x][y] ? this._position[x][y].toJSON() : null;
            }
        }
        return posObj;
    }

    /**
     * JSONをpositionに変換
     * @param {Json[][]} posObj
     * @returns {Piece[][]}
     */
    private static fromJSONtoPosition(posObj: Json[][]): Piece[][] {
        const position: Piece[][] = new Array(9);
        for(let x = 0; x < 9; x++) {
            position[x] = new Array(9);
            for(let y = 0; y < 9; y++) {
                position[x][y] = posObj[x][y] ? new Piece(posObj[x][y]._type, posObj[x][y]._isSente) : null;
            }
        }
        return position;
    }

    /**
     * capturedPiecesをJSONに変換
     * @returns {Json[]}
     */
    private toHavePiecesJSON(): Json[] {
        const capturedPiecesObj = [];
        for(let capturedPiece of this._capturedPieces) {
            capturedPiecesObj.push(capturedPiece.toJSON());
        }
        return capturedPiecesObj;
    }

    /**
     * JSONをcapturedPiecesに変換
     * @param {Json[]} capturedPiecesObj
     * @returns {CapturedPiece[]}
     */
    private static fromJSONtoHavePieces(capturedPiecesObj: Json[]): CapturedPiece[] {
        const capturedPieces: CapturedPiece[] = [];
        for(let capturedPieceObj of capturedPiecesObj) {
            capturedPieces.push(new CapturedPiece(capturedPieceObj.type, capturedPieceObj.isSente, capturedPieceObj.num));
        }
        return capturedPieces;
    }

    /**
     * このオブジェクトをコピー
     * @returns {PiecePosition}
     */
    private copy(): PiecePosition {
        const cpyPieces: Piece[][] = this.initPosition();
        for(let x = 0; x < this._position.length; x++){
            for(let y = 0; y < this._position[x].length; y++){
                const piece: Piece = this._position[x][y];
                cpyPieces[x][y] = piece != null ? new Piece(piece.type, piece.isSente) : null;
            }
        }
        const cpyHavePieces: CapturedPiece[] = [];
        for(let capturedPiece of this._capturedPieces) {
            const cpyHavePiece: CapturedPiece = new CapturedPiece(capturedPiece.type, capturedPiece.isSente, capturedPiece.num);
            cpyHavePieces.push(cpyHavePiece);
        }
        return new PiecePosition(cpyPieces, cpyHavePieces, this._isTurnSente);
    }

    /**
     * 盤上の駒をSFEN形式に変換
     * @returns {string}
     */
    private toSfenBoard(): string {
        const sfens: string[] = [];
        for(let y = 0; y <= 8; y++) {
            let sfen: string = "";
            let emptyCount: number = 0;
            for(let x = 8; x >= 0; x--) {
                if(this._position[x][y] != null) {
                    if(emptyCount != 0) sfen += emptyCount.toString();
                    sfen += this.toSfenPiece(this._position[x][y]);
                    emptyCount = 0;
                }else {
                    emptyCount++;
                }
            }
            if(emptyCount != 0) sfen += emptyCount.toString();
            sfens.push(sfen);
        }
        return sfens.join("/");
    }

    /**
     * 持ち駒をSFEN形式に変換
     * @returns {string}
     */
    private toSfenHave(): string {
        let senteSfen: string = "";
        let goteSfen: string = "";
        for(let capturedPiece of this._capturedPieces) {
            if(capturedPiece.num == 0) continue;
            const numStr: string = capturedPiece.num == 1 ? "" : capturedPiece.num.toString();
            const pieceStr: string = `${numStr}${this.toSfenPiece(capturedPiece)}`;
            if(capturedPiece.isSente) {
                senteSfen += pieceStr;
            }else {
                goteSfen += pieceStr;
            }
        }
        if(senteSfen == "" && goteSfen == "") return "-";
        return `${senteSfen}${goteSfen}`;
    }


    /**
     * PieceをSFEN形式に変換
     * @param {Piece} piece
     * @returns {string}
     */
    private toSfenPiece(piece: Piece): string {
        const pieceSfen: string = PiecePosition.TO_SFEN_PIECE_MAP[piece.type];
        return piece.isSente ? pieceSfen.toUpperCase() : pieceSfen;
    }

    /**
     * 盤面の駒を設定
     * @param {number} x
     * @param {number} y
     * @param {Piece} piece
     */
    private setPiece(x: number, y: number, piece: Piece): void {
        if(!(1 <= x && x <= 9 && 1 <= y && y <= 9)) return ;
        if(!(piece instanceof Piece)) return ;
        this._position[x - 1][y - 1] = piece;
    }

    /**
     * 駒削除
     * @param x
     * @param y
     * @param piece
     */
    private delPiece(x: number, y: number, piece: Piece): void {
        if(x == 0 && y == 0) {
            this.delHavePiece(piece);
            return;
        }
        this._position[x - 1][y - 1] = null;
    }

    /**
     * 持ち駒削除
     * @param piece
     */
    private delHavePiece(piece: Piece): void {
        for(let i = 0; i < this._capturedPieces.length; i++) {
            if(this._capturedPieces[i].type == piece.type && this._capturedPieces[i].isSente == piece.isSente) {
                this._capturedPieces[i].num -= 1;
                if(this._capturedPieces[i].num == 0) {
                    this._capturedPieces.splice(i, 1);
                }
                return;
            }
        }
    }

    /**
     * 持ち駒を設定
     * @param {Piece} piece
     */
    private setHavePiece(piece: Piece): void {
        for(let capturedPiece of this._capturedPieces) {
            if(piece.type == capturedPiece.type && piece.isSente == capturedPiece.isSente) {
                capturedPiece.num += 1;
                return;
            }
        }
        this._capturedPieces.push(new CapturedPiece(piece.type, piece.isSente, 1));
    }

    /**
     * 駒の初期配置設定
     * @returns {Piece[][]}
     */
    private initPosition(): Piece[][] {
        const position: Piece[][] = new Array(9);
        for(let i = 0; i < position.length; i++) {
            position[i] = new Array(9);
            position[i] = position[i].map((val) => null);
        }
        position[0][0] = new Piece(PieceType.kyo, false);
        position[1][0] = new Piece(PieceType.kei, false);
        position[2][0] = new Piece(PieceType.gin, false);
        position[3][0] = new Piece(PieceType.kin, false);
        position[4][0] = new Piece(PieceType.ou, false);
        position[5][0] = new Piece(PieceType.kin, false);
        position[6][0] = new Piece(PieceType.gin, false);
        position[7][0] = new Piece(PieceType.kei, false);
        position[8][0] = new Piece(PieceType.kyo, false);
        position[1][1] = new Piece(PieceType.kaku, false);
        position[7][1] = new Piece(PieceType.hisya, false);
        position[0][2] = new Piece(PieceType.fu, false);
        position[1][2] = new Piece(PieceType.fu, false);
        position[2][2] = new Piece(PieceType.fu, false);
        position[3][2] = new Piece(PieceType.fu, false);
        position[4][2] = new Piece(PieceType.fu, false);
        position[5][2] = new Piece(PieceType.fu, false);
        position[6][2] = new Piece(PieceType.fu, false);
        position[7][2] = new Piece(PieceType.fu, false);
        position[8][2] = new Piece(PieceType.fu, false);

        position[0][8] = new Piece(PieceType.kyo, true);
        position[1][8] = new Piece(PieceType.kei, true);
        position[2][8] = new Piece(PieceType.gin, true);
        position[3][8] = new Piece(PieceType.kin, true);
        position[4][8] = new Piece(PieceType.ou, true);
        position[5][8] = new Piece(PieceType.kin, true);
        position[6][8] = new Piece(PieceType.gin, true);
        position[7][8] = new Piece(PieceType.kei, true);
        position[8][8] = new Piece(PieceType.kyo, true);
        position[1][7] = new Piece(PieceType.hisya, true);
        position[7][7] = new Piece(PieceType.kaku, true);
        position[0][6] = new Piece(PieceType.fu, true);
        position[1][6] = new Piece(PieceType.fu, true);
        position[2][6] = new Piece(PieceType.fu, true);
        position[3][6] = new Piece(PieceType.fu, true);
        position[4][6] = new Piece(PieceType.fu, true);
        position[5][6] = new Piece(PieceType.fu, true);
        position[6][6] = new Piece(PieceType.fu, true);
        position[7][6] = new Piece(PieceType.fu, true);
        position[8][6] = new Piece(PieceType.fu, true);

        return position;
    }
}