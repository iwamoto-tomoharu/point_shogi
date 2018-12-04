export default class InvalidMoveError implements Error {
  public name: string = 'InvalidMoveError'
  constructor (public message: string) {
  }
  public toString (): string {
    return `${this.name}: ${this.message}`
  }
}
