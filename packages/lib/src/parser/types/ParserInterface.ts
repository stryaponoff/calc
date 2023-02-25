import type { ProgramNode } from '@/ast/AstNode'

export interface ParserInterface {
  parse(input: string): ProgramNode
}
