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
      runTest('', [{ type: TokenType.Semicolon, value: '' }])
    })

    it('numeric literal', () => {
      runTest('42', [
        { type: TokenType.Number, value: '42' },
        { type: TokenType.Semicolon, value: '' }
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
        runTest('123abc', [{ type: TokenType.Number, value: '123' }])
      })

      it('#4', () => {
        runTest('abc123', [])
      })
    })

    describe('simple math expression', () => {
      const expected: Token[] = [
        { type: TokenType.Number, value: '2' },
        { type: TokenType.AddOperator, value: '+' },
        { type: TokenType.Number, value: '2' },
        { type: TokenType.Semicolon, value: '' },
      ]

      it('math expression', () => {
        runTest('2+2', expected)
      })

      it('math with space', () => {
        runTest('2+ 2', expected)
      })

      it('math with spaces', () => {
        runTest('2 + 2', expected)
      })
    })

    it('math expression with parenthesis', () => {
      runTest('1 + 2*(3 - 4)', [
        { type: TokenType.Number, value: '1' },
        { type: TokenType.AddOperator, value: '+' },
        { type: TokenType.Number, value: '2' },
        { type: TokenType.MultiplyOperator, value: '*' },
        { type: TokenType.OpeningParenthesis, value: '(' },
        { type: TokenType.Number, value: '3' },
        { type: TokenType.AddOperator, value: '-' },
        { type: TokenType.Number, value: '4' },
        { type: TokenType.ClosingParenthesis, value: ')' },
        { type: TokenType.Semicolon, value: '' },
      ])
    })

    describe('semicolon / eol', () => {
      it('just semicolon', () => {
        runTest(';', [{ type: TokenType.Semicolon, value: ';' }])
      })

      it('semicolon only in the middle of the string', () => {
        runTest('1;2', [
          { type: TokenType.Number, value: '1' },
          { type: TokenType.Semicolon, value: ';' },
          { type: TokenType.Number, value: '2' },
          { type: TokenType.Semicolon, value: '' },
        ])
      })

      it('semicolon in the middle of the string and at the end', () => {
        runTest('1;2;', [
          { type: TokenType.Number, value: '1' },
          { type: TokenType.Semicolon, value: ';' },
          { type: TokenType.Number, value: '2' },
          { type: TokenType.Semicolon, value: ';' },
        ]
        )
      })
    })
  })
})
