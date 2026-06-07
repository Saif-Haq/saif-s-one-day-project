import { Link } from 'react-router-dom'
import { GlyphLED, GlyphLoader, KOALA_PATTERN } from '@/components/glyph'

const USAGE = `// Copy src/components/glyph/ into your portfolio, then:

import { GlyphLED, GlyphLoader } from '@/components/glyph'
import { KOALA_PATTERN } from '@/components/glyph/patterns'

// Page loader
<GlyphLoader pattern={KOALA_PATTERN} mode="breathe" cellSize={3} ring />

// Hero accent
<GlyphLED pattern={KOALA_PATTERN} cellSize={3} ring />

// Footer signature (tiny)
<GlyphLED pattern={KOALA_PATTERN} cellSize={2} />`

export const GlyphUIKit = () => {
  return (
    <div className="min-h-dvh bg-black text-white font-mono">
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link
          to="/"
          className="text-xs text-white/50 hover:text-white transition-colors"
        >
          ← Home
        </Link>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          Portfolio UI kit
        </p>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-14">
        <section>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
            1 — Page loader
          </p>
          <div className="flex items-center justify-center py-12 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <GlyphLoader
              pattern={KOALA_PATTERN}
              mode="breathe"
              cellSize={3}
              ring
            />
          </div>
          <p className="text-xs text-white/40 mt-3">
            <code className="text-white/60">mode="breathe"</code> · also try{' '}
            <code className="text-white/60">pulse</code> or{' '}
            <code className="text-white/60">cycle</code>
          </p>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
            2 — Hero accent
          </p>
          <div className="flex items-center gap-5 py-8 px-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <GlyphLED pattern={KOALA_PATTERN} cellSize={3} ring />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Your Name</h1>
              <p className="text-sm text-white/50 mt-1">Design · Frontend · etc.</p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
            3 — Footer signature
          </p>
          <div className="flex items-center justify-between py-5 px-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <span className="text-xs text-white/40">© 2026</span>
            <GlyphLED pattern={KOALA_PATTERN} cellSize={2} />
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
            4 — Pulse loader
          </p>
          <div className="flex items-center justify-center py-10 rounded-2xl bg-[#0a0a0a] border border-white/5">
            <GlyphLoader
              pattern={KOALA_PATTERN}
              mode="pulse"
              intervalMs={500}
              cellSize={3}
              ring
            />
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
            Drop-in folder
          </p>
          <pre className="text-[11px] leading-relaxed text-white/50 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 overflow-x-auto whitespace-pre">
            {`src/components/glyph/
  GlyphLED.tsx
  GlyphLoader.tsx
  patterns.ts
  types.ts
  glyph.css
  index.ts`}
          </pre>
          <pre className="text-[11px] leading-relaxed text-white/50 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 mt-3 overflow-x-auto whitespace-pre">
            {USAGE}
          </pre>
        </section>
      </main>
    </div>
  )
}
