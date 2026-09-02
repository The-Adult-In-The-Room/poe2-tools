import { MOCK_POE_NINJA_BASE } from './mockPoeNinjaConfig'
import { stopMockPoeNinjaServer } from './mockPoeNinjaServer'

async function globalTeardown(): Promise<void> {
  await stopMockPoeNinjaServer(MOCK_POE_NINJA_BASE)
}

export default globalTeardown
