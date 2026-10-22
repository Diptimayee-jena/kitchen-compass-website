import { useEffect, useRef, useState } from "react";
import { X, Trash2, Heart, Clock } from "lucide-react";
import "../styles/drawer.css";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function FavoriteItem({ recipe, onOpen, onRemove }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <li className="fav-item">
      <button type="button" className="fav-item__main" onClick={() => onOpen(recipe)}>
        <span className="fav-item__thumb">
          {imgFailed ? (
            <span aria-hidden="true">{recipe.emoji}</span>
          ) : (
            <img
              src={recipe.image}
              alt=""
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          )}
        </span>
        <span className="fav-item__text">
          <span className="fav-item__name">{recipe.name}</span>
          <span className="fav-item__meta">
            <Clock size={14} />
            {recipe.time} min &middot; {recipe.difficulty}
          </span>
        </span>
      </button>

      <button
        type="button"
        className="fav-item__remove"
        onClick={() => onRemove(recipe.id)}
        aria-label={`Remove ${recipe.name} from favorites`}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
}

// "paused" is true while a recipe modal is open on top, so Esc and Tab
// only affect the modal and not this panel underneath.
function FavoritesDrawer({ recipes, paused, onClose, onOpenRecipe, onRemove, onBrowse }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Open: lock page scroll and focus the panel. Close: restore both.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (paused) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll(FOCUSABLE);
        if (items.length === 0) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [paused, onClose]);

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <header className="drawer__head">
          <div>
            <h2 id="drawer-title" className="drawer__title">
              Your favorites
            </h2>
            <p className="drawer__count">
              {recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Close favorites"
          >
            <X size={22} />
          </button>
        </header>

        <div className="drawer__body">
          {recipes.length === 0 ? (
            <div className="drawer__empty">
              <Heart size={40} />
              <h3>No favorites yet</h3>
              <p>Tap the heart on any recipe to save it here.</p>
              <button type="button" className="btn btn-primary" onClick={onBrowse}>
                Browse recipes
              </button>
            </div>
          ) : (
            <ul className="fav-list">
              {recipes.map((recipe) => (
                <FavoriteItem
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={onOpenRecipe}
                  onRemove={onRemove}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default FavoritesDrawer;