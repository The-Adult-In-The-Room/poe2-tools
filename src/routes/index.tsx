import { createFileRoute } from '@tanstack/react-router'
import { pageTitle } from '#/constants/seo'
import { DpsCalc } from '../components/pages'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      {
        title: pageTitle('Weapon DPS Calculator'),
      },
    ],
  }),
})

function Home() {
  return <DpsCalc />
}
