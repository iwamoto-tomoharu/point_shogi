import * as React from "react";
import * as styles from "../css/Game.scss";
import Props from "./Props";
import {Board} from "./Board";

export class Game extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        //画面を閉じた時のイベント
        window.addEventListener("beforeunload", () => this.props.actions.closePage());
        return (
            <div className={styles.gameArea}>
                <Board value={this.props.value} actions={this.props.actions}/>
            </div>
        );
    }
}