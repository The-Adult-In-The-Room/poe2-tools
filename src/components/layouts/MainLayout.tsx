import * as classes from './MainLayout.module.css'

const MainLayout = ({
  children,
}: React.PropsWithChildren): React.JSX.Element => {
  return <div className={classes.container}>{children}</div>
}

export default MainLayout
