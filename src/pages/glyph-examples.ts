import { KOALA_PATTERN, type LedLevel } from '@/components/glyph'

export type { LedLevel }

export const EXAMPLE_KOALA_ID = 'example-koala'

export type GlyphFrame = {
  id: string
  title: string
  handle: string
  grid: LedLevel[][]
  createdAt: number
  updatedAt: number
}

export function isExampleFrame(id: string): boolean {
  return id === EXAMPLE_KOALA_ID
}

export const EXAMPLE_KOALA: GlyphFrame = {
  id: EXAMPLE_KOALA_ID,
  title: 'Koala',
  handle: '@pauwma',
  grid: KOALA_PATTERN,
  createdAt: 0,
  updatedAt: 0,
}

export const EXAMPLE_FRAMES: GlyphFrame[] = [EXAMPLE_KOALA]
