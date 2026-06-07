import MetallicPaint from '@/components/react-bits/metallic-paint'
import saifHaqLogo from '@/assets/SAIFHAQ.png'

export const LiquidSaifHaqLogo = () => {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center width-[40%]">
    <MetallicPaint
      imageSrc={saifHaqLogo}
      seed={42}
      scale={18}
      patternSharpness={1}
      noiseScale={0.5}
      speed={0.3}
      liquid={0.75}
    />
    </div>
  )
}
