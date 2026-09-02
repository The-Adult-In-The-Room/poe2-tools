import { Link } from '@tanstack/react-router'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { externalLinks, internalLinks } from '#/data/constants'
import { Typography } from '../../atoms'

const Nav = (): React.JSX.Element => {
  return (
    <nav className="fixed flex justify-between h-16 w-full p-2 px-4 bg-surface-a10 md:flex-col md:justify-start md:h-screen md:w-[280px] md:py-16 md:px-4">
      <div>
        <h2>Path of Exile 2</h2>
        <Typography variant="subtitle">Tool kit</Typography>
      </div>

      <hr className="hidden md:block" />

      {internalLinks.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            to={link.href}
            className="[&.active]:text-primary-a50 flex items-center gap-2 py-2 text-base text-light-a0 no-underline"
            activeProps={{ className: 'text-primary-a50' }}
          >
            {Icon && <Icon size={22} />}
            {link.label}
          </Link>
        )
      })}

      <hr className="hidden md:block" />

      {externalLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="flex items-center gap-2 py-2 text-base text-light-a0 no-underline"
        >
          {link.label}
          <FaArrowUpRightFromSquare size={12} />
        </Link>
      ))}
    </nav>
  )
}

export default Nav
