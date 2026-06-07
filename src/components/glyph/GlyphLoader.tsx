import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { GlyphLED } from './GlyphLED'
import { invertPattern, softenPattern } from './patterns'
import type { GlyphLoaderProps, Pattern } from './types'
import './glyph.css'

function resolveFrames(
  pattern: Pattern | undefined,
  patterns: Pattern[] | undefined,
  mode: GlyphLoaderProps['mode'],
): Pattern[] {
  if (patterns && patterns.length > 0) return patterns
  if (!pattern) return []

  if (mode === 'pulse') return [pattern, softenPattern(pattern), pattern]
  if (mode === 'cycle') return [pattern, invertPattern(pattern)]

  return [pattern]
}

export function GlyphLoader({
  pattern,
  patterns,
  mode = 'breathe',
  intervalMs = 400,
  className,
  ...ledProps
}: GlyphLoaderProps) {
  const frames = useMemo(
    () => resolveFrames(pattern, patterns, mode),
    [pattern, patterns, mode],
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (mode === 'breathe' || frames.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [frames, intervalMs, mode])

  if (frames.length === 0) return null

  const active = frames[index] ?? frames[0]

  return (
    <div
      className={cn(
        mode === 'breathe' && 'glyph-loader-breathe',
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <GlyphLED pattern={active} {...ledProps} />
    </div>
  )
}
