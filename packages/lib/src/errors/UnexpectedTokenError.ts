import type { TokenType } from '@/tokenizer/types/TokenType'

export class UnexpectedTokenError extends SyntaxError {
  constructor(actual: TokenType, expected?: TokenType) {
    if (expected) {
      super(`Unexpected token: "${actual}", expected "${expected}"`)
    } else {
      super(`Unexpected token: "${actual}"`)
    }
  }
}
