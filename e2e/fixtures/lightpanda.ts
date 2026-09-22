import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { lightpanda } from '@lightpanda/browser'

export const LIGHTPANDA_HOST = '127.0.0.1'
export const LIGHTPANDA_PORT = 9222
export const LIGHTPANDA_WS_ENDPOINT = `ws://${LIGHTPANDA_HOST}:${LIGHTPANDA_PORT}`

let proc: ChildProcessWithoutNullStreams | undefined

async function waitForCdpServer(timeoutMs = 10000): Promise<void> {
  const start = Date.now()
  const healthUrl = `http://${LIGHTPANDA_HOST}:${LIGHTPANDA_PORT}/json/version`

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(healthUrl)
      if (response.ok) return
    } catch {
      // Server is not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`Lightpanda CDP server did not become ready within ${timeoutMs}ms`)
}

export async function startLightpanda(): Promise<void> {
  if (proc && !proc.killed) {
    return
  }

  proc = await lightpanda.serve({
    host: LIGHTPANDA_HOST,
    port: LIGHTPANDA_PORT,
  })

  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)

  await waitForCdpServer()
}

export async function stopLightpanda(): Promise<void> {
  if (!proc || proc.killed) {
    return
  }

  const exitPromise = new Promise<void>((resolve) => {
    proc?.once('exit', () => resolve())
  })

  proc.kill()
  await exitPromise
  proc = undefined
}
