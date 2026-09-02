import { Link } from '@tanstack/react-router'
import type { CurrencyCategory } from '#/types'

type CategoryTabsProps = {
  currentLeague: string
  currentType: CurrencyCategory
}

const categories: { value: CurrencyCategory; label: string }[] = [
  { value: 'Currency', label: 'Currency' },
  { value: 'Fragments', label: 'Fragments' },
  { value: 'Essences', label: 'Essences' },
  { value: 'SoulCores', label: 'Soul Cores' },
  { value: 'Runes', label: 'Runes' },
  { value: 'Idols', label: 'Idols' },
]

const CategoryTabs = ({ currentLeague, currentType }: CategoryTabsProps): React.JSX.Element => {
  return (
    <nav className="flex flex-wrap gap-2" data-testid="category-tabs">
      {categories.map(({ value, label }) => (
        <Link
          key={value}
          to="/currency"
          search={{ league: currentLeague, type: value }}
          replace
          className={`px-4 py-2 rounded text-sm no-underline ${
            currentType === value
              ? 'bg-primary-a50 text-dark-a0 font-semibold'
              : 'bg-surface-a20 text-light-a0 hover:bg-surface-a30'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default CategoryTabs
