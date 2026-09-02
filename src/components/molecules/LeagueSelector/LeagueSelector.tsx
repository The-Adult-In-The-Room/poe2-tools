import { useNavigate } from '@tanstack/react-router'
import type { CurrencyCategory, League } from '#/types'

type LeagueSelectorProps = {
  leagues: League[]
  currentLeague: string
  currentType: CurrencyCategory
}

const LeagueSelector = ({ leagues, currentLeague, currentType }: LeagueSelectorProps): React.JSX.Element => {
  const navigate = useNavigate({ from: '/currency' })

  return (
    <select
      value={currentLeague}
      onChange={(e) => {
        const league = e.target.value
        void navigate({
          to: '/currency',
          search: (prev) => ({ ...prev, league, type: currentType }),
          replace: true,
        })
      }}
      className="bg-surface-a20 text-light-a0 border border-surface-a30 rounded px-3 py-2 text-sm"
      data-testid="league-selector"
    >
      {leagues.map((league) => (
        <option key={league.id} value={league.id}>
          {league.name}
        </option>
      ))}
    </select>
  )
}

export default LeagueSelector
