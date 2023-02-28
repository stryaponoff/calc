import type {
  BinaryExpressionNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  NumericLiteralNode,
  ProgramNode,
  StatementNode,
} from '@/ast/types/AstNode'
import {
  isBinaryExpressionNode,
  isEmptyStatementNode,
  isExpresionStatementNode,
  isNumericLiteralNode,
  isProgramNode
} from '@/ast/types/guards'
import { AbsurdError } from '@/errors/AbsurdError'
import type { AstNode } from '@/ast/types/AstNode'

export class Interpreter {
  public eval(ast: ProgramNode): Array<number | null>
  public eval(ast: EmptyStatementNode): null
  public eval(ast: NumericLiteralNode | StatementNode | BinaryExpressionNode): number
  public eval(ast: AstNode): null | number | Array<number | null>
  public eval(ast: AstNode) {
    if (isProgramNode(ast)) {
      return ast.body.map(expression => this.eval(expression))
    } else if (isEmptyStatementNode(ast)) {
      return this.evalEmptyStatement(ast)
    } else if (isExpresionStatementNode(ast)) {
      return this.evalExpressionStatement(ast)
    } else if (isNumericLiteralNode(ast)) {
      return this.evalNumericLiteral(ast)
    } else if (isBinaryExpressionNode(ast)) {
      return this.evalBinaryExpression(ast)
    } else {
      throw new AbsurdError(ast)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public evalEmptyStatement(_node: EmptyStatementNode) {
    return null
  }

  public evalExpressionStatement(node: ExpressionStatementNode) {
    return this.eval(node.expression as AstNode)
  }

  public evalBinaryExpression(node: BinaryExpressionNode) {
    const left = this.eval(node.left)
    const right = this.eval(node.right)
    switch (node.operator) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return left / right
      default:
        throw new AbsurdError(node.operator)
    }
  }

  public evalNumericLiteral(node: NumericLiteralNode) {
    return node.value
  }
}
