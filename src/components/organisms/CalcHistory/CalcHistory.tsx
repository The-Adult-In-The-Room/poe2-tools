import { useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import { GiBroadsword, GiFire, GiHarryPotterSkull, GiLightningTrio, GiSnowflake2, GiSpellBook } from 'react-icons/gi'
import { Typography } from '#/components'
import type { HistoricCalculation } from '#/types'
import { createCards } from '#/utils/utils'

const iconMap: Record<string, React.ComponentType<{ color?: string; size?: number }>> = {
  physicalDps: GiBroadsword,
  elementalDps: GiSpellBook,
  lightningDps: GiLightningTrio,
  fireDps: GiFire,
  coldDps: GiSnowflake2,
  chaosDps: GiHarryPotterSkull,
}

const CalcHistory = ({ calcs }: { calcs: HistoricCalculation[] }) => {
  const [show, setShow] = useState<boolean>(false)
  const toggleShow = () => setShow((prev) => !prev)

  return (
    <>
      <button
        type="button"
        className="bg-primary-a50 text-dark-a0 rounded-lg p-2.5 cursor-pointer md:flex md:absolute md:bottom-0 md:right-0"
        onClick={toggleShow}
        data-testid="historyFab"
      >
        <FaHistory size={24} />
      </button>
      {show && (
        <div
          className="absolute bottom-15 right-0 flex flex-col gap-8 bg-surface-a20 text-light-a0 p-4 max-h-[200px] w-full overflow-auto rounded-lg md:bottom-0 md:right-12 md:w-auto md:max-w-[500px]"
          data-testid="calcHistory"
        >
          {calcs.map((calc) => {
            const [itemName1, itemName2] = calc.itemName || ['Manual', 'Calculation']
            const cards = createCards(calc)

            return (
              <div className="flex flex-col gap-4 min-w-fit" key={calc.id} data-testid="calcHistory-item">
                <div className="flex flex-wrap gap-8" key={calc.totalDps}>
                  <div>
                    <h3>{itemName1}</h3>
                    <h4>{itemName2}</h4>
                  </div>

                  <div className="max-h-[34px] py-2 px-4 bg-primary-a50 rounded-lg" data-testid="calcHistory-totalDps">
                    <p className="text-dark-a0 text-sm font-semibold">TOTAL DPS: {calc.totalDps.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {cards.map(({ testId, color, value }) => {
                    const Icon = iconMap[testId]
                    return (
                      <div
                        key={calc.id + testId}
                        data-testid={`${calc.id}-${testId}`}
                        className="flex items-center gap-2"
                      >
                        <Icon color={color} size={24} />
                        <Typography variant="card">{value.toFixed(2)}</Typography>
                      </div>
                    )
                  })}
                </div>
                <hr className="m-0" />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default CalcHistory
