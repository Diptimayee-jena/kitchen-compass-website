import { RotateCcw } from "lucide-react";
import { POPULAR_INGREDIENTS } from "../data/ingredients";

function PopularIngredients({ selected, onToggle, onClearAll }) {
  return (
    <section className="container filter-section" aria-labelledby="popular-title">
      <div className="filter-section__head">
        <h2 id="popular-title" className="filter-section__title">
          What do you have?
        </h2>

        {selected.length > 0 && (
          <button type="button" className="btn btn-ghost clear-btn" onClick={onClearAll}>
            <RotateCcw size={16} />
            Clear all
          </button>
        )}
      </div>

      <ul className="option-list">
        {POPULAR_INGREDIENTS.map(({ name, emoji }) => {
          const isSelected = selected.includes(name);
          return (
            <li key={name}>
              <button
                type="button"
                className={`option-chip ${isSelected ? "is-selected" : ""}`}
                aria-pressed={isSelected}
                onClick={() => onToggle(name)}
              >
                <span aria-hidden="true">{emoji}</span>
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default PopularIngredients;