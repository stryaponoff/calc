import type {
  NumericLiteralNode,
  BinaryExpressionNode,
  BinaryExpressionNodeArgument,
  EmptyStatementNode,
  ExpressionStatementNode,
  ProgramNode,
  StatementNode,
  UnaryExpressionNode,
  UnaryExpressionNodeArgument,
} from '@/ast/types/AstNode'
import type { BinaryOperator } from '@/types/BinaryOperator'
import type { UnaryOperator } from '@/types/UnaryOperator'

export interface AstNodeFactoryInterface {
  program(statementList: StatementNode[], start: number, end: number): ProgramNode
  emptyStatement(start: number, end: number): EmptyStatementNode
  numericLiteral(value: number, start: number, end: number): NumericLiteralNode
  expressionStatement<T>(expression: T, start: number, end: number): ExpressionStatementNode<T>
  binaryExpression<O extends BinaryOperator>(operator: O, left: BinaryExpressionNodeArgument, right: BinaryExpressionNodeArgument, start: number, end: number): BinaryExpressionNode<O>
  unaryExpression<O extends UnaryOperator>(operator: O, argument: UnaryExpressionNodeArgument, start: number, end: number): UnaryExpressionNode<O>
}
