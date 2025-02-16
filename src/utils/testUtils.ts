import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

/**
 * Setup function which includes all the utilities for testing.
 * @see https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
 */
export const setup = (jsx: React.ReactNode) => {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}
