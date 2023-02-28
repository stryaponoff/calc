import { describe, it, expect } from 'vitest'
import { Interpreter } from '@/interpreter/interpreter'
import { Parser } from '@/parser/parser'

describe('Interpreter', () => {
  const interpreter = new Interpreter()
  const parser = new Parser()

  const executeCode = (code: string) => {
    const ast = parser.parse(code)
    return interpreter.eval(ast)
  }

  const runTest = (code: string, expected: number) => {
    expect(() => executeCode(code)).not.toThrowError()
    expect(executeCode(code)).toEqual([expected])
  }

  it('Simple number', () => {
    runTest('42', 42)
  })

  describe('Simple math expressions', () => {
    it('Add', () => {
      runTest('2 + 2', 4)
    })

    it('Subtract', () => {
      runTest('2 - 10', -8)
    })

    it('Multiply', () => {
      runTest('5 * 5', 25)
    })

    it('Divide', () => {
      runTest('10 / 2', 5)
    })

    it.todo('Divide by zero', () => {
      runTest('1 / 0', 0)
    })
  })

  describe('Parenthesised expressions', () => {
    it('#1', () => {
      runTest('2 + 2 * 2', 6)
      runTest('(2 + 2) * 2', 8)
    })

    it('#2', () => {
      runTest('(1 * 2 * 3) / 2 * (4 * 5 * 6)', 360)
    })

    it('#3', () => {
      runTest('1 + (2 + 3 * (4 - (3 * 12) / 4))', -12)
    })
  })
})
