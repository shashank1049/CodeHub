const cache = new Map();

const setCache = (key, value, ttl = 300000) => {
    const expiresAt = Date.now() + ttl;

    cache.set(key, {
        value,
        expiresAt,
    });
};

const getCache = (key) => {
    const cachedData = cache.get(key);

    if (!cachedData) {
        return null;
    }

    if (Date.now() > cachedData.expiresAt) {
        cache.delete(key);
        return null;
    }

    return cachedData.value;
};

const deleteCache = (key) => {
    cache.delete(key);
};

const clearCache = () => {
    cache.clear();
};

export {
    setCache,
    getCache,
    deleteCache,
    clearCache,
};