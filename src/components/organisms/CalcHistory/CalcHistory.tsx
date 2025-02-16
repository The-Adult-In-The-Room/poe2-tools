import { useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import { GiSpellBook, GiBroadsword, GiLightningTrio, GiFire, GiSnowflake2, GiHarryPotterSkull } from 'react-icons/gi'
import { createCards } from 'utils/utils'
import { Typography } from 'components'
import type { HistoricCalculation } from 'types'

import * as classes from './CalcHistory.module.css'

const iconMap = {
  physicalDps: GiBroadsword,
  elementalDps: GiSpellBook,
  lightningDps: GiLightningTrio,
  fireDps: GiFire,
  coldDps: GiSnowflake2,
  chaosDps: GiHarryPotterSkull,
}
/**
 * Calculation History panel component.
 */
const CalcHistory = ({ calcs }: { calcs: HistoricCalculation[] }) => {
  const [show, setShow] = useState<boolean>(false)
  const toggleShow = () => setShow((prev) => !prev)

  return (
    <>
      <button className={classes.fab} onClick={toggleShow} data-testid="historyFab">
        <FaHistory size={24} />
      </button>
      {show && (
        <div className={classes.historyContainer} data-testid="calcHistory">
          {calcs.map((calc) => {
            const [itemName1, itemName2] = calc.itemName || ['Manual', 'Calculation']
            const cards = createCards(calc)

            return (
              <div className={classes.innerContainer} key={calc.id} data-testid="calcHistory-item">
                <div className={classes.row} key={calc.totalDps}>
                  <div>
                    <h3>{itemName1}</h3>
                    <h4>{itemName2}</h4>
                  </div>

                  <div className={classes.totalDps} data-testid="calcHistory-totalDps">
                    <p>TOTAL DPS: {calc.totalDps.toFixed(2)}</p>
                  </div>
                </div>

                <div className={classes.dpsContainer}>
                  {cards.map(({ testId, color, value }) => {
                    const Icon = iconMap[testId]
                    return (
                      <div key={calc.id + testId} data-testid={`${calc.id}-${testId}`} className={classes.dpsItem}>
                        <Icon color={color} size={24} />
                        <Typography variant="card">{value.toFixed(2)}</Typography>
                      </div>
                    )
                  })}
                </div>
                <hr />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default CalcHistory
