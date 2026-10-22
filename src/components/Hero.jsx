import { useState } from "react";
import { Search } from "lucide-react";
import IngredientChips from "./IngredientChips";
import "../styles/hero.css";

function Hero({ ingredients, onAdd, onRemove, onFind }) {
  const [value, setValue] = useState("");

  // Add whatever is typed, then clear the box
  const commit = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) commit();
      else onFind(); // empty box + Enter = search
    } else if (e.key === "Backspace" && value === "" && ingredients.length > 0) {
      onRemove(ingredients[ingredients.length - 1]);
    }
  };

  const handleFind = () => {
    commit();
    onFind();
  };

  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Cook with what you have</p>
        <h1 className="hero__title">What's in your kitchen today?</h1>
        <p className="hero__subtitle">
          Add the ingredients you already have and discover what you can cook.
        </p>

        <div className="search" role="search">
          <Search size={20} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try eggs, rice, tomato..."
            aria-label="Add an ingredient"
          />
          <button type="button" className="search__add" onClick={commit} disabled={!value.trim()}>
            Add
          </button>
        </div>

        <IngredientChips ingredients={ingredients} onRemove={onRemove} />

        <button type="button" className="btn btn-primary hero__cta" onClick={handleFind}>
          Find Recipes
        </button>
        <p className="hero__hint">Press Enter or comma to add. Leave it empty to browse everything.</p>
      </div>
    </section>
  );
}

export default Hero;
