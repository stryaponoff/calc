import type {
  NumericLiteralNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  ProgramNode,
  StatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  BinaryExpressionNodeArgument,
  UnaryExpressionNodeArgument,
} from '@/ast/types/AstNode'
import type { BinaryOperator } from '@/types/BinaryOperator'
import type { UnaryOperator } from '@/types/UnaryOperator'

export interface AstNodeFactoryInterface {
  program(statementList: StatementNode[]): ProgramNode
  emptyStatement(): EmptyStatementNode
  numericLiteral(value: number): NumericLiteralNode
  expressionStatement<T>(expression: T): ExpressionStatementNode<T>
  binaryExpression<O extends BinaryOperator>(operator: O, left: BinaryExpressionNodeArgument, right: BinaryExpressionNodeArgument): BinaryExpressionNode<O>
  unaryExpression<O extends UnaryOperator>(operator: O, argument: UnaryExpressionNodeArgument): UnaryExpressionNode<O>
}
