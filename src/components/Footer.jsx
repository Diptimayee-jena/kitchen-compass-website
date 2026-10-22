import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa6";
import "../styles/footer.css";

// Replace each href with your real profile link
const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { name: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { name: "X (Twitter)", href: "https://x.com", Icon: FaXTwitter },
  { name: "YouTube", href: "https://youtube.com", Icon: FaYoutube },
  { name: "Pinterest", href: "https://pinterest.com", Icon: FaPinterestP },
];

function Footer({ onOpenFavorites }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__about">
          <div className="footer__brand">
            <img src="/logo.png" alt="" className="logo-img logo-img--sm" />
            <span>Kitchen Compass</span>
          </div>
          <p>Tell us what you have. We'll show you what you can cook.</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href="#explore">Explore recipes</a>
          <button type="button" onClick={onOpenFavorites}>
            Favorites
          </button>
        </nav>
      </div>

      <div className="container">
        <div className="footer__bottom">
          <ul className="footer__social" aria-label="Social media">
            {SOCIALS.map(({ name, href, Icon }) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>

          <p className="footer__copy">
            &copy; {year} What's in My Kitchen? All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;