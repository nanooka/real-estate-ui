import { useEffect, useState } from "react";
import "./themeToggle.scss";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <label className="toggle-container">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <span className="toggle-slider">
        <div className="toggle-icon">
          {theme === "dark" ? (
            <IoMoonSharp color="white" size={20} />
          ) : (
            <IoSunnySharp color="yellow" size={20} />
          )}
        </div>
      </span>
    </label>
  );
};

export default ThemeToggle;
