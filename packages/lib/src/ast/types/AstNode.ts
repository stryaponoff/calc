import type { BinaryOperator } from '@/types/BinaryOperator'
import type { UnaryOperator } from '@/types/UnaryOperator'

export type AbstractAstNode<
  T extends string = string,
  P extends Record<string, unknown> = Record<never, never>
> = {
  type: T
  start: number
  end: number
} & P

export type NumericLiteralNode = AbstractAstNode<'NumericLiteral', {
  value: number
  raw: string
}>

export type LiteralNode =
  | NumericLiteralNode

export type ExpressionStatementNode<T = unknown> = AbstractAstNode<'ExpressionStatement', { expression: T }>
export type EmptyStatementNode = AbstractAstNode<'EmptyStatement'>
export type StatementNode =
  | EmptyStatementNode
  | ExpressionStatementNode

export type BinaryExpressionNodeArgument = LiteralNode | UnaryExpressionNode | BinaryExpressionNode
export type BinaryExpressionNode<
  O extends BinaryOperator = BinaryOperator
> = AbstractAstNode<'BinaryExpression', {
  operator: O
  left: BinaryExpressionNodeArgument
  right: BinaryExpressionNodeArgument
}>

export type UnaryExpressionNodeArgument = LiteralNode | UnaryExpressionNode
export type UnaryExpressionNode<
  O extends UnaryOperator = UnaryOperator
> = AbstractAstNode<'UnaryExpression', {
  operator: O
  argument: UnaryExpressionNodeArgument
}>

export type ProgramNode = AbstractAstNode<'Program', { body: StatementNode[] }>

export type AstNode =
  | ProgramNode
  | LiteralNode
  | StatementNode
  | BinaryExpressionNode
  | UnaryExpressionNode

export type AstNodeType = AstNode['type']
