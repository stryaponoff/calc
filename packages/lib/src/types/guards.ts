import type { BinaryOperator } from '@/types/BinaryOperator'

export const isRecord = <T extends string | number | symbol = string>(value: unknown): value is Record<T, unknown> => {
  return typeof value === 'object' && value !== null
}

export const isBinaryOperator = (value: unknown): value is BinaryOperator => {
  return typeof value === 'string' && ['+', '-', '*', '/'].includes(value)
}
