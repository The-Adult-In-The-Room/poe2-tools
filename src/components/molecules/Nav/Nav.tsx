import { Typography } from '../../atoms'
import { FaCalculator } from 'react-icons/fa6'
import * as classes from './Nav.module.css'

/**
 * The links in the navigation.
 */
const links = [{ href: '/', label: 'Weapon DPS Calculator' }]

const Nav = (): React.JSX.Element => {
  /**
   * The prefix for the path. Deployed to GitHub Pages, the prefix is '/poe2-tools'.
   * DO NOT MOVE THIS OUT OF THE COMPONENT, IT WILL BREAK THE TESTS.
   */
  const prefix = process.env.NODE_ENV === 'development' ? '' : '/poe2-tools'
  return (
    <nav>
      <div>
        <h2>Path of Exile 2</h2>
        <Typography variant="subtitle">Tool kit</Typography>
      </div>
      <hr />
      {links.map((link) => {
        const to = prefix + link.href
        const className = to === window.location.pathname ? classes.active : ''

        return (
          <a key={link.href} href={to} className={className}>
            <FaCalculator size={22} />
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}

export default Nav
