export function truncateMiddle(str: string | null | undefined, front = 4, back = 4) {
  if (str == null) {
    return ''
  }
  if (str.length <= front + back) return str
  return str.slice(0, front) + '...' + str.slice(-back)
}
