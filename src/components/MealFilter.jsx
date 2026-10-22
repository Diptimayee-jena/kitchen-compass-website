const MEAL_TYPES = [
  { id: "all", label: "All recipes" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];

function MealFilter({ active, onChange }) {
  return (
    <section className="container filter-section" aria-label="Meal type">
      <ul className="option-list option-list--center">
        {MEAL_TYPES.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              className={`pill ${active === id ? "is-active" : ""}`}
              aria-pressed={active === id}
              onClick={() => onChange(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MealFilter;