import { FaHeart, FaPaintBrush } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="flex flex-col flex-wrap items-center gap-4 md:flex-row md:justify-evenly">
      <p className="flex items-center gap-1">
        Created with <FaHeart color="red" /> by
        <a
          href="https://github.com/The-Adult-In-The-Room"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1"
        >
          Raymond Cox
        </a>
      </p>
      <p className="flex items-center gap-1">
        <FaPaintBrush color="#cf168f" /> Designed by{' '}
        <a href="https://thedesignerdev.com/" className="flex items-center gap-1">
          The Designer Dev
        </a>
      </p>
      <a href="https://github.com/The-Adult-In-The-Room/poe2-tools" target="_blank" rel="noreferrer">
        View source code
      </a>
      <a href="https://ko-fi.com/me_am" target="_blank" rel="noreferrer">
        Buy me a coffee
        <img
          src="https://storage.ko-fi.com/cdn/brandasset/logo_white_stroke.png?"
          alt="Buy Me a Coffee"
          className="w-[55px]"
        />
      </a>
    </footer>
  )
}

export default Footer
