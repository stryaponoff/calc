import type { BinaryOperator } from '@/types/BinaryOperator'

type AbstractAstNode<
  T extends string,
  P extends Record<string, unknown> = Record<never, never>
> = {
  type: T
} & P

export type NumericLiteralNode = AbstractAstNode<'NumericLiteral', {
  value: number
}>

export type LiteralNode =
  | NumericLiteralNode

export type ExpressionStatementNode<T = unknown> = AbstractAstNode<'ExpressionStatement', { expression: T }>
export type EmptyStatementNode = AbstractAstNode<'EmptyStatement'>
export type StatementNode =
  | EmptyStatementNode
  | ExpressionStatementNode

export type BinaryExpressionNode<
  O extends BinaryOperator = BinaryOperator
> = AbstractAstNode<'BinaryExpression', {
  operator: O
  left: LiteralNode | BinaryExpressionNode
  right: LiteralNode | BinaryExpressionNode
}>

export type ProgramNode = AbstractAstNode<'Program', { body: StatementNode[] }>

export type AstNode =
  | ProgramNode
  | LiteralNode
  | StatementNode
  | BinaryExpressionNode

export type AstNodeType = AstNode['type']
