import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import * as styles from '../scss/PointBar.scss'

interface PointBarProps {
  nowPoint: number
  maxPoint: number
  midPoint: number
  minPoint: number
}

export default class PointBar extends React.Component<PointBarProps, {}> {

  public render (): React.ReactElement<PointBarProps> {
      // 現在のポイントを0〜100に正規化する
    const perValue = ((this.props.nowPoint - this.props.minPoint) / (this.props.maxPoint - this.props.minPoint)) * 100
    const barColor = this.props.nowPoint >= this.props.midPoint ? 'primary' : 'secondary'

    return (
            <div className={styles.pointBar}>
                <LinearProgress variant='determinate' value={perValue} color={barColor} className={styles.linearBar} />
                <span className={styles.scaleMin}>{PointBar.pointStr(this.props.minPoint)}</span>
                <span className={styles.scaleMid}>{PointBar.pointStr(this.props.midPoint)}</span>
                <span className={styles.scaleMax}>{PointBar.pointStr(this.props.maxPoint)}</span>
            </div>
    )
  }

  private static pointStr (point: number): string {
    if (point > 0) {
      return `+${point}`
    } else {
      return point.toString()
    }
  }

}
