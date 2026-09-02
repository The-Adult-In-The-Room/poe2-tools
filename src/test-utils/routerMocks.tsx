import type { ReactNode } from 'react'
import { vi } from 'vitest'

type MockLinkProps = {
  children: ReactNode
  to: string
  className?: string
  replace?: boolean
  activeProps?: { className?: string }
}

export const mockNavigate = vi.fn()

export const MockLink = ({ children, to, className, replace, activeProps, ...props }: MockLinkProps) => (
  <a
    href={to}
    className={`${className ?? ''} ${activeProps?.className ?? ''}`.trim() || undefined}
    data-replace={replace ? 'true' : undefined}
    {...props}
  >
    {children}
  </a>
)

export const routerMock = {
  Link: MockLink,
  useNavigate: () => mockNavigate,
}
