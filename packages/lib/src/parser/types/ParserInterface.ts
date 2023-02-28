import type { ProgramNode } from '@/ast/types/AstNode'

export interface ParserInterface {
  parse(input: string): ProgramNode
}
