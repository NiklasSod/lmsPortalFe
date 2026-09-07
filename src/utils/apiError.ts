export async function parseApiError(
  res: Response,
  fallback: string,
): Promise<string> {
  const text = await res.text()
  if (!text) return fallback

  try {
    const data = JSON.parse(text)
    if (typeof data === 'string') return data
    if (data?.message) return String(data.message)
    if (data?.title) return String(data.title)
  } catch {
    // body is plain text
  }

  return text
}
