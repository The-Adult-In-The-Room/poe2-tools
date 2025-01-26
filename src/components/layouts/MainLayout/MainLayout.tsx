import { Nav } from '../../molecules'
import * as classes from './MainLayout.module.css'

const MainLayout = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  return (
    <div className={classes.container}>
      <Nav />
      <div className={classes.innerContainer}>{children}</div>
    </div>
  )
}

export default MainLayout
