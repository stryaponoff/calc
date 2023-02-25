export class UnexpectedEndOfInputError extends SyntaxError {
  constructor() {
    super('Unexpected end of input')
  }
}
