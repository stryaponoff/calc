import { describe, expect, it } from 'vitest'
import { Tokenizer } from '@/tokenizer/tokenizer'
import type { Token } from '@/tokenizer/types/Token'
import { TokenType } from '@/tokenizer/types/TokenType'

describe('Tokenizer', () => {
  const tokenizer = new Tokenizer()

  it('should init', () => {
    expect(() => tokenizer.tokenize('')).not.toThrowError()
  })

  describe('should generate correct tokens', () => {
    const runTest = (input: string, expected: Token[]) => {
      const tokens = Array.from(tokenizer.tokenize(input))
      expect(tokens).toEqual(expected)
    }

    it('empty string', () => {
      runTest('', [{ type: TokenType.Semicolon, value: '', start: 0, end: 0 }])
    })

    it('numeric literal', () => {
      runTest('42', [
        { type: TokenType.Number, value: '42', start: 0, end: 2 },
        { type: TokenType.Semicolon, value: '', start: 2, end: 2 },
      ])
    })

    describe('unknown token', () => {
      it('#1', () => {
        runTest('[', [])
      })

      it('#2', () => {
        runTest('a', [])
      })

      it('#3', () => {
        runTest('123abc', [{ type: TokenType.Number, value: '123', start: 0, end: 3 }])
      })

      it('#4', () => {
        runTest('abc123', [])
      })
    })

    describe('simple math expression', () => {
      it('math expression', () => {
        runTest('2+2', [
          { type: TokenType.Number, value: '2', start: 0, end: 1 },
          { type: TokenType.AddOperator, value: '+', start: 1, end: 2 },
          { type: TokenType.Number, value: '2', start: 2, end: 3 },
          { type: TokenType.Semicolon, value: '', start: 3, end: 3 },
        ])
      })

      it('math with space', () => {
        runTest('2+ 2', [
          { type: TokenType.Number, value: '2', start: 0, end: 1 },
          { type: TokenType.AddOperator, value: '+', start: 1, end: 2 },
          { type: TokenType.Number, value: '2', start: 3, end: 4 },
          { type: TokenType.Semicolon, value: '', start: 4, end: 4 },
        ])
      })

      it('math with spaces', () => {
        runTest('2 + 2', [
          { type: TokenType.Number, value: '2', start: 0, end: 1 },
          { type: TokenType.AddOperator, value: '+', start: 2, end: 3 },
          { type: TokenType.Number, value: '2', start: 4, end: 5 },
          { type: TokenType.Semicolon, value: '', start: 5, end: 5 },
        ])
      })
    })

    it('math expression with parenthesis', () => {
      runTest('1 + 2*(3 - 4)', [
        { type: TokenType.Number, value: '1', start: 0, end: 1 },
        { type: TokenType.AddOperator, value: '+', start: 2, end: 3 },
        { type: TokenType.Number, value: '2', start: 4, end: 5 },
        { type: TokenType.MultiplyOperator, value: '*', start: 5, end: 6 },
        { type: TokenType.OpeningParenthesis, value: '(', start: 6, end: 7 },
        { type: TokenType.Number, value: '3', start: 7, end: 8 },
        { type: TokenType.AddOperator, value: '-', start: 9, end: 10 },
        { type: TokenType.Number, value: '4', start: 11, end: 12 },
        { type: TokenType.ClosingParenthesis, value: ')', start: 12, end: 13 },
        { type: TokenType.Semicolon, value: '', start: 13, end: 13 },
      ])
    })

    it('math expression with negative term', () => {
      runTest('1 + -2', [
        { type: TokenType.Number, value: '1', start: 0, end: 1 },
        { type: TokenType.AddOperator, value: '+', start: 2, end: 3 },
        { type: TokenType.AddOperator, value: '-', start: 4, end: 5 },
        { type: TokenType.Number, value: '2', start: 5, end: 6 },
        { type: TokenType.Semicolon, value: '', start: 6, end: 6 },
      ])

      runTest('1 + - 2', [
        { type: TokenType.Number, value: '1', start: 0, end: 1 },
        { type: TokenType.AddOperator, value: '+', start: 2, end: 3 },
        { type: TokenType.AddOperator, value: '-', start: 4, end: 5 },
        { type: TokenType.Number, value: '2', start: 6, end: 7 },
        { type: TokenType.Semicolon, value: '', start: 7, end: 7 },
      ])

      runTest('1+(-2)', [
        { type: TokenType.Number, value: '1', start: 0, end: 1 },
        { type: TokenType.AddOperator, value: '+', start: 1, end: 2 },
        { type: TokenType.OpeningParenthesis, value: '(', start: 2, end: 3 },
        { type: TokenType.AddOperator, value: '-', start: 3, end: 4 },
        { type: TokenType.Number, value: '2', start: 4, end: 5 },
        { type: TokenType.ClosingParenthesis, value: ')', start: 5, end: 6 },
        { type: TokenType.Semicolon, value: '', start: 6, end: 6 },
      ])
    })

    describe('semicolon / eol', () => {
      it('just semicolon', () => {
        runTest(';', [{ type: TokenType.Semicolon, value: ';', start: 0, end: 1 }])
      })

      it('semicolon only in the middle of the string', () => {
        runTest('1;2', [
          { type: TokenType.Number, value: '1', start: 0, end: 1 },
          { type: TokenType.Semicolon, value: ';', start: 1, end: 2 },
          { type: TokenType.Number, value: '2', start: 2, end: 3 },
          { type: TokenType.Semicolon, value: '', start: 3, end: 3 },
        ])
      })

      it('semicolon in the middle of the string and at the end', () => {
        runTest('1;2;', [
          { type: TokenType.Number, value: '1', start: 0, end: 1 },
          { type: TokenType.Semicolon, value: ';', start: 1, end: 2 },
          { type: TokenType.Number, value: '2', start: 2, end: 3 },
          { type: TokenType.Semicolon, value: ';', start: 3, end: 4 },
        ])
      })
    })
  })
})
