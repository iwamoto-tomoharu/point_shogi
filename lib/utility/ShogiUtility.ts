import PieceType from "../data/enum/PieceType";
import Piece from "../data/Piece";
import Move from "../data/Move";

export default class ShogiUtility {
    public static nariMap(): {[key: number]: number} {
        return {
            [PieceType.fu]:    PieceType.to,
            [PieceType.kyo]:   PieceType.narikyo,
            [PieceType.kei]:   PieceType.narikei,
            [PieceType.gin]:   PieceType.narigin,
            [PieceType.kaku]:  PieceType.uma,
            [PieceType.hisya]: PieceType.ryu,
        };
    }

    public static pieceStrMap(): {[key: number]: string} {
        return {
            [PieceType.fu]:     "歩",
        [PieceType.kyo]:        "香",
        [PieceType.kei]:        "桂",
        [PieceType.gin]:        "銀",
        [PieceType.kin]:        "金",
        [PieceType.ou]:         "玉",
        [PieceType.kaku]:       "角",
        [PieceType.hisya]:      "飛",
        [PieceType.to]:         "と",
        [PieceType.narikyo]:    "杏",
        [PieceType.narikei]:    "圭",
        [PieceType.narigin]:    "全",
        [PieceType.uma]:        "馬",
        [PieceType.ryu]:        "竜",

        };
    }

    public static pieceCsaMap(): {[key: number]: string} {
        return {
            [PieceType.fu]:         "FU",
            [PieceType.kyo]:        "KY",
            [PieceType.kei]:        "KE",
            [PieceType.gin]:        "GI",
            [PieceType.kin]:        "KI",
            [PieceType.ou]:         "OU",
            [PieceType.kaku]:       "KA",
            [PieceType.hisya]:      "HI",
            [PieceType.to]:         "TO",
            [PieceType.narikyo]:    "NY",
            [PieceType.narikei]:    "NK",
            [PieceType.narigin]:    "NG",
            [PieceType.uma]:        "UM",
            [PieceType.ryu]:        "RY",

        };
    }

    /**
     * 成駒を不成の駒に変換
     * @param nariPieceType
     * @returns {any}
     */
    public static getNariToNormalPiece(nariPieceType: PieceType): PieceType {
        const map: {[key: number]: number} = this.nariMap();
        for(let pieceType in map) {
            if(map[pieceType] == nariPieceType) {
                return <PieceType>Number(pieceType);
            }
        }
        return nariPieceType;
    }

    public static getPieceTypeFromCsa(csaPiece: string): PieceType {
        const map: {[key: number]: string} = this.pieceCsaMap();
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
        const sengoStr: string = moveCsa[0];
        const fromStr: string = moveCsa.substr(1, 2);
        const toStr: string = moveCsa.substr(3, 2);
        const peiceStr: string = moveCsa.substr(5, 2);
        const isSente: boolean = sengoStr == "+";
        const fromX: number = Number(fromStr[0]);
        const fromY: number = Number(fromStr[1]);
        const toX: number = Number(toStr[0]);
        const toY: number = Number(toStr[1]);
        const pieceType: PieceType = ShogiUtility.getPieceTypeFromCsa(peiceStr);
        const piece: Piece = new Piece(pieceType, isSente);
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
        const umRyMap: {[key: number]: PieceType} = {};
        umRyMap[PieceType.uma] = PieceType.kaku;
        umRyMap[PieceType.ryu] = PieceType.hisya;
        return umRyMap[pieceType];
    }
}