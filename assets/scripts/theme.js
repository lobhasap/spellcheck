(() => {
    const themeKey = "spellcheck-theme";
    const root = document.documentElement;
    const themeButton = document.getElementById("theme-toggle");
    const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem(themeKey);
    } catch (error) {
        // Theme still works for this page when browser storage is unavailable.
    }
    if (savedTheme !== "light" && savedTheme !== "dark") savedTheme = null;

    function applyTheme(theme) {
        root.dataset.theme = theme;
        if (!themeButton) return;

        const isDark = theme === "dark";
        themeButton.textContent = isDark ? "☀" : "☾";
        themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
        themeButton.setAttribute("aria-pressed", String(isDark));
        themeButton.title = `Switch to ${isDark ? "light" : "dark"} mode`;
    }

    applyTheme(savedTheme || (colorPreference.matches ? "dark" : "light"));

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            savedTheme = nextTheme;
            applyTheme(nextTheme);
            try {
                localStorage.setItem(themeKey, nextTheme);
            } catch (error) {
                // Keep the chosen theme active for the current page.
            }
        });
    }

    colorPreference.addEventListener?.("change", (event) => {
        if (!savedTheme) applyTheme(event.matches ? "dark" : "light");
    });
})();
