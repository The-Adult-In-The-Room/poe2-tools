import { Footer, Nav } from '../../molecules'

const MainLayout = ({ children }: React.PropsWithChildren): React.JSX.Element => {
  return (
    <main className="flex flex-col">
      <Nav />
      <article className="flex flex-col justify-between gap-16 min-h-[calc(100vh-64px)] w-full p-4 mt-16 md:min-h-screen md:py-16 md:px-4 lg:w-[calc(100%-280px)] lg:py-16 lg:px-16 lg:ml-[280px] lg:mt-0 xl:px-64">
        {children}
        <Footer />
      </article>
    </main>
  )
}

export default MainLayout
