import {Action} from "redux";
import Move from "../../../lib/data/Move";
import PiecePosition from "../../../lib/data/PiecePosition";
import Piece from "../../../lib/data/Piece";
import BoardPiece from "../../../lib/data/BoardPiece";

enum ActionNames {
    MovePiece   = "game/move_piece",
    SelectPiece = "game/select_piece",
    CancelPiece = "game/cancel_piece",
}

interface MoveAction extends Action {
    type: ActionNames.MovePiece;
    payload: {move: Move};
}

interface SelectPieceAction extends Action {
    type: ActionNames.SelectPiece;
    payload: {selectPiece: BoardPiece};
}

export const pieceMove = (move: Move): MoveAction => ({
    type: ActionNames.MovePiece,
    payload: {move: move}
});

export const selectPiece = (boardPiece: BoardPiece): SelectPieceAction => ({
    type: ActionNames.SelectPiece,
    payload: {selectPiece: boardPiece},
});

export interface GameState {
    position: PiecePosition;
    selectedPiece: BoardPiece;
    move: Move;
}

export type GameActions = MoveAction | SelectPieceAction;

const initialState: GameState = {
    position: new PiecePosition(),
    selectedPiece: null,
    move: null,
};

export default function reducer(state: GameState = initialState, action: Action | GameActions): GameState {
    const gameAction: GameActions = action as GameActions;
    switch (gameAction.type) {
        case ActionNames.MovePiece:
            return {
                ...state,
                position: state.position.getNextPosition(gameAction.payload.move),
                move: gameAction.payload.move,
                selectedPiece: null,
            };
        case ActionNames.SelectPiece:
            return {
                ...state,
                selectedPiece: gameAction.payload.selectPiece,
            };
         default:
             return state;
  }
}
