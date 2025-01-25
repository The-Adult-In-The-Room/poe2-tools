import { Input } from '../../atoms'
import * as classes from './DpsCalc.module.css'

const sections: { label: string; id: string }[] = [
  {
    label: 'Physical',
    id: 'physical',
  },
  {
    label: 'Fire',
    id: 'fire',
  },
  {
    label: 'Cold',
    id: 'cold',
  },
  {
    label: 'Lightning',
    id: 'lightning',
  },
]

const DpsCalc = () => {
  return (
    <div className={classes.container}>
      <h2>DAMAGE PER SECOND CALCULATOR</h2>
      <form>
        {sections.map(({ id, label }) => (
          <>
            <h3>{label}</h3>

            <div key={id} className={classes.row}>
              <Input id={`${id}-min`} label="Min" placeholder="0" />
              <Input id={`${id}-max`} label="Max" placeholder="0" />
            </div>
          </>
        ))}
      </form>
    </div>
  )
}

export default DpsCalc
