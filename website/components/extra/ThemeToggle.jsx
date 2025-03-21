import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

export default function ThemeToggle() {
    const { darkMode, setDarkMode } = useContext(AppContext);

    const handleClick = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <button 
            onClick={handleClick} 
            className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] 
            text-[var(--color-text-primary)] hover:bg-[var(--color-bg-accent)]
            transition-colors duration-200"
        >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
    );
}