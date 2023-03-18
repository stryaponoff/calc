import type { AstNodeFactoryInterface } from '@/ast/AstNodeFactoryInterface'
import type {
  BinaryExpressionNode,
  ExpressionStatementNode,
  LiteralNode,
  NumericLiteralNode,
  StatementNode,
  UnaryExpressionNode
} from '@/ast/types/AstNode'
import type { EmptyStatementNode } from '@/ast/types/AstNode'
import type { ProgramNode } from '@/ast/types/AstNode'
import type { BinaryOperator } from '@/types/BinaryOperator'
import type { UnaryOperator } from '@/types/UnaryOperator'

export class AstNodeFactory implements AstNodeFactoryInterface {
  public program(statementList: StatementNode[], start: number, end: number): ProgramNode {
    return {
      type: 'Program',
      body: statementList,
      start,
      end,
    }
  }

  public emptyStatement(start: number, end: number): EmptyStatementNode {
    return {
      type: 'EmptyStatement',
      start,
      end,
    }
  }

  public numericLiteral(rawValue: string, start: number, end: number): NumericLiteralNode {
    return {
      type: 'NumericLiteral',
      value: Number(rawValue),
      raw: rawValue,
      start,
      end,
    }
  }

  public expressionStatement<T>(expression: T, start: number, end: number): ExpressionStatementNode<T> {
    return {
      type: 'ExpressionStatement',
      expression,
      start,
      end,
    }
  }

  public binaryExpression<O extends BinaryOperator>(
    operator: O,
    left: LiteralNode | BinaryExpressionNode,
    right: LiteralNode | BinaryExpressionNode,
    start: number,
    end: number,
  ): BinaryExpressionNode<O> {
    return {
      type: 'BinaryExpression',
      operator,
      left,
      right,
      start,
      end,
    }
  }

  public unaryExpression<O extends UnaryOperator>(
    operator: O,
    argument: LiteralNode | UnaryExpressionNode,
    start: number,
    end: number,
  ): UnaryExpressionNode<O> {
    return {
      type: 'UnaryExpression',
      operator,
      argument,
      start,
      end,
    }
  }
}
