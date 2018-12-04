import * as React from 'react'
import * as styles from './scss/Main.scss'

interface Props {
}

interface Status {
  width: number
  height: number
}

class Main extends React.Component<Props, Status> {
  public static readonly SCREEN_WIDTH_BASE: number = 640
  public static readonly MAIN_HEIGHT_BASE: number = 960

  constructor (props: Props, context: any) {
    super(props, context)
    this.state = Main.playAreaStyle
    window.addEventListener('resize', () => this.setState(Main.playAreaStyle))
  }

  public render (): React.ReactElement<Props> {
    return (
            <div className={styles.main}>
                <div className={styles.playArea} style={this.state}>
                    {this.props.children}
                </div>
            </div>
    )
  }

  /**
   * BASEと実際の画面サイズとの比率
   * 縦横の短い方を100%にする
   * ただし縦横サイズが画面に収まる場合のみ横のrateを使用する
   * @returns {number}
   */
  private static get rate (): number {
    let heightRate: number = window.innerHeight / this.MAIN_HEIGHT_BASE
    let widthRate: number = window.innerWidth / this.SCREEN_WIDTH_BASE
    let height: number = this.MAIN_HEIGHT_BASE * widthRate
    let widthRateUse: boolean = window.innerHeight > window.innerWidth && window.innerHeight > height

    return widthRateUse ? widthRate : heightRate
  }

  private static get screenWidth (): number {
    return this.SCREEN_WIDTH_BASE * this.rate
  }

  private static get screenHeight (): number {
    return this.MAIN_HEIGHT_BASE * this.rate
  }

  private static get playAreaStyle (): {width: number, height: number} {
    return {
      width: Main.screenWidth,
      height: Main.screenHeight
    }
  }

}
export default Main
