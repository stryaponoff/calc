import type { BinaryOperator } from '@/types/BinaryOperator'
import type { UnaryOperator } from '@/types/UnaryOperator'

export const isRecord = <T extends string | number | symbol = string>(value: unknown): value is Record<T, unknown> => {
  return typeof value === 'object' && value !== null
}

export const isBinaryOperator = (value: unknown): value is BinaryOperator => {
  return typeof value === 'string' && ['+', '-', '*', '/'].includes(value)
}

export const isUnaryOperator = (value: unknown): value is UnaryOperator => {
  return typeof value === 'string' && value === '-'
}
