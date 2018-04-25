import PiecePosition from "../data/PiecePosition";
import Move from "../data/Move";
import Piece from "../data/Piece";
import PieceType from "../data/enum/PieceType";
import ShogiRule from "../ShogiRule";
import SpecHelpers from "./helpers/SpecHelpers";

describe("ShogiRule", () => {
    it("getLegalMoveList", () => {
        const pPosition = new PiecePosition();
        pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
        pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
        const moves = ShogiRule.getLegalMoveList(pPosition);
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 7, 7, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 6, 6, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 5, 5, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 4, 4, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 3, 3, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 2, 2, new Piece(PieceType.kaku, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 3, 3, new Piece(PieceType.uma, true)))).toBeTruthy();
        expect(SpecHelpers.isContainMoves(moves,
            new Move(8, 8, 2, 2, new Piece(PieceType.uma, true)))).toBeTruthy();
    });
});