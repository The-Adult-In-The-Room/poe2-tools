import { Footer, Nav } from '../../molecules'
import * as classes from './MainLayout.module.css'

const MainLayout = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  return (
    <main className={classes.container}>
      <Nav />
      <article className={classes.innerContainer}>
        {children}
        <Footer />
      </article>
    </main>
  )
}

export default MainLayout
