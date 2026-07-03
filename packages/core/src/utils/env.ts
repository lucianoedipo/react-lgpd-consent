type ProcessLike = {
  env?: {
    NODE_ENV?: string
  }
}

export function getNodeEnv(): string | undefined {
  return (globalThis as unknown as { process?: ProcessLike }).process?.env?.NODE_ENV
}

export function isProductionEnv(): boolean {
  return getNodeEnv() === 'production'
}

export function isDevelopmentEnv(): boolean {
  return !isProductionEnv()
}
