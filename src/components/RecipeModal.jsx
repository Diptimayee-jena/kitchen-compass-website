import { useEffect, useRef, useState } from "react";
import { X, Clock, Gauge, Users, Heart, Check, Circle } from "lucide-react";
import { normalize, isStaple } from "../utils/matchRecipes";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function RecipeModal({ recipe, selectedIngredients, isFavorite, onToggleFavorite, onClose }) {
  const [imgFailed, setImgFailed] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Open: lock page scroll, focus the modal. Close: restore both.
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

  // Esc closes; Tab stays inside the dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll(FOCUSABLE);
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
  }, [onClose]);

  const { name, image, emoji, time, difficulty, servings, ingredients, steps, mealType } = recipe;

  // Work out what the user has (only meaningful if they searched)
  const hasSearch = selectedIngredients.length > 0;
  const have = new Set(selectedIngredients.map(normalize));

  const rows = ingredients.map((item) => {
    let status = "plain";
    if (hasSearch) {
      if (isStaple(item.name)) status = "staple";
      else status = have.has(normalize(item.name)) ? "have" : "need";
    }
    return { ...item, status };
  });

  const mainRows = rows.filter((row) => !isStaple(row.name));
  const haveCount = rows.filter((row) => row.status === "have").length;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close recipe"
        >
          <X size={20} />
        </button>

        <div className="modal__scroll">
          <div className="modal__media">
            {imgFailed ? (
              <div className="modal__placeholder" aria-hidden="true">
                {emoji}
              </div>
            ) : (
              <img src={image} alt={name} onError={() => setImgFailed(true)} />
            )}
          </div>

          <div className="modal__content">
            <p className="modal__tag">{mealType}</p>
            <h2 id="modal-title" className="modal__title">
              {name}
            </h2>

            <ul className="modal__meta">
              <li>
                <Clock size={18} />
                {time} min
              </li>
              <li>
                <Gauge size={18} />
                {difficulty}
              </li>
              <li>
                <Users size={18} />
                Serves {servings}
              </li>
            </ul>

            <section aria-labelledby="ing-title">
              <h3 id="ing-title" className="modal__heading">
                Ingredients
              </h3>

              {hasSearch && (
                <p className="modal__summary">
                  You have {haveCount} of {mainRows.length} main ingredients.
                </p>
              )}

              <ul className="ingredients">
                {rows.map((row) => (
                  <li key={row.name} className={`ingredient ingredient--${row.status}`}>
                    <span className="ingredient__icon" aria-hidden="true">
                      {row.status === "have" ? <Check size={14} /> : <Circle size={8} />}
                    </span>
                    <span className="ingredient__name">{row.name}</span>
                    <span className="ingredient__amount">{row.amount}</span>
                    {row.status === "have" && <span className="sr-only">(you have this)</span>}
                    {row.status === "need" && <span className="ingredient__flag">need</span>}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="steps-title">
              <h3 id="steps-title" className="modal__heading">
                Instructions
              </h3>
              <ol className="steps">
                {steps.map((step, index) => (
                  <li key={index} className="step">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className={`btn modal__save ${isFavorite ? "is-saved" : ""}`}
            onClick={() => onToggleFavorite(recipe.id)}
            aria-pressed={isFavorite}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved to favorites" : "Save to favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;