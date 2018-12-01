import {ReduxAction, ReduxState} from "../Store";
import {
    cancelMove,
    gameStart,
    GameState,
    nariChoice,
    NariChoiceMove,
    pieceMove, pointEffectStart, resign, resignDialogOpen,
    selectPiece
} from "../modules/GameModule";
import Move from "../../../lib/src/data/Move";
import EngineCommand from "../../../lib/src/data/EngineCommand";
import EngineCommandType from "../../../lib/src/data/enum/EngineCommandType";
import EngineOption from "../../../lib/src/data/EngineOption";
import AnalysisResponseData from "../../../lib/src/data/api/AnalysisResponseData";
import AnalysisRequestData from "../../../lib/src/data/api/AnalysisRequestData";
import AnalysisClient from "../model/web_client/AnalysisClient";
import PiecePosition from "../../../lib/src/data/PiecePosition";
import {Store} from "redux";
import BoardPiece from "../../../lib/src/data/BoardPiece";
import ShogiRule from "../../../lib/src/ShogiRule";
import ShogiUtility from "../../../lib/src/utility/ShogiUtility";
import Piece from "../../../lib/src/data/Piece";
import ApiName from "../../../lib/src/data/enum/ApiName";
import PointCalculator from "../model/PointCalculator";

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

        const beforePosition = this.state.position.copy();

        //駒移動
        //this.state.positionは書き換わる
        this.dispatch(pieceMove(move));

        //ポイント計算
        (async () => {
            const ply = this.state.moves.length + 1;
            const beforeResult = await this.execAnalysisForPoint(beforePosition);
            const nowResult = await this.execAnalysisForPoint(this.state.position);
            const point = PointCalculator.calcPoint(beforeResult, nowResult, this.state.isMeSente, this.state.difficulty);
            this.dispatch(pointEffectStart(true, move, point));
        })();

        //相手の着手
        this.moveOpponentPiece(this.state.position);
    }

    /**
     * 点数エフェクトの終了
     */
    public endPointEffect(): void {
        this.dispatch(pointEffectStart(false));
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
     * 投了する
     */
    public resign(): void {
        this.closeResignDialog();
        this.dispatch(resign());
    }

    /**
     * 投了ダイアログを開く
     */
    public openResignDialog(): void {
        this.dispatch(resignDialogOpen(true));
    }

    /**
     * 投了ダイアログを閉じる
     */
    public closeResignDialog(): void {
        this.dispatch(resignDialogOpen(false));
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
        option.threads = 1;
        const requestData: AnalysisRequestData = new AnalysisRequestData(ApiName.analysisMove, position, command, option);
        const client: AnalysisClient = new AnalysisClient();
        (async () => {
            const data: AnalysisResponseData = await client.analyze(requestData);
            this.dispatch(pieceMove(data.bestMove));
        })();
    }

    private async execAnalysisForPoint(position: PiecePosition): Promise<AnalysisResponseData> {
        const command: EngineCommand = new EngineCommand(EngineCommandType.nodes, 100000);
        const option: EngineOption = new EngineOption();
        option.ownBook = false;
        option.threads = 1;
        const requestData: AnalysisRequestData = new AnalysisRequestData(ApiName.analysisPoint, position, command, option);
        const analysisTransceiver: AnalysisClient = new AnalysisClient();
        return await analysisTransceiver.analyze(requestData);
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
     * 振り駒実行
     * @returns {boolean}
     */
    private static execFurigoma(): boolean {
        return [true, false][Math.round(Math.random())];
    }
}
