import { FaHeart, FaPaintBrush } from 'react-icons/fa'
import './Footer.module.css'

const Footer = () => {
  return (
    <footer>
      <p>
        Created with <FaHeart color="red" /> by
        <a href="https://github.com/The-Adult-In-The-Room" target="_blank" rel="noreferrer">
          Raymond Cox
        </a>
      </p>
      <p>
        <FaPaintBrush color="#cf168f" /> Designed by <a href="https://thedesignerdev.com/">The Designer Dev</a>
      </p>
      <a href="https://github.com/The-Adult-In-The-Room/poe2-tools" target="_blank" rel="noreferrer">
        View source code
      </a>
      <a href="https://ko-fi.com/me_am" target="_blank" rel="noreferrer">
        Buy me a coffee
        <img src="https://storage.ko-fi.com/cdn/brandasset/logo_white_stroke.png?" alt="Buy Me a Coffee" />
      </a>
    </footer>
  )
}

export default Footer
