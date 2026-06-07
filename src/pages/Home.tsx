import { Link } from 'react-router-dom'
import heroImg from '../assets/Chains.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-start p-10 font-mono">
      <nav className="flex flex-col gap-2">
        <Link
          to="/coming-soon"
          className="text-white hover:text-white/60 transition-colors text-lg"
        >
          1. Coming Soon
        </Link>
        <Link
          to="/liquid-saif-haq-logo"
          className="text-white hover:text-white/60 transition-colors text-lg"
        >
          2. Liquid Saif Haq Logo
        </Link>
        <Link
          to="/glyphs"
          className="text-white hover:text-white/60 transition-colors text-lg"
        >
          3. Glyphs
        </Link>
        <Link
          to="/glyph-ui"
          className="text-white hover:text-white/60 transition-colors text-lg"
        >
          4. Glyph UI Kit
        </Link>
      </nav>

      <img src={heroImg} alt="Hero" className="w-1/2" />
    </div>
  )
}
