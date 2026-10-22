// Things most kitchens already have. These never count as "missing"
// and never count towards a match.
const PANTRY_STAPLES = [
  "salt",
  "pepper",
  "oil",
  "water",
  "sugar",
  "turmeric",
  "cumin",
  "garam masala",
  "cardamom",
];

// Makes "Tomatoes", "tomato " and "TOMATO" all compare equal
export function normalize(text) {
  let t = text.trim().toLowerCase();

  if (t.endsWith("ies")) t = t.slice(0, -3) + "y"; // chillies -> chilly
  else if (t.endsWith("oes")) t = t.slice(0, -2); // tomatoes -> tomato
  else if (!t.endsWith("ss") && t.endsWith("s")) t = t.slice(0, -1); // eggs -> egg

  return t.replace(/chilly$/, "chilli");
}

const STAPLE_SET = new Set(PANTRY_STAPLES.map(normalize));
export const isStaple = (name) => STAPLE_SET.has(normalize(name));

/**
 * Filters recipes by meal type and ingredients, and adds match info.
 *
 * Returns recipes with extra fields:
 *   matchedCount - how many of the recipe's main ingredients you have
 *   totalCount   - how many main ingredients the recipe needs (staples excluded)
 *   missing      - names of the main ingredients you don't have
 *
 * No ingredients selected -> every recipe is returned.
 * Ingredients selected    -> only recipes with at least one match, best first.
 */
export function getMatchingRecipes(recipes, selected, mealType = "all") {
  const have = new Set(selected.map(normalize));

  return recipes
    .filter((recipe) => mealType === "all" || recipe.mealType === mealType)
    .map((recipe) => {
      const mainIngredients = recipe.ingredients.filter((item) => !isStaple(item.name));
      const matched = mainIngredients.filter((item) => have.has(normalize(item.name)));
      const missing = mainIngredients
        .filter((item) => !have.has(normalize(item.name)))
        .map((item) => item.name);

      return {
        ...recipe,
        matchedCount: matched.length,
        totalCount: mainIngredients.length,
        missing,
      };
    })
    .filter((recipe) => selected.length === 0 || recipe.matchedCount > 0)
    .sort(
      (a, b) =>
        b.matchedCount - a.matchedCount || // most matches first
        a.missing.length - b.missing.length || // then fewest missing
        a.time - b.time // then quickest
    );
}