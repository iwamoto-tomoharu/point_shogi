import PiecePosition from "../data/PiecePosition";
import Move from "../data/Move";
import Piece from "../data/Piece";
import PieceType from "../data/enum/PieceType";
import ShogiRule from "../ShogiRule";
import SpecHelpers from "./helpers/SpecHelpers";

describe("getLegalMoveList", () => {
    it("角", () => {
        const pPosition = new PiecePosition();
        pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
        pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
        const moves = ShogiRule.getLegalMoveList(pPosition);
        const checkMove = new Move(8, 8, 6, 6, new Piece(PieceType.kaku, true));
        expect(SpecHelpers.isContainMoves(moves, checkMove)).toBeTruthy();
    });
});