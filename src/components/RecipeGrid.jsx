import { useState } from "react";
import { SearchX } from "lucide-react";
import RecipeCard from "./RecipeCard";

const SORT_OPTIONS = [
  { id: "match", label: "Best match" },
  { id: "time-asc", label: "Shortest time" },
  { id: "time-desc", label: "Longest time" },
];

function sortRecipes(recipes, sortBy) {
  // "match" keeps the order already produced by getMatchingRecipes
  if (sortBy === "match") return recipes;

  const sorted = [...recipes];
  sorted.sort((a, b) => (sortBy === "time-asc" ? a.time - b.time : b.time - a.time));
  return sorted;
}

function RecipeGrid({
  recipes,
  hasSearch,
  favorites,
  onToggleFavorite,
  onOpen,
  onClearIngredients,
}) {
  const [sortBy, setSortBy] = useState("match");
  const visible = sortRecipes(recipes, sortBy);

  return (
    <section id="explore" className="container section" aria-labelledby="results-title">
      <div className="results__head">
        <div>
          <h2 id="results-title" className="results__title">
            Recipes you can make
          </h2>
          <p className="results__count" aria-live="polite">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} found
          </p>
        </div>

        {recipes.length > 0 && (
          <label className="sort">
            <span>Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="empty">
          <SearchX size={40} />
          <h3>No recipes match yet</h3>
          <p>Try removing an ingredient or switching the meal type.</p>
          {hasSearch && (
            <button type="button" className="btn btn-primary" onClick={onClearIngredients}>
              Clear ingredients
            </button>
          )}
        </div>
      ) : (
        <div className="grid">
          {visible.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              hasSearch={hasSearch}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecipeGrid;