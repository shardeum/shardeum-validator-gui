import { StaticImageData } from 'next/image'
import Image from 'next/image'

type BgImageProps = {
  src: StaticImageData
  alt?: string
}

export const BgImage = ({ src, alt = '' }: BgImageProps) => {
  return (
    <div style={{ width: '100%' }}>
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        priority
      ></Image>
    </div>
  )
}
