import { stopLightpanda } from './lightpanda'
import { MOCK_POE_NINJA_BASE } from './mockPoeNinjaConfig'
import { stopMockPoeNinjaServer } from './mockPoeNinjaServer'

async function globalTeardown(): Promise<void> {
  const USE_MOCK = process.env.USE_MOCK_POE_NINJA === 'true'

  if (USE_MOCK) {
    await stopMockPoeNinjaServer(MOCK_POE_NINJA_BASE)
  }

  await stopLightpanda()
}

export default globalTeardown
