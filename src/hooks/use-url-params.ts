export const useUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const params: Record<string, string> = {}

  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }

  return params
}
