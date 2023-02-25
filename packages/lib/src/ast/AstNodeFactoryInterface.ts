import type {
  NumericLiteralNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  ProgramNode,
  StatementNode, BinaryExpressionNode,
} from '@/ast/AstNode'
import type { BinaryOperator } from '@/types/BinaryOperator'
import type { LiteralNode } from '@/ast/AstNode'

export interface AstNodeFactoryInterface {
  program(statementList: StatementNode[]): ProgramNode
  emptyStatement(): EmptyStatementNode
  numericLiteral(value: number): NumericLiteralNode
  expressionStatement<T>(expression: T): ExpressionStatementNode<T>
  binaryExpression<O extends BinaryOperator>(operator: O, left: LiteralNode | BinaryExpressionNode, right: LiteralNode | BinaryExpressionNode): BinaryExpressionNode<O>
}
