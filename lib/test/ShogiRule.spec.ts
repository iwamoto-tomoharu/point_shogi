import PiecePosition from "../data/PiecePosition";
import Move from "../data/Move";
import Piece from "../data/Piece";
import PieceType from "../data/enum/PieceType";
import ShogiRule from "../ShogiRule";
import SpecHelpers from "./helpers/SpecHelpers";

describe("ShogiRule", () => {
    describe("getLegalMoveList", () => {
        let pPosition;
        beforeEach(() => {
            pPosition = new PiecePosition();
        });
        describe("76歩,34歩", () => {
            beforeEach(() => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
            });
            it("角", () => {
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
    });
    describe("isNeedChoiceNari", () => {
        let pPosition;
        beforeEach(() => {
            pPosition = new PiecePosition();
        });
        describe("自陣から敵陣", () => {
            it("成り選択必要(先手)", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(8, 8, 2, 2, new Piece(PieceType.kaku, true)));
                expect(isNeed).toBeTruthy();
            });
            it("成り選択必要(後手)", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                pPosition.next(new Move(2, 7, 2, 6, new Piece( PieceType.fu, true)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(2, 2, 8, 8, new Piece(PieceType.kaku, false)));
                expect(isNeed).toBeTruthy();
            });
        });
        describe("敵陣から自陣", () => {
            it("成り選択必要(先手)", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                pPosition.next(new Move(8, 8, 2, 2, new Piece( PieceType.kaku, true)));
                pPosition.next(new Move(8, 3, 8, 4, new Piece( PieceType.fu, false)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(2, 2, 8, 8, new Piece(PieceType.uma, true)));
                expect(isNeed).toBeTruthy();
            });
            it("成り選択必要(後手)", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                pPosition.next(new Move(2, 7, 2, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(2, 2, 8, 8, new Piece( PieceType.kaku, false)));
                pPosition.next(new Move(2, 6, 2, 5, new Piece( PieceType.fu, true)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(8, 8, 4, 4, new Piece(PieceType.uma, false)));
                expect(isNeed).toBeTruthy();
            });
        });
        describe("自陣内の移動", () => {
            it("成り選択不要", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(2, 7, 2, 6, new Piece(PieceType.fu, true)));
                expect(isNeed).toBeFalsy();
            });
        });
        describe("成り駒の移動", () => {
            it("成り選択不要", () => {
                pPosition.next(new Move(7, 7, 7, 6, new Piece( PieceType.fu, true)));
                pPosition.next(new Move(3, 3, 3, 4, new Piece( PieceType.fu, false)));
                pPosition.next(new Move(8, 8, 2, 2, new Piece( PieceType.uma, true)));
                pPosition.next(new Move(8, 3, 8, 4, new Piece( PieceType.fu, false)));
                const isNeed = ShogiRule.isNeedChoiceNari(pPosition, new Move(2, 2, 1, 1, new Piece(PieceType.uma, true)));
                expect(isNeed).toBeFalsy();
            });
        });

    });
});