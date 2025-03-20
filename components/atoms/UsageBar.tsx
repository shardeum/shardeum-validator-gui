type UsageBarProps = {
  usage: number
  className?: string
}

const getUsageType = (usage: number) => {
  if (usage === 0) {
    return 'neutral'
  }
  if (usage <= 50) {
    return 'low'
  }
  return 'high'
}

export const UsageBar = ({ usage, className }: UsageBarProps) => {
  const usageType = getUsageType(usage)

  return (
    <div
      className={
        className ||
        `w-full h-2 ${usageType === 'neutral' ? 'bg-subtleBg' : usageType === 'low' ? 'bg-successBg' : 'bg-severeBg'}`
      }
    >
      <div
        className={`h-full ${
          usageType === 'neutral' ? 'bg-subtleFg' : usageType === 'low' ? 'bg-successFg' : 'bg-severeFg'
        }`}
        style={{
          width: `${usage}%`,
        }}
      ></div>
    </div>
  )
}
