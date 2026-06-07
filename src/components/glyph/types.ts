/** 0 = off, 1 = dim, 2 = bright */
export type LedLevel = 0 | 1 | 2

export type Pattern = LedLevel[][]

export type GlyphLEDProps = {
  pattern: Pattern
  size?: number
  cellSize?: number
  gap?: number
  brightColor?: string
  dimColor?: string
  offColor?: string
  ring?: boolean
  className?: string
}

export type GlyphLoaderMode = 'cycle' | 'breathe' | 'pulse'

export type GlyphLoaderProps = Omit<GlyphLEDProps, 'pattern'> & {
  /** Single pattern — used with breathe/pulse */
  pattern?: Pattern
  /** Multiple patterns — used with cycle */
  patterns?: Pattern[]
  mode?: GlyphLoaderMode
  intervalMs?: number
}
