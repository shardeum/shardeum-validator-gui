type TitleProps = {
  text: string
  className?: string
}

export const Title: React.FC<TitleProps> = ({ text, className }) => {
  return <h1 className={className || 'text-2xl font-bold text-gray-900'}>{text}</h1>
}
