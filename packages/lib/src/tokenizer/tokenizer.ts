import type { TokenizerInterface } from '@/tokenizer/types/TokenizerInterface'
import type { TokenizerSpecification } from '@/tokenizer/types/TokenizerSpecification'
import { TokenType } from '@/tokenizer/types/TokenType'
import type { Token } from '@/tokenizer/types/Token'

export class Tokenizer implements TokenizerInterface {
  private static spec = {
    [TokenType.Null]: [
      /^\s+/, // whitespaces
      /^\/\/.*/ // comments
    ],
    [TokenType.Semicolon]: [/^;/],
    [TokenType.OpeningParenthesis]: [/^\(/],
    [TokenType.ClosingParenthesis]: [/^\)/],
    [TokenType.Number]: [/^\d+/],
    [TokenType.AddOperator]: [/^[+-]/],
    [TokenType.MultiplyOperator]: [/^[*/]/],
  } satisfies TokenizerSpecification

  public * tokenize(input: string): Generator<Token, null> {
    let iterator = 0
    let cursor = 0

    while (cursor < input.length) {
      if (iterator++ > 0 && cursor === 0) {
        // We're on non-first iteration of the loop but cursor is still in zero position
        // Exiting to prevent the infinite loop
        return null
      }

      for (const tokenType in Tokenizer.spec) {
        for (const re of Tokenizer.spec[tokenType as TokenType]) {
          const match = re.exec(input.slice(cursor))
          if (!match) {
            continue
          }

          cursor += match[0].length
          const value = match[0]

          if (tokenType === TokenType.Null) {
            continue
          }

          yield {
            type: tokenType,
            value: value,
          } as Token

          if (tokenType === TokenType.Semicolon && input.slice(cursor) === '') {
            /*
             * The case when the semicolon is the last one token in the string.
             * If we won't explicitly prevent end the generator flow here, we will
             * consume the semicolon token and start a new iteration of this loop
             * with empty string which is also and end-of-statement token,
             * so we will have an empty expression inside the AST
             */
            return null
          }
        }
      }
    }

    yield {
      type: TokenType.Semicolon,
      value: '',
    }

    return null
  }
}