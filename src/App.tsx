import './App.module.css'
import { DpsCalc, MainLayout } from './components'

/**
 * Main component of the application.
 */
const App = (): React.JSX.Element => {
  return (
    <MainLayout>
      <DpsCalc />
    </MainLayout>
  )
}

export default App
