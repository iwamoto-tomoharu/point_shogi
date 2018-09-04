import {Action} from "redux";
import Move from "../../../lib/data/Move";
import PiecePosition from "../../../lib/data/PiecePosition";
import Piece from "../../../lib/data/Piece";
import BoardPiece from "../../../lib/data/BoardPiece";
import PointCalculator from "../model/PointCalculator";

enum ActionNames {
    Start       = "game/start",
    MovePiece   = "game/move_piece",
    SelectPiece = "game/select_piece",
    NariChoice = "game/nari_choice",
    CancelPiece = "game/cancel_piece",
    StartPointEffect = "game/start_point_effect",
    OpenResignDialog = "game/open_resign_dialog",
    Resign           = "game/resign",
}

interface StartAction extends Action {
    type: ActionNames.Start;
    payload: {isMeSente: boolean};
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

interface StartPointEffectAction extends Action {
    type: ActionNames.StartPointEffect;
    payload: {
        isStart: boolean,
        pointCalculator: PointCalculator,
        point: number,
    };
}

interface OpenResignDialogAction extends Action {
    type: ActionNames.OpenResignDialog;
    payload: {
        isOpen: boolean
    };
}

interface ResignAction extends Action {
    type: ActionNames.Resign;
}

export const gameStart = (isMeSente: boolean): StartAction => ({
   type: ActionNames.Start,
   payload: {isMeSente}
});

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
    payload: {nariChoiceMove},
});

export const pointEffectStart = (isStart: boolean,  pointCalculator: PointCalculator, point?: number): StartPointEffectAction => ({
    type: ActionNames.StartPointEffect,
    payload: {isStart, pointCalculator, point}
});

export const resignDialogOpen = (isOpen: boolean): OpenResignDialogAction => ({
    type: ActionNames.OpenResignDialog,
    payload: {isOpen}
});

export const resign = (): ResignAction => ({
    type: ActionNames.Resign,
});


export enum PlayingStatus {
    NotStarted,         //対局開始前
    Thinking,           //自分の考慮中
    SelectPiece,        //駒選択中
    ChoiceNari,         //成駒選択中
    WaitOpponentMove,   //相手の着手待ち中
    Ended,              //対局終了
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
    //棋譜
    moves: Move[];
    //ポイント
    point: {
        latestValue: number,
        calculator: PointCalculator,
    };
    //アニメーションの状態
    animation: {isStartPointEffect: boolean};
    //投了ダイアログ
    isOpenResignDialog: boolean;
}

export type GameActions =
    StartAction | MoveAction | SelectPieceAction | NariChoiceAction |
    CancelMoveAction | StartPointEffectAction | OpenResignDialogAction | ResignAction;

//stateの初期値
const initialState: GameState = {
    playingStatus: PlayingStatus.NotStarted,
    isMeSente: true,
    isMyTurn: true,
    position: new PiecePosition(),
    selectedPiece: null,
    selectedLegalMoves: [],
    nariChoiceMove: {nari: null, narazu: null},
    moves: [],
    point: {
        latestValue: null,
        calculator: new PointCalculator(),
    },
    animation: {isStartPointEffect: false},
    isOpenResignDialog: false,
};

export default function reducer(state: GameState = initialState, action: Action | GameActions): GameState {
    const gameAction: GameActions = action as GameActions;
    const selectOff: any = {
        selectedPiece: null,
        selectedLegalMoves: [],
    };
    switch (gameAction.type) {
        case ActionNames.Start:
            state = initialState;
            return {
                ...state,
                playingStatus: gameAction.payload.isMeSente ? PlayingStatus.Thinking : PlayingStatus.WaitOpponentMove,
                isMeSente: gameAction.payload.isMeSente,
                isMyTurn: gameAction.payload.isMeSente,
            };
        case ActionNames.MovePiece:
            const nextState = {
                ...state,
                ...selectOff,
                position: state.position.getNextPosition(gameAction.payload.move),
                moves: state.moves.concat([gameAction.payload.move]),
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
        case ActionNames.StartPointEffect:
            return {
                ...state,
                point: {
                    latestValue: gameAction.payload.point,
                    calculator: gameAction.payload.pointCalculator,
                },
                animation: {
                    ...state.animation,
                    isStartPointEffect: gameAction.payload.isStart
                }
            };
        case ActionNames.OpenResignDialog:
            return {
                ...state,
                isOpenResignDialog: gameAction.payload.isOpen
            };
        case ActionNames.Resign:
            return {
                ...state,
                playingStatus: PlayingStatus.Ended,
            };
         default:
             return state;
  }
}
