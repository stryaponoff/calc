import { isBinaryOperator, isRecord } from '@/types/guards'
import type {
  AbstractAstNode,
  AstNodeType,
  BinaryExpressionNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  NumericLiteralNode,
  ProgramNode,
} from '@/ast/types/AstNode'

const isAstNode = <T extends AstNodeType>(value: unknown, type?: T): value is AbstractAstNode<T, Record<string, unknown>> => {
  return isRecord(value)
    && typeof value.type === 'string'
    && (!type || (type && value.type === type))
}

export const isProgramNode = (value: unknown): value is ProgramNode => {
  return isAstNode(value, 'Program')
    && Array.isArray(value.body)
}

export const isEmptyStatementNode = (value: unknown): value is EmptyStatementNode => {
  return isAstNode(value, 'EmptyStatement')
}

export const isExpresionStatementNode = (value: unknown): value is ExpressionStatementNode => {
  return isAstNode(value, 'ExpressionStatement')
    && isAstNode(value.expression)
}

export const isBinaryExpressionNode = (value: unknown): value is BinaryExpressionNode => {
  return isAstNode(value, 'BinaryExpression')
    && isBinaryOperator(value.operator)
    && typeof value.left !== 'undefined'
    && typeof value.right !== 'undefined'
}

export const isNumericLiteralNode = (value: unknown): value is NumericLiteralNode => {
  return isAstNode(value, 'NumericLiteral')
    && typeof value.value === 'number'
}
