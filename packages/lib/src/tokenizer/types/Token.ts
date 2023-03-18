import type { TokenType } from '@/tokenizer/types/TokenType'
import type { BinaryOperator } from '@/types/BinaryOperator'

export type AbstractToken<Type extends TokenType, Value extends string = string> = {
  type: Type
  value: Value
  start: number
  end: number
}

export type NumericLiteralToken = AbstractToken<TokenType.Number>
export type OpeningParenthesisToken = AbstractToken<TokenType.OpeningParenthesis>
export type ClosingParenthesisToken = AbstractToken<TokenType.ClosingParenthesis>
export type SemicolonToken = AbstractToken<TokenType.Semicolon>
export type AddOperatorToken = AbstractToken<TokenType.AddOperator, Extract<BinaryOperator, '+' | '-'>>
export type MultiplyOperatorToken = AbstractToken<TokenType.MultiplyOperator, Extract<BinaryOperator, '*' | '/'>>
export type NullToken = AbstractToken<TokenType.Null>

export type Token =
  | NullToken
  | NumericLiteralToken
  | OpeningParenthesisToken
  | ClosingParenthesisToken
  | SemicolonToken
  | AddOperatorToken
  | MultiplyOperatorToken

export type TokenByType<T extends TokenType> = Extract<Token, { type: T }>
