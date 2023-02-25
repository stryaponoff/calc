import type { AstNodeFactoryInterface } from '@/ast/AstNodeFactoryInterface'
import type {
  BinaryExpressionNode,
  ExpressionStatementNode,
  LiteralNode,
  NumericLiteralNode,
  StatementNode
} from '@/ast/AstNode'
import type { EmptyStatementNode } from '@/ast/AstNode'
import type { ProgramNode } from '@/ast/AstNode'
import type { BinaryOperator } from '@/types/BinaryOperator'

export class AstNodeFactory implements AstNodeFactoryInterface {
  public program(statementList: StatementNode[]): ProgramNode {
    return {
      type: 'Program',
      body: statementList,
    }
  }

  public emptyStatement(): EmptyStatementNode {
    return {
      type: 'EmptyStatement'
    }
  }

  public numericLiteral(value: number): NumericLiteralNode {
    return {
      type: 'NumericLiteral',
      value: Number(value),
    }
  }

  public expressionStatement<T>(expression: T): ExpressionStatementNode<T> {
    return {
      type: 'ExpressionStatement',
      expression,
    } as ExpressionStatementNode<T>
  }

  public binaryExpression<O extends BinaryOperator>(
    operator: O,
    left: LiteralNode | BinaryExpressionNode,
    right: LiteralNode | BinaryExpressionNode
  ): BinaryExpressionNode<O> {
    return {
      type: 'BinaryExpression',
      operator,
      left,
      right,
    }
  }
}
