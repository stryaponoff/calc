import { Tokenizer } from '@/tokenizer/tokenizer'
import type { ParserInterface } from '@/parser/types/ParserInterface'
import { TokenType } from '@/tokenizer/types/TokenType'
import type { Token, TokenByType } from '@/tokenizer/types/Token'
import { AstNodeFactory } from '@/ast/AstNodeFactory'
import type { AstNodeFactoryInterface } from '@/ast/AstNodeFactoryInterface'
import { UnexpectedEndOfInputError } from '@/errors/UnexpectedEndOfInputError'
import { UnexpectedTokenError } from '@/errors/UnexpectedTokenError'
import { UnexpectedLiteralError } from '@/errors/UnexpectedLiteralError'
import type {
  BinaryExpressionNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  LiteralNode,
  NumericLiteralNode,
  UnaryExpressionNode,
} from '@/ast/types/AstNode'
import { isUnaryOperator } from '@/types/guards'

export class Parser implements ParserInterface {
  private astNodeFactory: AstNodeFactoryInterface = new AstNodeFactory()
  private tokenizer = new Tokenizer()
  private tokens!: ReturnType<Tokenizer['tokenize']>
  private _lookahead: Token | null = null

  private get lookahead(): Token {
    if (!this._lookahead) {
      throw new UnexpectedEndOfInputError()
    }

    return this._lookahead
  }

  public parse(input: string) {
    this.tokens = this.tokenizer.tokenize(input)
    this._lookahead = this.tokens.next().value

    return this.program()
  }

  protected consume<T extends TokenType>(tokenType: T): TokenByType<T> {
    const token = this.lookahead

    if (tokenType !== token.type) {
      throw new UnexpectedTokenError(token.type, tokenType)
    }

    this._lookahead = this.tokens.next().value

    return token as unknown as TokenByType<T>
  }

  private program() {
    const statements = this.statementList()
    const start = statements[0].start
    const end = statements[statements.length - 1].end

    return this.astNodeFactory.program(statements, start, end)
  }

  private statementList() {
    const statementList = [this.statement()]

    while (this._lookahead !== null) {
      statementList.push(this.statement())
    }

    return statementList
  }

  private statement() {
    switch (this.lookahead.type) {
      case TokenType.Semicolon:
        return this.emptyStatement()
      default:
        return this.expressionStatement()
    }
  }

  private emptyStatement(): EmptyStatementNode {
    const token = this.consume(TokenType.Semicolon)
    return this.astNodeFactory.emptyStatement(token.start, token.end)
  }

  private expressionStatement<T = unknown>(): ExpressionStatementNode<T> {
    // Get cursor position before consuming any tokens
    const start = this.lookahead.start

    const expression = this.expression() as unknown as T & { start: number; end: number }
    const semicolon = this.consume(TokenType.Semicolon)
    return this.astNodeFactory.expressionStatement(expression, start, semicolon.end)
  }

  private parenthesizedExpression() {
    this.consume(TokenType.OpeningParenthesis)
    const expression = this.expression()
    const cp = this.consume(TokenType.ClosingParenthesis)

    return {
      ...expression,
      end: cp.end,
    }
  }

  private expression() {
    return this.additiveExpression()
  }

  private additiveExpression(): LiteralNode | UnaryExpressionNode | BinaryExpressionNode {
    const start = this.lookahead.start

    let left = this.multiplicativeExpression()

    while (this.lookahead.type === TokenType.AddOperator) {
      const operator = this.consume(TokenType.AddOperator).value
      const right = this.multiplicativeExpression()
      const end = right.end
      left = this.astNodeFactory.binaryExpression(operator, left, right, start, end)
    }

    return left
  }

  private multiplicativeExpression(): LiteralNode | UnaryExpressionNode | BinaryExpressionNode {
    const start = this.lookahead.start
    let left = this.primaryExpression()

    while (this.lookahead.type === TokenType.MultiplyOperator) {
      const operator = this.consume(TokenType.MultiplyOperator).value
      const right = this.primaryExpression()
      const end = right.end
      left = this.astNodeFactory.binaryExpression(operator, left, right, start, end)
    }

    return left
  }

  private unaryExpression() {
    const start = this.lookahead.start
    const operator = this.consume(TokenType.AddOperator).value
    if (!isUnaryOperator(operator)) {
      throw new UnexpectedTokenError(TokenType.AddOperator, TokenType.Number)
    }
    const literal = this.literal()
    const end = this.lookahead.start

    return this.astNodeFactory.unaryExpression(operator, literal, start, end)
  }

  private primaryExpression() {
    switch (this.lookahead.type) {
      case TokenType.OpeningParenthesis:
        return this.parenthesizedExpression()
      case TokenType.AddOperator:
        return this.unaryExpression()
      default:
        return this.literal()
    }
  }

  private literal(): LiteralNode {
    const literalType = this.lookahead.type

    switch (literalType) {
      case TokenType.Number:
        return this.numericLiteral()
      default:
        throw new UnexpectedLiteralError(literalType)
    }
  }

  private numericLiteral(): NumericLiteralNode {
    const token = this.consume(TokenType.Number)
    return this.astNodeFactory.numericLiteral(Number(token.value), token.start, token.end)
  }
}
