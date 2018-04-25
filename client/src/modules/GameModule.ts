import {Action} from "redux";
import Move from "../../../lib/data/Move";
import PiecePosition from "../../../lib/data/PiecePosition";
import Piece from "../../../lib/data/Piece";
import BoardPiece from "../../../lib/data/BoardPiece";

enum ActionNames {
    MovePiece   = "game/move_piece",
    SelectPiece = "game/select_piece",
    NariChoice = "game/nari_choice",
    CancelPiece = "game/cancel_piece",
}

interface MoveAction extends Action {
    type: ActionNames.MovePiece;
    payload: {move: Move};
}

interface CancelMoveAction extends Action {
    type: ActionNames.CancelPiece;
}

interface SelectPieceAction extends Action {
    type: ActionNames.SelectPiece;
    payload: {
        selectPiece: BoardPiece,
        selectedLegalMoves: Move[],
    };
}
interface NariChoiceAction extends Action {
    type: ActionNames.NariChoice;
    payload: {
        nariChoiceMove: {nari: Move, narazu: Move},
    };
}

export const pieceMove = (move: Move): MoveAction => ({
    type: ActionNames.MovePiece,
    payload: {move}
});

export const cancelMove = (): CancelMoveAction => ({
    type: ActionNames.CancelPiece,
});

export const selectPiece = (boardPiece: BoardPiece, selectedLegalMoves: Move[]): SelectPieceAction => ({
    type: ActionNames.SelectPiece,
    payload: {selectPiece: boardPiece, selectedLegalMoves},
});

export const nariChoice = (nariChoiceMove: NariChoiceMove): NariChoiceAction => ({
    type: ActionNames.NariChoice,
    payload: {nariChoiceMove: nariChoiceMove},
});

export enum PlayingStatus {
    Thinking,           //自分の考慮中
    SelectPiece,        //駒選択中
    ChoiceNari,         //成駒選択中
    WaitOpponentMove,   //相手の着手待ち中
}

export interface NariChoiceMove {
    nari: Move;
    narazu: Move;
}

export interface GameState {
    playingStatus: PlayingStatus;
    //自分の先後
    isMeSente: boolean;
    //自分の手番か
    isMyTurn: boolean;
    //現在の盤面
    position: PiecePosition;
    //選択中の駒
    selectedPiece: BoardPiece;
    //選択中の駒の合法手
    selectedLegalMoves: Move[];
    //成り選択の駒移動
    nariChoiceMove: NariChoiceMove;
    //駒移動
    move: Move;
}

export type GameActions = MoveAction | SelectPieceAction | NariChoiceAction | CancelMoveAction;

const initialState: GameState = {
    playingStatus: PlayingStatus.Thinking,
    isMeSente: true,
    position: new PiecePosition(),
    isMyTurn: true,
    selectedPiece: null,
    selectedLegalMoves: [],
    nariChoiceMove: {nari: null, narazu: null},
    move: null,
};

export default function reducer(state: GameState = initialState, action: Action | GameActions): GameState {
    const gameAction: GameActions = action as GameActions;
    const selectOff: any = {
        selectedPiece: null,
        selectedLegalMoves: [],
    };
    switch (gameAction.type) {
        case ActionNames.MovePiece:
            const nextState = {
                ...state,
                ...selectOff,
                position: state.position.getNextPosition(gameAction.payload.move),
                move: gameAction.payload.move,
            };
            nextState.isMyTurn = nextState.position.isTurnSente === nextState.isMeSente;
            nextState.playingStatus = nextState.isMyTurn ? PlayingStatus.Thinking : PlayingStatus.WaitOpponentMove;
            return nextState;
        case ActionNames.SelectPiece:
            return {
                ...state,
                playingStatus: PlayingStatus.SelectPiece,
                selectedPiece: gameAction.payload.selectPiece,
                selectedLegalMoves: gameAction.payload.selectedLegalMoves,
            };
        case ActionNames.NariChoice:
            return {
                ...state,
                playingStatus: PlayingStatus.ChoiceNari,
                nariChoiceMove: gameAction.payload.nariChoiceMove,
            };

        case ActionNames.CancelPiece:
            return {
                ...state,
                ...selectOff,
                playingStatus: PlayingStatus.Thinking,
            };
         default:
             return state;
  }
}
