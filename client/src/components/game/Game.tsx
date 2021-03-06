import * as React from "react";
import * as styles from "../scss/Game.scss";
import Props from "./Props";
import Board from "./Board";
import Hand from "./Hand";
import {PlayingStatus} from "../../modules/GameModule";
import {HeadButtons} from "./HeadButtons";

export class Game extends React.Component<Props, {}> {
    public render(): React.ReactElement<Props> {
        return (
            <div className={styles.gameArea}>
                <HeadButtons value={this.props.value} actions={this.props.actions}/>
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