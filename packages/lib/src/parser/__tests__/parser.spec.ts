import { describe, it, expect } from 'vitest'
import { Parser } from '@/parser/parser'
import type { ProgramNode } from '@/ast/types/AstNode'
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
        body: [{ type: 'EmptyStatement' }]
      })
    })

    describe('single statement', () => {
      const singleExpectedAst = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
        ]
      } satisfies ProgramNode

      it('w/o semicolon', () => {
        runTest('1', singleExpectedAst)
      })

      it('with semicolon', () => {
        runTest('1;', singleExpectedAst)
      })

      it('with semicolon', () => {
        runTest('1;2', {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 1,
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 2,
              },
            },
          ]
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
              value: 42,
            },
          },
        ]
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
                value: 2,
              },
              right: {
                type: 'NumericLiteral',
                value: 3,
              },
            }
          }
        ]
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
                  value: 2,
                },
                right: {
                  type: 'NumericLiteral',
                  value: 3,
                },
              },
              right: {
                type: 'NumericLiteral',
                value: 1,
              },
            }
          }
        ]
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
                  value: 1,
                },
                right: {
                  type: 'NumericLiteral',
                  value: 2,
                },
              },
              right: {
                type: 'NumericLiteral',
                value: 3,
              },
            }
          }
        ]
      })
    })

    it('parenthesised expression', () => {
      runTest('1 + (2 - 3) + 4', {
        'type': 'Program',
        'body': [
          {
            'type': 'ExpressionStatement',
            'expression': {
              'type': 'BinaryExpression',
              'operator': '+',
              'left': {
                'type': 'BinaryExpression',
                'operator': '+',
                'left': {
                  'type': 'NumericLiteral',
                  'value': 1,
                },
                'right': {
                  'type': 'BinaryExpression',
                  'operator': '-',
                  'left': {
                    'type': 'NumericLiteral',
                    'value': 2,
                  },
                  'right': {
                    'type': 'NumericLiteral',
                    'value': 3,
                  }
                }
              },
              'right': {
                'type': 'NumericLiteral',
                'value': 4,
              }
            }
          }
        ]
      })
    })

    it('negative term', () => {
      runTest('2 + (-3)', {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'NumericLiteral',
                value: 2,
              },
              right: {
                type: 'UnaryExpression',
                operator: '-',
                argument: {
                  type: 'NumericLiteral',
                  value: 3,
                },
              },
            }
          }
        ]
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
