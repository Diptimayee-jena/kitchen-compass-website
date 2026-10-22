import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularIngredients from "./components/PopularIngredients";
import MealFilter from "./components/MealFilter";
import RecipeGrid from "./components/RecipeGrid";
import RecipeModal from "./components/RecipeModal";
import FavoritesDrawer from "./components/FavoritesDrawer"; // NEW
import Footer from "./components/Footer";
import { useFavorites } from "./context/FavoritesContext"; // NEW
import { RECIPES } from "./data/recipes";
import { getMatchingRecipes } from "./utils/matchRecipes";
import { formatIngredient } from "./utils/formatIngredient";
import "./styles/filters.css";
import "./styles/recipes.css";
import "./styles/modal.css";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [mealType, setMealType] = useState("all");
  const [activeRecipeId, setActiveRecipeId] = useState(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false); // NEW

  // CHANGED: favorites now come from Context (saved in localStorage)
  const { favorites, toggleFavorite } = useFavorites();

  const results = getMatchingRecipes(RECIPES, ingredients, mealType);
  const activeRecipe = RECIPES.find((recipe) => recipe.id === activeRecipeId);

  // NEW: only recipes that still exist in the data
  const savedRecipes = RECIPES.filter((recipe) => favorites.includes(recipe.id));

  // Accepts "eggs" or "eggs, rice, tomato"
  const addIngredients = (raw) => {
    const items = raw.split(",").map(formatIngredient).filter(Boolean);
    setIngredients((prev) => [...new Set([...prev, ...items])]);
  };

  const removeIngredient = (name) => {
    setIngredients((prev) => prev.filter((item) => item !== name));
  };

  const toggleIngredient = (name) => {
    setIngredients((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const clearIngredients = () => setIngredients([]);

  const scrollToResults = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  // NEW: close the panel, then scroll once the page can scroll again
  const browseFromFavorites = () => {
    setFavoritesOpen(false);
    setTimeout(scrollToResults, 50);
  };

  return (
    <>
      <Header
        favoritesCount={savedRecipes.length} // CHANGED
        onOpenFavorites={() => setFavoritesOpen(true)} // CHANGED
      />

      <main id="top">
        <Hero
          ingredients={ingredients}
          onAdd={addIngredients}
          onRemove={removeIngredient}
          onFind={scrollToResults}
        />

        <PopularIngredients
          selected={ingredients}
          onToggle={toggleIngredient}
          onClearAll={clearIngredients}
        />

        <MealFilter active={mealType} onChange={setMealType} />

        <RecipeGrid
          recipes={results}
          hasSearch={ingredients.length > 0}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpen={(recipe) => setActiveRecipeId(recipe.id)}
          onClearIngredients={clearIngredients}
        />
      </main>

      <Footer onOpenFavorites={() => setFavoritesOpen(true)} /> {/* CHANGED */}

      {/* NEW: favorites panel */}
      {favoritesOpen && (
        <FavoritesDrawer
          recipes={savedRecipes}
          paused={Boolean(activeRecipe)}
          onClose={() => setFavoritesOpen(false)}
          onOpenRecipe={(recipe) => setActiveRecipeId(recipe.id)}
          onRemove={toggleFavorite}
          onBrowse={browseFromFavorites}
        />
      )}

      {activeRecipe && (
        <RecipeModal
          key={activeRecipe.id}
          recipe={activeRecipe}
          selectedIngredients={ingredients}
          isFavorite={favorites.includes(activeRecipe.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setActiveRecipeId(null)}
        />
      )}
    </>
  );
}

export default App;