import { useState } from "react";
import { Clock, Gauge, Heart, Check } from "lucide-react";

function RecipeCard({ recipe, hasSearch, isFavorite, onToggleFavorite, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);

  const { name, image, emoji, time, difficulty, matchedCount, totalCount } = recipe;

  return (
    <article className="card">
      <div className="card__media">
        {imgFailed ? (
          <div className="card__placeholder" aria-hidden="true">
            {emoji}
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}

        <button
          type="button"
          className={`card__fav ${isFavorite ? "is-active" : ""}`}
          onClick={() => onToggleFavorite(recipe.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="card__body">
        <h3 className="card__title">{name}</h3>

        <ul className="card__meta">
          <li>
            <Clock size={16} />
            {time} min
          </li>
          <li>
            <Gauge size={16} />
            {difficulty}
          </li>
        </ul>

        {hasSearch ? (
          <p
            className={`card__match ${matchedCount === totalCount ? "is-full" : ""}`}
          >
            <Check size={14} />
            {matchedCount} of {totalCount} ingredients matched
          </p>
        ) : (
          <p className="card__match card__match--plain">{totalCount} main ingredients</p>
        )}

        <button type="button" className="card__btn" onClick={() => onOpen(recipe)}>
          View recipe
        </button>
      </div>
    </article>
  );
}

export default RecipeCard;