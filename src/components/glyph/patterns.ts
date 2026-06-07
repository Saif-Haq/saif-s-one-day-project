import type { LedLevel, Pattern } from './types'

export const GRID_SIZE = 33

const KOALA_ROWS = [
  '....WW....WW....',
  '...WWWW..WWWW...',
  '..WGGWWWWWWGGW..',
  '.WGGWWWWWWWWGGW.',
  '.WWWWWWWWWWWWWW.',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WW.B.WWWWWW.B.WW',
  'WWWWWWWBBWWWWWWW',
  'WWWWWWWBBWWWWWWW',
  '..WWWWWWWWWWWW..',
  '...WWWWWWWWWW...',
  '..GWWWWWWWWWWG..',
  '.GWWWWWWWWWWWWG.',
  'GWWWWWWWWWWWWWWG',
  'GWWWWWWWWWWWWWWG',
  '.GWWWWWWWWWWWWG.',
  '..GGWWWWWWWWGG..',
] as const

const CHAR_LEVEL: Record<string, LedLevel> = {
  '.': 0,
  G: 1,
  W: 2,
}

function emptyGrid(size = GRID_SIZE): Pattern {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as LedLevel),
  )
}

/** Stamp ASCII art onto a square grid. W = bright, G = dim, . = off */
export function buildFromAscii(rows: readonly string[], gridSize = GRID_SIZE): Pattern {
  const grid = emptyGrid(gridSize)
  const rowOffset = Math.floor((gridSize - rows.length) / 2)
  const colOffset = Math.floor((gridSize - rows[0].length) / 2)

  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const level = CHAR_LEVEL[row[c]]
      if (level !== undefined) {
        grid[rowOffset + r][colOffset + c] = level
      }
    }
  })

  return grid
}

export const KOALA_PATTERN = buildFromAscii(KOALA_ROWS)

/** Dim every lit cell by one step — handy for pulse animations */
export function softenPattern(pattern: Pattern): Pattern {
  return pattern.map((row) =>
    row.map((cell) => (cell === 2 ? 1 : cell === 1 ? 0 : 0) as LedLevel),
  )
}

/** Swap off ↔ bright, keep dim — invert-style pulse frame */
export function invertPattern(pattern: Pattern): Pattern {
  return pattern.map((row) =>
    row.map((cell) => (cell === 0 ? 2 : cell === 2 ? 0 : 1) as LedLevel),
  )
}
