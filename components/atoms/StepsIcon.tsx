type StepsIconProps = {
  fillColor: string
  className?: string
}

export const StepsIcon = ({ fillColor, className }: StepsIconProps) => {
  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 8 9"
      fill={fillColor}
      className={className || 'h-3 w-3'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5625 3.68555V0.310547H0.0625V8.18555H7.9375V3.68555H4.5625ZM3.4375 1.43555H1.1875V3.68555H3.4375V1.43555ZM1.1875 7.06055H3.4375V4.81055H1.1875V7.06055ZM4.5625 7.06055H6.8125V4.81055H4.5625V7.06055Z"
        fill={fillColor}
      />
    </svg>
  )
}
