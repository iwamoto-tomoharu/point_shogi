import PieceType from "../data/enum/PieceType";
import Piece from "../data/Piece";
import Move from "../data/Move";

export default class ShogiUtility {
    public static nariMap(): {[key: number]: number} {
        let map: {[key: number]: number} = {};
        map[PieceType.fu] = PieceType.to;
        map[PieceType.kyo] = PieceType.narikyo;
        map[PieceType.kei] = PieceType.narikei;
        map[PieceType.gin] = PieceType.narigin;
        map[PieceType.kaku] = PieceType.uma;
        map[PieceType.hisya] = PieceType.ryu;
        return map;
    }

    public static pieceStrMap(): {[key: number]: string} {
        let map: {[key: number]: string} = {};
        map[PieceType.fu] =         "歩";
        map[PieceType.kyo] =        "香";
        map[PieceType.kei] =        "桂";
        map[PieceType.gin] =        "銀";
        map[PieceType.kin] =        "金";
        map[PieceType.ou] =         "玉";
        map[PieceType.kaku] =       "角";
        map[PieceType.hisya] =      "飛";
        map[PieceType.to] =         "と";
        map[PieceType.narikyo] =    "杏";
        map[PieceType.narikei] =    "圭";
        map[PieceType.narigin] =    "全";
        map[PieceType.uma] =        "馬";
        map[PieceType.ryu] =        "竜";
        return map;
    }

    public static pieceCsaMap(): {[key: number]: string} {
        let map: {[key: number]: string} = {};
        map[PieceType.fu] =         "FU";
        map[PieceType.kyo] =        "KY";
        map[PieceType.kei] =        "KE";
        map[PieceType.gin] =        "GI";
        map[PieceType.kin] =        "KI";
        map[PieceType.ou] =         "OU";
        map[PieceType.kaku] =       "KA";
        map[PieceType.hisya] =      "HI";
        map[PieceType.to] =         "TO";
        map[PieceType.narikyo] =    "NY";
        map[PieceType.narikei] =    "NK";
        map[PieceType.narigin] =    "NG";
        map[PieceType.uma] =        "UM";
        map[PieceType.ryu] =        "RY";
        return map;
    }

    /**
     * 成駒を不成の駒に変換
     * @param nariPieceType
     * @returns {any}
     */
    public static getNariToNormalPiece(nariPieceType: PieceType): PieceType {
        let map: {[key: number]: number} = this.nariMap();
        for(let pieceType in map) {
            if(map[pieceType] == nariPieceType) {
                return <PieceType>Number(pieceType);
            }
        }
        return nariPieceType;
    }

    public static getPieceTypeFromCsa(csaPiece: string): PieceType {
        let map: {[key: number]: string} = this.pieceCsaMap();
        for(let pieceType in map) {
            if(map[pieceType] == csaPiece) {
                return <PieceType>Number(pieceType);
            }
        }
        return null;
    }

    /**
     * CSAをMoveに変換
     * @param moveCsa ex.-3334FU, 0055KA
     */
    public static csaToMove(moveCsa: string): Move {
        let sengoStr: string = moveCsa[0];
        let fromStr: string = moveCsa.substr(1, 2);
        let toStr: string = moveCsa.substr(3, 2);
        let peiceStr: string = moveCsa.substr(5, 2);
        let isSente: boolean = sengoStr == "+";
        let fromX: number = Number(fromStr[0]);
        let fromY: number = Number(fromStr[1]);
        let toX: number = Number(toStr[0]);
        let toY: number = Number(toStr[1]);
        let pieceType: PieceType = ShogiUtility.getPieceTypeFromCsa(peiceStr);
        let piece: Piece = new Piece(pieceType, isSente);
        return new Move(fromX, fromY, toX, toY, piece);
    }

    public static isHiKaKy(pieceType: PieceType): boolean {
        return [PieceType.hisya, PieceType.kaku, PieceType.kyo].indexOf(pieceType) != -1;
    }

    public static isUmRy(pieceType: PieceType): boolean {
        return [PieceType.uma, PieceType.ryu].indexOf(pieceType) != -1;
    }

    public static isFuKeKy(pieceType: PieceType): boolean {
        return [PieceType.fu, PieceType.kei, PieceType.kyo].indexOf(pieceType) != -1;
    }

    public static isHiKaFu (pieceType: PieceType): boolean {
        return [PieceType.hisya, PieceType.kaku, PieceType.fu].indexOf(pieceType) != -1;
    }


    public static umRyReverse(pieceType: PieceType): PieceType {
        let umRyMap: {[key: number]: PieceType} = {};
        umRyMap[PieceType.uma] = PieceType.kaku;
        umRyMap[PieceType.ryu] = PieceType.hisya;
        return umRyMap[pieceType];
    }
}