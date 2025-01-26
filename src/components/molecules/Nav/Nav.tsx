import { Typography } from '../../atoms'
import * as classes from './Nav.module.css'

/**
 * The prefix for the path. Deployed to GitHub Pages, the prefix is '/poe2-tools'.
 */
const prefix = process.env.NODE_ENV === 'development' ? '' : '/poe2-tools'

/**
 * The links in the navigation.
 */
const links = [{ href: '/', label: 'DPS Calculator' }]

const Nav = (): React.JSX.Element => {
  return (
    <nav>
      <h2>Path of Exile 2</h2>
      <Typography variant="subtitle">Tool kit</Typography>
      <hr />
      {links.map((link) => {
        const className =
          link.href === prefix + window.location.pathname ? classes.active : ''

        return (
          <a key={link.href} href={prefix + link.href} className={className}>
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}

export default Nav
