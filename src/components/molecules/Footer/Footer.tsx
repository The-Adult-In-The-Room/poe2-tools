import { FaHeart } from 'react-icons/fa'
import './Footer.module.css'

const Footer = () => {
  return (
    <footer>
      <p>
        Created with <FaHeart color="red" /> by
        <a
          href="https://github.com/Raymond-Cox"
          target="_blank"
          rel="noreferrer"
        >
          Raymond Cox
        </a>
      </p>

      <a
        href="https://github.com/Raymond-Cox/poe2-tools"
        target="_blank"
        rel="noreferrer"
      >
        View source code
      </a>

      <a href="https://ko-fi.com/me_am" target="_blank" rel="noreferrer">
        Buy me a coffee
        <img
          src="https://storage.ko-fi.com/cdn/brandasset/logo_white_stroke.png?"
          alt="Buy Me a Coffee"
        />
      </a>
    </footer>
  )
}

export default Footer
