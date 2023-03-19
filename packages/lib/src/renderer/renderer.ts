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
        case TokenType.AddOperator: {
          let value: string
          if (token.value === '+') {
            value = '&plus;'
          } else if (token.value === '-') {
            value = '&minus;'
          } else {
            value = token.value
          }

          return acc + spaces + `<span class="token operator add">${value}</span>`
        }
        case TokenType.MultiplyOperator: {
          let value: string
          if (token.value === '*') {
            value = '&times;'
          } else if (token.value === '/') {
            value = '&divide;'
          } else {
            value = token.value
          }

          return acc + spaces + `<span class="token operator multiply">${value}</span>`
        }
        case TokenType.OpeningParenthesis:
        case TokenType.ClosingParenthesis:
          return acc + spaces + `<span class="token paren">${token.value}</span>`
        default:
          return acc + spaces + `<span class="token">${token.value}</span>`
      }
    }, '')
  }
}
