import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [stored, setFavorites] = useLocalStorage("kitchen-favorites", []);

  // Guard against bad data in storage
  const favorites = Array.isArray(stored) ? stored : [];

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(id) ? list.filter((favId) => favId !== id) : [...list, id];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return context;
}