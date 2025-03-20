import Image from 'next/image'
import logo from '../../assets/black-logo.svg'
import minimalLogo from '../../assets/minimal-black-logo.svg'

type LogoProps = {
  className?: string
  isMinimalLogo?: boolean
}

export const Logo: React.FC<LogoProps> = ({ className, isMinimalLogo = false }: LogoProps) => {
  return (
    <>
      {!isMinimalLogo && <Image className={className || 'w-32'} src={logo} alt="Shardeum Logo" priority />}
      {isMinimalLogo && <Image className={className || 'w-32'} src={minimalLogo} alt="Shardeum Logo" priority />}
    </>
  )
}
