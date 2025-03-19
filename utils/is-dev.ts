export function isDev() {
  return process.env.NODE_ENV === 'development'
}

export function httpOrHttps() {
  return isDev() ? 'http' : 'https'
}
