class StorageManager {
    constructor(storageKey = 'taskManagementApp') {
        this.storageKey = storageKey;
        this.isAvailable = this._checkStorageAvailability();
    }

    /**
     * Save data to localStorage
     */
    save(key, data) {
        if (!this.isAvailable) return false;

        try {
            const fullKey = `${this.storageKey}_${key}`;
            localStorage.setItem(fullKey, JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Load data from localStorage
     */
    load(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;

        try {
            const fullKey = `${this.storageKey}_${key}`;
            const jsonData = localStorage.getItem(fullKey);
            return jsonData === null ? defaultValue : JSON.parse(jsonData);
        } catch {
            return defaultValue;
        }
    }

    /**
     * Remove data from localStorage
     */
    remove(key) {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(`${this.storageKey}_${key}`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Clear all app data from localStorage
     */
    clear() {
        if (!this.isAvailable) return false;

        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storageKey)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        if (!this.isAvailable) return { available: false };

        let totalSize = 0;
        let appSize = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const itemSize = key.length + (value ? value.length : 0);

            totalSize += itemSize;
            if (key.startsWith(this.storageKey)) {
                appSize += itemSize;
            }
        }

        return {
            available: true,
            totalSize,
            appSize,
            itemCount: localStorage.length
        };
    }

    _checkStorageAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    window.StorageManager = StorageManager;
}
