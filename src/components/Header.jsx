import { useState } from "react";
import { Compass, Heart, Menu, X } from "lucide-react";
import "../styles/header.css";

function Header({ favoritesCount = 0, onOpenFavorites }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleFavorites = () => {
    closeMenu();
    if (onOpenFavorites) onOpenFavorites();
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="header__brand" onClick={closeMenu}>
          <img src="/logo.png" alt="" className="logo-img" />
          <span>Kitchen Compass</span>
        </a>

        <nav
          id="primary-nav"
          className={`header__nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Primary"
        >
          <a href="#explore" className="header__link header__explore" onClick={closeMenu}>
            <Compass size={18} />
            <span>Explore</span>
          </a>
          <button type="button" className="header__link header__fav" onClick={handleFavorites}>
            <Heart size={18} />
            <span>Favorites</span>
            {favoritesCount > 0 && <span className="header__badge">{favoritesCount}</span>}
          </button>
        </nav>

        <button
          type="button"
          className="header__menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

export default Header;