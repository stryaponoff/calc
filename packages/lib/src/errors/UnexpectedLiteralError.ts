import type { TokenType } from '@/tokenizer/types/TokenType'

export class UnexpectedLiteralError extends SyntaxError {
  constructor(literal: TokenType) {
    super(`Unexpected literal: "${literal}"`)
  }
}
