export default class MyMath {

  /**
   * シグモイド関数
   * @param {number} x
   * @param {number} a
   * @returns {number}
   */
  public static sigmoid (x: number, a: number): number {
    return 1 / (1 + Math.exp(-a * x))
  }

  /**
   * 1点と傾きから一次関数を生成
   * @param {number} x1
   * @param {number} y1
   * @param {number} slope
   * @returns {(x: number) => number}
   */
  public static createLinearFunc (x1: number, y1: number, slope: number): (x: number) => number {
    const b = y1 - slope * x1
    return (x: number) => slope * x + b
  }

}
