import { Typography } from '../../atoms'
import * as classes from './Nav.module.css'

const links = [{ href: '/', label: 'DPS Calculator' }]

const Nav = (): React.JSX.Element => {
  return (
    <nav>
      <h2>Path of Exile 2</h2>
      <Typography variant="subtitle">Tool kit</Typography>
      <hr />
      {links.map((link) => {
        const className =
          link.href === window.location.pathname ? classes.active : ''

        return (
          <a key={link.href} href={link.href} className={className}>
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}

export default Nav
