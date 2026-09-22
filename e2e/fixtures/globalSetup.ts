import { startLightpanda } from './lightpanda'
import { MOCK_POE_NINJA_BASE } from './mockPoeNinjaConfig'
import { startMockPoeNinjaServer } from './mockPoeNinjaServer'

async function globalSetup(): Promise<void> {
  const USE_MOCK = process.env.USE_MOCK_POE_NINJA === 'true'

  await startLightpanda()

  if (USE_MOCK) {
    await startMockPoeNinjaServer()
    process.env.POE_NINJA_BASE = MOCK_POE_NINJA_BASE
  }
}

export default globalSetup
