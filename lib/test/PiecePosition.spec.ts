import PiecePosition from "../data/PiecePosition";
import Move from "../data/Move";
import Piece from "../data/Piece";
import PieceType from "../data/enum/PieceType";
import ShogiRule from "../ShogiRule";
import SpecHelpers from "./helpers/SpecHelpers";

describe("PiecePosition", () => {
    it("next", () => {
        const pPosition = new PiecePosition();
        pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
        pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
        expect(pPosition.getPiece(7, 6)).toBeDefined();
        expect(pPosition.getPiece(7, 7)).toBeNull();
        expect(pPosition.getPiece(3, 4)).toBeDefined();
        expect(pPosition.getPiece(3, 3)).toBeNull();
        expect(pPosition.capturedPieces.length).toEqual(0);
    });

    it("toJSON/fromJSON", () => {
        const pPosition = new PiecePosition();
        pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
        pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
        pPosition.next(new Move(8, 8, 2, 2, new Piece( PieceType.uma, true)));
        const cnvPosition = PiecePosition.fromJSON(pPosition);
        expect(cnvPosition.getPiece(7, 6)).toBeDefined();
        expect(cnvPosition.getPiece(7, 7)).toBeNull();
        expect(cnvPosition.getPiece(3, 4)).toBeDefined();
        expect(cnvPosition.getPiece(3, 3)).toBeNull();
        expect(cnvPosition.capturedPieces[0].isSente).toBeTruthy();
        expect(cnvPosition.capturedPieces[0].type).toEqual(PieceType.kaku);

    });

    it("toSfen", () => {
        const pPosition = new PiecePosition();
        pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
        pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
        pPosition.next(new Move(8, 8, 2, 2, new Piece( PieceType.uma, true)));
        expect(pPosition.toSfen()).toEqual("lnsgkgsnl/1r5+B1/pppppp1pp/6p2/9/2P6/PP1PPPPPP/7R1/LNSGKGSNL w B 1");
    });
});