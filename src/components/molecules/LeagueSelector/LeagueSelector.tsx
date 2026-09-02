import type { CurrencyCategory, League } from '#/types'

type LeagueSelectorProps = {
  leagues: League[]
  currentLeague: string
  currentType: CurrencyCategory
}

const LeagueSelector = ({ leagues, currentLeague, currentType }: LeagueSelectorProps): React.JSX.Element => {
  return (
    <select
      value={currentLeague}
      onChange={(e) => {
        const url = new URL(window.location.href)
        url.searchParams.set('league', e.target.value)
        url.searchParams.set('type', currentType)
        window.location.href = url.toString()
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
