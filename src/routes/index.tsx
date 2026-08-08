import { createFileRoute } from '@tanstack/react-router'
import { DpsCalc } from '../components/pages'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <DpsCalc />
}
