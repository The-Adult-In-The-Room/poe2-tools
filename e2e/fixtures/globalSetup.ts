import { MOCK_POE_NINJA_BASE } from './mockPoeNinjaConfig'
import { startMockPoeNinjaServer } from './mockPoeNinjaServer'

async function globalSetup(): Promise<void> {
  await startMockPoeNinjaServer()
  process.env.POE_NINJA_BASE = MOCK_POE_NINJA_BASE
}

export default globalSetup
