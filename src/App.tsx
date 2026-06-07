import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import { LiquidSaifHaqLogo } from '@/pages/LiquidSaifHaqLogo'
import { Glyphs } from './pages/Glyphs'
import { GlyphUIKit } from './pages/GlyphUIKit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/liquid-saif-haq-logo" element={<LiquidSaifHaqLogo />} />

      <Route path="/glyphs" element={<Glyphs />} />
      <Route path="/glyph-ui" element={<GlyphUIKit />} />

    </Routes>
  )
}
