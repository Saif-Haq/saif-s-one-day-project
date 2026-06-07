import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Copy,
  Eraser,
  Grid3X3,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EXAMPLE_FRAMES,
  isExampleFrame,
  type GlyphFrame,
  type LedLevel,
} from './glyph-examples'
import './glyphs.css'

const GRID_SIZE = 33
const STORAGE_KEY = 'glyph-frames-v2'
const LEGACY_STORAGE_KEY = 'glyph-frames-v1'

type View = 'gallery' | 'editor'

const LED_LEVELS: { level: LedLevel; label: string; className: string }[] = [
  { level: 2, label: 'Bright', className: 'glyph-led-cell--bright' },
  { level: 1, label: 'Dim', className: 'glyph-led-cell--dim' },
  { level: 0, label: 'Off', className: 'glyph-led-cell--off' },
]

function createEmptyGrid(size = GRID_SIZE): LedLevel[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as LedLevel),
  )
}

function cloneGrid(grid: LedLevel[][]): LedLevel[][] {
  return grid.map((row) => [...row])
}

function isValidGrid(grid: unknown): grid is LedLevel[][] {
  return (
    Array.isArray(grid) &&
    grid.length === GRID_SIZE &&
    grid.every(
      (row) =>
        Array.isArray(row) &&
        row.length === GRID_SIZE &&
        row.every((cell) => cell === 0 || cell === 1 || cell === 2),
    )
  )
}

function migrateLegacyGrid(grid: unknown): LedLevel[][] | null {
  if (
    !Array.isArray(grid) ||
    grid.length !== GRID_SIZE ||
    !grid.every((row) => Array.isArray(row) && row.length === GRID_SIZE)
  ) {
    return null
  }
  return grid.map((row) =>
    row.map((cell) => (cell ? (2 as LedLevel) : (0 as LedLevel))),
  )
}

function loadUserFrames(): GlyphFrame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as GlyphFrame[]
      return parsed.filter(
        (f) => f.id && !isExampleFrame(f.id) && isValidGrid(f.grid),
      )
    }

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacy) return []
    const parsed = JSON.parse(legacy) as Array<Omit<GlyphFrame, 'grid'> & { grid: unknown }>
    return parsed
      .map((f) => {
        const grid = migrateLegacyGrid(f.grid)
        return grid ? ({ ...f, grid } satisfies GlyphFrame) : null
      })
      .filter((f): f is GlyphFrame => f !== null)
  } catch {
    return []
  }
}

function loadFrames(): GlyphFrame[] {
  return [...EXAMPLE_FRAMES, ...loadUserFrames()]
}

function saveUserFrames(frames: GlyphFrame[]) {
  const userFrames = frames.filter((f) => !isExampleFrame(f.id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userFrames))
}

function cellClass(level: LedLevel): string {
  return LED_LEVELS.find((l) => l.level === level)?.className ?? 'glyph-led-cell--off'
}

function gridToPattern(grid: LedLevel[][]): number[][] {
  return grid.map((row) => [...row])
}

function generateReactCode(frame: GlyphFrame): string {
  const pattern = gridToPattern(frame.grid)
  const patternStr = pattern.map((row) => `  [${row.join(', ')}]`).join(',\n')

  return `import { GlyphLED } from '@/components/glyph'

/** ${frame.title} — ${frame.handle} */
const PATTERN = [
${patternStr}
] as const

export function ${toComponentName(frame.title)}() {
  return (
    <GlyphLED
      pattern={PATTERN}
      size={${GRID_SIZE}}
      cellSize={4}
      gap={1}
      ring
    />
  )
}
`
}

function toComponentName(title: string): string {
  const base = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  return base ? `${base}Glyph` : 'MyGlyph'
}

function GlyphMatrix({
  grid,
  editable = false,
  onCellChange,
  brush = 2,
  className,
  size = 'md',
}: {
  grid: LedLevel[][]
  editable?: boolean
  onCellChange?: (row: number, col: number, value: LedLevel) => void
  brush?: LedLevel
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const drawing = useRef(false)
  const drawMode = useRef<LedLevel | null>(null)

  const stopDrawing = useCallback(() => {
    drawing.current = false
    drawMode.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('pointerup', stopDrawing)
    window.addEventListener('pointercancel', stopDrawing)
    return () => {
      window.removeEventListener('pointerup', stopDrawing)
      window.removeEventListener('pointercancel', stopDrawing)
    }
  }, [stopDrawing])

  const handlePointerDown = (row: number, col: number) => {
    if (!editable || !onCellChange) return
    drawMode.current = brush
    drawing.current = true
    onCellChange(row, col, brush)
  }

  const handlePointerEnter = (row: number, col: number) => {
    if (!editable || !onCellChange || !drawing.current || drawMode.current === null) return
    if (grid[row][col] !== drawMode.current) {
      onCellChange(row, col, drawMode.current)
    }
  }

  const padding = size === 'sm' ? '6%' : size === 'lg' ? '5%' : '5.5%'
  const gap = size === 'sm' ? '1px' : '1.5px'

  return (
    <div className={cn('glyph-led-ring w-full aspect-square', className)}>
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ padding }}
      >
        <div
          className="w-full h-full grid select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap,
          }}
        >
          {grid.map((row, r) =>
            row.map((level, c) => (
              <div
                key={`${r}-${c}`}
                role={editable ? 'button' : undefined}
                aria-pressed={editable ? level > 0 : undefined}
                className={cn(
                  'glyph-led-cell',
                  cellClass(level),
                  editable && 'glyph-led-cell--editable',
                )}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handlePointerDown(r, c)
                }}
                onPointerEnter={() => handlePointerEnter(r, c)}
              />
            )),
          )}
        </div>
      </div>
    </div>
  )
}

function FrameCard({
  frame,
  onOpen,
  onDelete,
}: {
  frame: GlyphFrame
  onOpen: () => void
  onDelete: () => void
}) {
  const example = isExampleFrame(frame.id)

  return (
    <article className="glyph-frame-card glyph-animate-in p-4 flex flex-col gap-3 group">
      <button type="button" onClick={onOpen} className="text-left w-full">
        <GlyphMatrix grid={frame.grid} size="sm" />
        <h2 className="glyph-serif text-xl mt-3 tracking-tight">{frame.title}</h2>
        <p className="text-[var(--glyph-muted)] text-xs mt-0.5">{frame.handle}</p>
      </button>
      {!example && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-end text-[var(--glyph-muted)] hover:text-red-400 p-1"
          aria-label={`Delete ${frame.title}`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </article>
  )
}

function CodeExportPanel({
  frame,
  onClose,
}: {
  frame: GlyphFrame
  onClose: () => void
}) {
  const code = useMemo(() => generateReactCode(frame), [frame])
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glyph-animate-in w-full max-w-2xl max-h-[85dvh] flex flex-col bg-[#111] rounded-2xl border border-[#222] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div>
            <h3 className="glyph-serif text-xl">Export React Code</h3>
            <p className="text-xs text-[var(--glyph-muted)] mt-0.5">
              Self-contained component — paste into any React project
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--glyph-muted)] hover:text-white rounded-full hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="glyph-code-panel m-4 flex-1 min-h-0 overflow-hidden">
          <pre className="p-4 text-[11px] leading-relaxed text-[#c8c8c8] overflow-auto max-h-[50dvh] whitespace-pre">
            {code}
          </pre>
        </div>

        <div className="flex gap-3 px-4 pb-4">
          <button
            type="button"
            onClick={copy}
            className="glyph-accent-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Editor({
  frame,
  onSave,
  onSaveCopy,
  onBack,
}: {
  frame: GlyphFrame
  onSave: (frame: GlyphFrame) => void
  onSaveCopy: (frame: GlyphFrame) => void
  onBack: () => void
}) {
  const example = isExampleFrame(frame.id)
  const [draft, setDraft] = useState<GlyphFrame>(() => ({
    ...frame,
    grid: cloneGrid(frame.grid),
  }))
  const [brush, setBrush] = useState<LedLevel>(2)
  const [showExport, setShowExport] = useState(false)

  const handleCellChange = (row: number, col: number, value: LedLevel) => {
    setDraft((prev) => {
      const next = cloneGrid(prev.grid)
      next[row][col] = value
      return { ...prev, grid: next }
    })
  }

  const clearGrid = () => setDraft((prev) => ({ ...prev, grid: createEmptyGrid() }))

  const invertGrid = () =>
    setDraft((prev) => ({
      ...prev,
      grid: prev.grid.map((row) =>
        row.map((cell) => (cell === 0 ? 2 : cell === 2 ? 0 : 1) as LedLevel),
      ),
    }))

  const save = () => {
    const saved = { ...draft, updatedAt: Date.now() }
    if (example) {
      onSaveCopy(saved)
    } else {
      onSave(saved)
    }
    onBack()
  }

  const levels = draft.grid.flat()
  const brightCount = levels.filter((l) => l === 2).length
  const dimCount = levels.filter((l) => l === 1).length

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--glyph-muted)] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          Frames
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#333] text-xs hover:border-[#555] transition-colors"
          >
            <Copy size={14} />
            Export
          </button>
          <button
            type="button"
            onClick={save}
            className="glyph-accent-btn px-4 py-2 rounded-full text-sm font-medium"
          >
            {example ? 'Save Copy' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-5 pb-8 gap-6">
        <div className="w-full max-w-[340px] glyph-animate-in">
          <GlyphMatrix
            grid={draft.grid}
            editable
            brush={brush}
            size="lg"
            onCellChange={handleCellChange}
          />
          <p className="text-center text-[10px] text-[var(--glyph-muted)] mt-3">
            {brightCount} bright · {dimCount} dim · drag to paint
          </p>
        </div>

        <div className="w-full max-w-[340px] space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[var(--glyph-muted)]">
              Title
            </label>
            <input
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              className="glyph-serif w-full mt-1 bg-transparent border-b border-[#333] pb-2 text-2xl outline-none focus:border-white/40 transition-colors"
              placeholder="Untitled"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[var(--glyph-muted)]">
              Handle
            </label>
            <input
              value={draft.handle}
              onChange={(e) => setDraft((p) => ({ ...p, handle: e.target.value }))}
              className="w-full mt-1 bg-transparent border-b border-[#333] pb-2 text-sm outline-none focus:border-white/40 transition-colors"
              placeholder="@you"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--glyph-muted)] mr-1">
              Brush
            </span>
            <BrushSwatch level={2} active={brush === 2} onSelect={() => setBrush(2)} />
            <BrushSwatch level={1} active={brush === 1} onSelect={() => setBrush(1)} />
            <button
              type="button"
              onClick={() => setBrush(0)}
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center transition-colors',
                brush === 0
                  ? 'border-white bg-white/10'
                  : 'border-[#333] hover:border-[#555]',
              )}
              aria-label="Eraser"
            >
              <Eraser size={14} className="text-[var(--glyph-muted)]" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ToolButton onClick={clearGrid} icon={<Trash2 size={15} />} label="Clear" />
            <ToolButton onClick={invertGrid} icon={<Grid3X3 size={15} />} label="Invert" />
          </div>
        </div>
      </div>

      {showExport && (
        <CodeExportPanel frame={draft} onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}

function BrushSwatch({
  level,
  active,
  onSelect,
}: {
  level: LedLevel
  active: boolean
  onSelect: () => void
}) {
  const meta = LED_LEVELS.find((l) => l.level === level)!
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={meta.label}
      className={cn(
        'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform',
        active ? 'border-white scale-110' : 'border-[#333] hover:border-[#555]',
      )}
    >
      <span className={cn('w-4 h-4 rounded-sm', meta.className)} />
    </button>
  )
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
}: {
  active?: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs border transition-colors',
        active
          ? 'border-white bg-white/10 text-white'
          : 'border-[#333] text-[var(--glyph-muted)] hover:border-[#555] hover:text-white',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Gallery({
  frames,
  onNew,
  onOpen,
  onDelete,
}: {
  frames: GlyphFrame[]
  onNew: () => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors"
            aria-label="Home"
          />
          <h1 className="glyph-serif text-3xl tracking-tight">Frames</h1>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="glyph-accent-btn w-10 h-10 rounded-full flex items-center justify-center"
          aria-label="New frame"
        >
          <Grid3X3 size={18} className="text-white" strokeWidth={2.5} />
        </button>
      </header>

      <div className="px-5 pb-3 flex justify-end">
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-1.5 text-xs text-[var(--glyph-muted)] hover:text-white transition-colors"
        >
          <Plus size={14} />
          New frame
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pb-8 sm:max-w-lg sm:mx-auto sm:w-full">
        {frames.map((frame) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            onOpen={() => onOpen(frame.id)}
            onDelete={() => onDelete(frame.id)}
          />
        ))}
      </div>
    </div>
  )
}

export const Glyphs = () => {
  const [frames, setFrames] = useState<GlyphFrame[]>(() => loadFrames())
  const [view, setView] = useState<View>('gallery')
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    saveUserFrames(frames)
  }, [frames])

  const activeFrame = frames.find((f) => f.id === activeId)

  const createFrame = () => {
    const now = Date.now()
    const frame: GlyphFrame = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      handle: '@you',
      grid: createEmptyGrid(),
      createdAt: now,
      updatedAt: now,
    }
    setFrames((prev) => [frame, ...prev])
    setActiveId(frame.id)
    setView('editor')
  }

  const openFrame = (id: string) => {
    setActiveId(id)
    setView('editor')
  }

  const saveFrame = (frame: GlyphFrame) => {
    setFrames((prev) => prev.map((f) => (f.id === frame.id ? frame : f)))
  }

  const saveFrameCopy = (frame: GlyphFrame) => {
    const now = Date.now()
    const copy: GlyphFrame = {
      ...frame,
      id: crypto.randomUUID(),
      title: `${frame.title} copy`,
      createdAt: now,
      updatedAt: now,
      grid: cloneGrid(frame.grid),
    }
    setFrames((prev) => [...EXAMPLE_FRAMES, copy, ...prev.filter((f) => !isExampleFrame(f.id))])
  }

  const deleteFrame = (id: string) => {
    if (isExampleFrame(id)) return
    setFrames((prev) => prev.filter((f) => f.id !== id))
  }

  const backToGallery = () => {
    setView('gallery')
    setActiveId(null)
  }

  return (
    <div className="glyph-page">
      {view === 'gallery' && (
        <Gallery
          frames={frames}
          onNew={createFrame}
          onOpen={openFrame}
          onDelete={deleteFrame}
        />
      )}
      {view === 'editor' && activeFrame && (
        <Editor
          frame={activeFrame}
          onSave={saveFrame}
          onSaveCopy={saveFrameCopy}
          onBack={backToGallery}
        />
      )}
    </div>
  )
}
