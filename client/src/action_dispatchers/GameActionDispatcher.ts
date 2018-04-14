import {ReduxAction, ReduxState} from "../Store";
import {GameState, pieceMove, selectPiece} from "../modules/GameModule";
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

export default class GameActionDispatcher {
    constructor(
        private dispatch: (action: ReduxAction) => void,
        private store: Store<{}>,
    ) {}

    /**
     * 自分の駒を移動
     * @param {Move} move
     */
    public moveMyPiece(move: Move): void {
        this.dispatch(pieceMove(move));
        const position: PiecePosition = this.state.position;
        this.moveOpponentPiece(position.getNextPosition(move));
    }

    public selectMyPiece(boardPiece: BoardPiece): void {
        this.dispatch(selectPiece(boardPiece));
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
}
