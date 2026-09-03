import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { absoluteUrl, DEFAULT_OG_IMAGE, FAVICON_PATH, SITE_DESCRIPTION, SITE_NAME, THEME_COLOR } from '#/constants/seo'
import { Footer, Nav } from '../components/molecules'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: ({ matches }) => {
    const currentPathname = matches.at(-1)?.pathname ?? '/'

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: SITE_NAME,
        },
        {
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'theme-color',
          content: THEME_COLOR,
        },
        {
          property: 'og:title',
          content: SITE_NAME,
        },
        {
          property: 'og:description',
          content: SITE_DESCRIPTION,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: absoluteUrl(currentPathname),
        },
        {
          property: 'og:image',
          content: absoluteUrl(DEFAULT_OG_IMAGE),
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: SITE_NAME,
        },
        {
          name: 'twitter:description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'twitter:url',
          content: absoluteUrl(currentPathname),
        },
        {
          name: 'twitter:image',
          content: absoluteUrl(DEFAULT_OG_IMAGE),
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
        },
        {
          rel: 'icon',
          href: FAVICON_PATH,
        },
      ],
    }
  },
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div className="flex flex-col gap-4 p-4" role="alert">
      <h1 className="text-2xl font-bold text-light-a0">404</h1>
      <p className="text-light-a0">The requested page could not be found.</p>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        <main className="flex flex-col">
          <article className="flex flex-col justify-between gap-16 min-h-[calc(100vh-64px)] w-full p-4 mt-16 md:min-h-screen md:py-16 md:px-4 lg:w-[calc(100%-280px)] lg:py-16 lg:px-16 lg:ml-[280px] lg:mt-0 xl:px-64">
            {children}
            <Footer />
          </article>
        </main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
