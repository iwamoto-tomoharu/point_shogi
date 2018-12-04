import * as React from 'react'
import * as styles from '../scss/PointText.scss'
import { CSSTransition } from 'react-transition-group'
import Props from './Props'

interface PointTextProps {
  isStart: boolean
  point: number
  endPointEffectCallback: () => void
}

/**
 * 駒
 */
export default class PointText extends React.Component<PointTextProps, {}> {
  public render (): React.ReactElement<PointTextProps> {
    let textClassName, enterClassName, enterActiveClassName: string
    if (this.props.point != null && this.props.point >= 0) {
      textClassName = styles.textPlus
      enterClassName = styles.textPlusEnter
      enterActiveClassName = styles.textPlusEnterActive
    } else {
      textClassName = styles.textMinus
      enterClassName = styles.textMinusEnter
      enterActiveClassName = styles.textMinusEnterActive
    }
    const point = this.props.point != null && this.props.point >= 0 ? `+${this.props.point}` : this.props.point
        // timeoutが完了する前に次のアニメーションが始まってしまうと、正常にアニメーションが動かない
        // onEnteredが実行されるのは、実際のところtimeoutの時間+1sくらい
    return (
            <CSSTransition in={this.props.isStart} timeout={1000}
                           classNames={{ enter: enterClassName, enterActive: enterActiveClassName }}
                           onEntered={this.props.endPointEffectCallback}
            >
                <div className={textClassName}>{this.props.isStart ? point : ''}</div>
            </CSSTransition>
    )
  }

}
