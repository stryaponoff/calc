import { describe, expect, it } from 'vitest'
import { Parser } from '@/parser/parser'
import type { LiteralNode, ProgramNode } from '@/ast/types/AstNode'
import { UnexpectedLiteralError } from '@/errors/UnexpectedLiteralError'
import { UnexpectedEndOfInputError } from '@/errors/UnexpectedEndOfInputError'

describe('Parser', () => {
  const parser = new Parser()

  const runTest = (input: string, expected: ProgramNode) => {
    const ast = parser.parse(input)
    expect(ast).toEqual(expected)
  }

  describe('expressions', () => {
    it('empty statement', () => {
      runTest('', {
        type: 'Program',
        body: [{ type: 'EmptyStatement', start: 0, end: 0 }],
        start: 0,
        end: 0,
      })
    })

    it('multiple empty statements', () => {
      runTest('1;;;;', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              raw: '1',
              value: 1,
              start: 0,
              end: 1,
            },
            start: 0,
            end: 2,
          },
          { type: 'EmptyStatement', start: 2, end: 3 },
          { type: 'EmptyStatement', start: 3, end: 4 },
          { type: 'EmptyStatement', start: 4, end: 5 },
        ],
        start: 0,
        end: 5,
      })
    })

    describe('single statement', () => {
      it('w/o semicolon', () => {
        runTest('1', {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 0,
                end: 1,
              },
              start: 0,
              end: 1,
            },
          ],
          start: 0,
          end: 1,
        })
      })

      it('with semicolon', () => {
        runTest('1;', {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 0,
                end: 1,
              } satisfies LiteralNode,
              start: 0,
              end: 2,
            },
          ],
          start: 0,
          end: 2,
        } satisfies ProgramNode)
      })

      it('with semicolon', () => {
        runTest('1;2', {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 0,
                end: 1,
              },
              start: 0,
              end: 2,
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                raw: '2',
                value: 2,
                start: 2,
                end: 3,
              },
              start: 2,
              end: 3,
            },
          ],
          start: 0,
          end: 3,
        })
      })
    })
  })

  describe('literals', () => {
    it('numeric literal', () => {
      runTest('42', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              raw: '42',
              value: 42,
              start: 0,
              end: 2,
            },
            start: 0,
            end: 2,
          },
        ],
        start: 0,
        end: 2,
      })
    })

    it('numeric literal with leading zeros', () => {
      runTest('00042', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              raw: '00042',
              value: 42,
              start: 0,
              end: 5,
            },
            start: 0,
            end: 5,
          },
        ],
        start: 0,
        end: 5,
      })
    })
  })

  describe('math', () => {
    it('simple expression', () => {
      runTest('2 + 3', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                raw: '2',
                value: 2,
                start: 0,
                end: 1,
              },
              right: {
                type: 'NumericLiteral',
                raw: '3',
                value: 3,
                start: 4,
                end: 5,
              },
              start: 0,
              end: 5,
            },
            start: 0,
            end: 5,
          }
        ],
        start: 0,
        end: 5,
      })
    })

    it('less simple expression', () => {
      runTest('2 + 3 - 1', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '-',
              left: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'NumericLiteral',
                  raw: '2',
                  value: 2,
                  start: 0,
                  end: 1,
                },
                right: {
                  type: 'NumericLiteral',
                  raw: '3',
                  value: 3,
                  start: 4,
                  end: 5,
                },
                start: 0,
                end: 5,
              },
              right: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 8,
                end: 9,
              },
              start: 0,
              end: 9,
            },
            start: 0,
            end: 9,
          }
        ],
        start: 0,
        end: 9,
      })
    })

    it('multiplicative expression', () => {
      runTest('1 * 2 + 3', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                  type: 'NumericLiteral',
                  raw: '1',
                  value: 1,
                  start: 0,
                  end: 1,
                },
                right: {
                  type: 'NumericLiteral',
                  raw: '2',
                  value: 2,
                  start: 4,
                  end: 5,
                },
                start: 0,
                end: 5,
              },
              right: {
                type: 'NumericLiteral',
                raw: '3',
                value: 3,
                start: 8,
                end: 9,
              },
              start: 0,
              end: 9,
            },
            start: 0,
            end: 9,
          }
        ],
        start: 0,
        end: 9,
      })
    })

    it('simple parenthesised expression', () => {
      runTest('(1+2)', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 1,
                end: 2,
              },
              right: {
                type: 'NumericLiteral',
                raw: '2',
                value: 2,
                start: 3,
                end: 4,
              },
              start: 1,
              end: 5,
            },
            start: 0,
            end: 5,
          }
        ],
        start: 0,
        end: 5,
      })

      runTest('((1+2))', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                raw: '1',
                value: 1,
                start: 2,
                end: 3,
              },
              right: {
                type: 'NumericLiteral',
                raw: '2',
                value: 2,
                start: 4,
                end: 5,
              },
              start: 2,
              end: 7,
            },
            start: 0,
            end: 7,
          }
        ],
        start: 0,
        end: 7,
      })
    })

    it('parenthesised expression', () => {
      runTest('1 + (2 - 3) + 4', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'NumericLiteral',
                  raw: '1',
                  value: 1,
                  start: 0,
                  end: 1,
                },
                right: {
                  type: 'BinaryExpression',
                  operator: '-',
                  left: {
                    type: 'NumericLiteral',
                    raw: '2',
                    value: 2,
                    start: 5,
                    end: 6,
                  },
                  right: {
                    type: 'NumericLiteral',
                    raw: '3',
                    value: 3,
                    start: 9,
                    end: 10,
                  },
                  start: 5,
                  end: 11,
                },
                start: 0,
                end: 11,
              },
              right: {
                type: 'NumericLiteral',
                raw: '4',
                value: 4,
                start: 14,
                end: 15,
              },
              start: 0,
              end: 15,
            },
            start: 0,
            end: 15,
          }
        ],
        start: 0,
        end: 15,
      })
    })

    it('negative term', () => {
      runTest('2+(-3)', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                raw: '2',
                value: 2,
                start: 0,
                end: 1,
              },
              right: {
                type: 'UnaryExpression',
                operator: '-',
                argument: {
                  type: 'NumericLiteral',
                  raw: '3',
                  value: 3,
                  start: 4,
                  end: 5,
                },
                start: 3,
                end: 6,
              },
              start: 0,
              end: 6,
            },
            start: 0,
            end: 6,
          }
        ],
        start: 0,
        end: 6,
      })
    })
  })

  describe('errors', () => {
    it('UnexpectedLiteralError', () => {
      expect(() => parser.parse('2 +')).toThrowError(UnexpectedLiteralError)
    })

    it('UnexpectedEndOfInputError', () => {
      expect(() => parser.parse('t+')).toThrowError(UnexpectedEndOfInputError)
    })
  })
})
