import type { Token } from '@/tokenizer/types/Token'

export interface TokenizerInterface {
  tokenize(input: string): Generator<Token, null>
}
