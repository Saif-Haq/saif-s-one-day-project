import LiquidAscii from '../components/react-bits/liquid-ascii'

export default function ComingSoon() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <LiquidAscii
        width="100%"
        height="100%"
        color="#ffffff"
        backgroundColor="#000000"
        fillHeight={0.45}
        cellSize={14}
        autoWave
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <p className="text-white/40 tracking-[0.3em] text-xs uppercase mb-4 font-mono">
          something is coming
        </p>
        
        <p className='text-white text-6xl font-bold'>Coming Soon</p>
        <p className="text-white/30 text-sm mt-6 font-mono tracking-widest">
          stay tuned
        </p>
    </div>
    </div>
  )
}
