// "  Green   Chilli " -> "green chilli"
export function formatIngredient(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}