window.SpellcheckProgress = {
    load(key) {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    },
    save(key, state) {
        try {
            sessionStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            // The game remains playable if storage is disabled or full.
        }
    },
    clear(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            // Ignore unavailable storage.
        }
    }
};
