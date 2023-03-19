import { Tokenizer } from '@/tokenizer/tokenizer'
import type { Token } from '@/tokenizer/types/Token'
import { TokenType } from '@/tokenizer/types/TokenType'

export class Renderer {
  private tokenizer = new Tokenizer()
  private tokens: Token[] = []

  public renderHtml(input: string) {
    this.tokens = Array.from(this.tokenizer.tokenize(input))
    return this.tokens.reduce((acc, token, index) => {
      const spaceCount = token.start -  this.tokens[index - 1]?.end ?? 0
      const spaces = Array.from({ length: spaceCount }, () => '&nbsp;').join('')

      switch (token.type) {
        case TokenType.Number:
          return acc + spaces + `<span class="token number">${token.value}</span>`
        case TokenType.AddOperator:
        case TokenType.MultiplyOperator:
          return acc + spaces + `<span class="token operator add-operator">${token.value}</span>`
        case TokenType.OpeningParenthesis:
        case TokenType.ClosingParenthesis:
          return acc + spaces + `<span class="token paren">${token.value}</span>`
        default:
          return acc + spaces + `<span class="token">${token.value}</span>`
      }
    }, '')
  }
}
