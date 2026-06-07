import { cn } from '@/lib/utils'
import type { GlyphLEDProps, LedLevel } from './types'
import './glyph.css'

const LED_STYLE = (
  bright: string,
  dim: string,
  off: string,
): Record<LedLevel, { bg: string; glow?: string }> => ({
  0: { bg: off },
  1: { bg: dim, glow: '0 0 3px rgba(255,255,255,0.12)' },
  2: {
    bg: bright,
    glow: '0 0 2px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.35)',
  },
})

export function GlyphLED({
  pattern,
  size = pattern.length,
  cellSize = 4,
  gap = 1,
  brightColor = '#ffffff',
  dimColor = '#737373',
  offColor = '#1a1a1a',
  ring = false,
  className,
}: GlyphLEDProps) {
  const colors = LED_STYLE(brightColor, dimColor, offColor)
  const diameter = cellSize * size + gap * (size + 1)

  return (
    <div
      className={cn(ring && 'glyph-led-ring', className)}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#0a0a0a',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gap,
          padding: gap,
        }}
      >
        {pattern.flatMap((row, r) =>
          row.map((cell, c) => {
            const level = (cell === 2 ? 2 : cell === 1 ? 1 : 0) as LedLevel
            const { bg, glow } = colors[level]
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 1,
                  background: bg,
                  boxShadow: glow,
                }}
              />
            )
          }),
        )}
      </div>
    </div>
  )
}
