import {ReduxAction, ReduxState} from "../Store";
import {
    cancelMove,
    gameStart,
    GameState,
    nariChoice,
    NariChoiceMove,
    pieceMove,
    selectPiece
} from "../modules/GameModule";
import Move from "../../../lib/data/Move";
import EngineCommand from "../../../lib/data/EngineCommand";
import EngineCommandType from "../../../lib/data/enum/EngineCommandType";
import EngineOption from "../../../lib/data/EngineOption";
import AnalysisResponseData from "../../../lib/data/api/AnalysisResponseData";
import AnalysisRequestData from "../../../lib/data/api/AnalysisRequestData";
import AnalysisTransceiver from "../web_client/AnalysisTransceiver";
import PiecePosition from "../../../lib/data/PiecePosition";
import {Store} from "redux";
import BoardPiece from "../../../lib/data/BoardPiece";
import ShogiRule from "../../../lib/ShogiRule";
import ShogiUtility from "../../../lib/utility/ShogiUtility";
import Piece from "../../../lib/data/Piece";

// こちらの記事を参考
// https://qiita.com/uryyyyyyy/items/d8bae6a7fca1c4732696
// Middlewareではなくこのクラスで非同期処理を行う
// ビジネスロジックも基本的にはここに書くことにする
export default class GameActionDispatcher {
    constructor(
        private dispatch: (action: ReduxAction) => void,
        private store: Store<{}>,
    ) {}

    /**
     * 対局開始
     */
    public start(): void {
        const isMeSente = GameActionDispatcher.execFurigoma();
        this.dispatch(gameStart(isMeSente));
        if(!isMeSente) {
            this.moveOpponentPiece(this.state.position);
        }
    }

    /**
     * 自分の駒を移動
     * @param {Move} move
     * @param {boolean} isNariConfimed 成り確認済みか
     */
    public moveMyPiece(move: Move, isNariConfimed: boolean): void {
        //成り選択が必要か
        if(!isNariConfimed && ShogiRule.isNeedChoiceNari(this.state.position, move)) {
            this.dispatch(nariChoice(GameActionDispatcher.getNariChoiceMoves(move)));
            return;
        }
        //駒移動
        this.dispatch(pieceMove(move));
        this.moveOpponentPiece(this.state.position);
    }

    /**
     * 自分の駒を選択
     * @param {BoardPiece} boardPiece
     */
    public selectMyPiece(boardPiece: BoardPiece): void {
        //選択した駒の合法手を抽出
        const legalMoves: Move[] = ShogiRule.getLegalMoveList(this.state.position);
        const selectedLegalMoves: Move[] = legalMoves.filter((move: Move) =>
            GameActionDispatcher.isBoardPieceMove(move, boardPiece)
        );
        this.dispatch(selectPiece(boardPiece, selectedLegalMoves));
    }

    /**
     * 選択状態をキャンセル
     */
    public cancelSelectMyPiece(): void {
        this.dispatch(cancelMove());
    }

    /**
     * ページを閉じる前の動作
     */
    public closePage(): void {
        //必ずサーバとのコネクションを閉じる
        const analysisTransceiver: AnalysisTransceiver = new AnalysisTransceiver();
        analysisTransceiver.close();
    }

    /**
     * 現在のstate(コピー)を取得
     * @returns {GameState}
     */
    private get state(): GameState {
        return {...(this.store.getState() as ReduxState).game};
    }

    /**
     * 相手の駒を移動
     * @param {PiecePosition} position
     */
    private moveOpponentPiece(position: PiecePosition): void {
        const command: EngineCommand = new EngineCommand(EngineCommandType.nodes, 100000);
        const option: EngineOption = new EngineOption();
        option.ownBook = false;
        const requestData: AnalysisRequestData = new AnalysisRequestData(position, command, option);
        const analysisTransceiver: AnalysisTransceiver = new AnalysisTransceiver();
        (async () => {
            try {
                const data: AnalysisResponseData = await analysisTransceiver.analyze(requestData);
                console.log(data);
                this.dispatch(pieceMove(data.bestMove));
            } catch (err) {
                console.error(err);
            }
        })();
    }

    /**
     * 成り不成のMoveを取得
     * @param {Move} move
     * @returns {NariChoiceMove}
     */
    private static getNariChoiceMoves(move: Move): NariChoiceMove {
        let nari;
        let narazu;
        if(ShogiUtility.isNari(move.piece.type)) {
            nari = move;
            const narazuPiece = new Piece(ShogiUtility.getNariToNormalPiece(move.piece.type), move.piece.isSente);
            narazu = new Move(move.fromX, move.fromY, move.toX, move.toY, narazuPiece);
        } else {
            const nariPiece = new Piece(ShogiUtility.nariMap[move.piece.type], move.piece.isSente);
            nari = new Move(move.fromX, move.fromY, move.toX, move.toY, nariPiece);
            narazu = move;
        }
        return {nari, narazu};
    }

    /**
     * 指定した位置の駒のMoveであるか
     * @param {Move} move
     * @param {BoardPiece} boardPiece
     * @returns {boolean}
     */
    private static isBoardPieceMove(move: Move, boardPiece: BoardPiece): boolean {
        const isCapturedPiece = boardPiece.x === 0 && boardPiece.y === 0;
        if(isCapturedPiece) {
            return move.fromX === boardPiece.x && move.fromY === boardPiece.y && move.piece.equal(boardPiece);
        } else {
            return move.fromX === boardPiece.x && move.fromY === boardPiece.y;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    private static execFurigoma(): boolean {
        return [true, false][Math.round(Math.random())];
    }
}
