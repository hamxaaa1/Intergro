import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

// DaisyUI themes
const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween",
  "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
  "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
  "business", "acid", "lemonade", "night", "coffee", "winter",
  "dim", "nord", "sunset"
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">⚙️ Choose Theme</h2>

      {/* Grid of theme previews */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {themes.map((t) => (
          <div
          key={t}
          onClick={() => setTheme(t)}
          className={`cursor-pointer rounded-lg border-2 transition 
            ${theme === t ? "border-primary" : "border-base-300"}`}
        >
          {/* Theme wrapper */}
          <div data-theme={t} className="rounded-lg">
            <div className="p-2 flex flex-col items-center space-y-1 bg-base-200 rounded-lg">
              {/* Theme name */}
              <span className="text-[10px] font-medium capitalize truncate">
                {t}
              </span>
        
              {/* Color swatches */}
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <div className="w-3 h-3 rounded bg-secondary"></div>
                <div className="w-3 h-3 rounded bg-accent"></div>
                <div className="w-3 h-3 rounded bg-neutral"></div>
              </div>
            </div>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default Settings;
