
export default class StorageService {
    /**
     * Get data from localstorage
     * @param key
     */
    getItem(key:string) {
        return localStorage.getItem(key);
    }

    /**
     * Set data to localstorage
     * @param key
     * @param value
     */
    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }


    /**
     * Clear the localstorage
     */
    clear() {
        localStorage.clear();
    }
}
