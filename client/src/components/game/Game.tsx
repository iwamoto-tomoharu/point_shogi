import * as React from "react";
import * as styles from "../scss/Game.scss";
import Props from "./Props";
import Board from "./Board";
import Hand from "./Hand";
import {GameState} from "../../modules/GameModule";

export class Game extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        //画面を閉じた時のイベント
        window.addEventListener("beforeunload", () => this.props.actions.closePage());
        return (
            <div className={styles.gameArea}>
                <Hand value={this.props.value} actions={this.props.actions} isMe={false} />
                <Board value={this.props.value} actions={this.props.actions}/>
                <Hand value={this.props.value} actions={this.props.actions} isMe={true} />
            </div>
        );
    }

    public componentDidMount(): void {
        //相手が先手の場合、相手の着手から
        const isOpponentStart  = this.props.value.moves.length == 0 && !this.props.value.isMyTurn;
        if(isOpponentStart) this.props.actions.opponentStart();
    }
}