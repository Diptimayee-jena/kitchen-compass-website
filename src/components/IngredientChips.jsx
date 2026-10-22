import { X } from "lucide-react";

function IngredientChips({ ingredients, onRemove }) {
  if (ingredients.length === 0) return null;

  return (
    <ul className="chips" aria-label="Selected ingredients">
      {ingredients.map((item) => (
        <li key={item} className="chip">
          <span>{item}</span>
          <button
            type="button"
            className="chip__remove"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item}`}
          >
            <X size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default IngredientChips;