export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

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

export async function toApiError(
  res: Response,
  fallback: string,
): Promise<ApiError> {
  return new ApiError(res.status, await parseApiError(res, fallback))
}
