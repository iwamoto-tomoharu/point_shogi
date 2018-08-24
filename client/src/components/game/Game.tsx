import * as React from "react";
import * as styles from "../scss/Game.scss";
import Props from "./Props";
import Board from "./Board";
import Hand from "./Hand";
import {GameState, PlayingStatus} from "../../modules/GameModule";

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
        if(this.props.value.playingStatus == PlayingStatus.NotStarted) {
            this.props.actions.start();
        }
    }
}