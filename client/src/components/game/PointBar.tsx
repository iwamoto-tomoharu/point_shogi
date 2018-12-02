import * as React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as styles from "../scss/PointBar.scss";

interface PointBarProps {
    nowPoint: number;
    maxPoint: number;
    midPoint: number;
    minPoint: number;
}

export default class PointBar extends React.Component<PointBarProps, {}> {

    public render(): React.ReactElement<PointBarProps> {
        //現在のポイントを0〜100にスケーリングする
        const perValue = ((this.props.nowPoint - this.props.minPoint) / (this.props.maxPoint - this.props.minPoint)) * 100;
        const barColor = this.props.nowPoint >= this.props.midPoint ? "primary" : "secondary";

        return (
            <div className={styles.pointBar}>
                <LinearProgress variant="determinate" value={perValue} color={barColor} className={styles.linearBar} />
                <span className={styles.scaleMin}>{this.props.minPoint}</span>
                <span className={styles.scaleMid}>{this.props.midPoint}</span>
                <span className={styles.scaleMax}>{this.props.maxPoint}</span>
            </div>
        );
    }


}