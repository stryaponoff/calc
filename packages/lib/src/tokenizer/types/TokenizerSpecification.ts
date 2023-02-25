import type { TokenType } from '@/tokenizer/types/TokenType'

export type TokenizerSpecification = Record<TokenType, RegExp[]>
