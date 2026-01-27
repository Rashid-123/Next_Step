const store = new Map();
const WINDOW = 1000;

export const memoryLimit = (key, limit) => {
    const now = Date.now();
    const windowStart = now - WINDOW;

    if (!store.has(key)) {
        store.set(key, []);
    }

    const timestamps = store.get(key).filter(t => t > windowStart);

    timestamps.push(now);
    store.set(key , timestamps);

    return timestamps.length <= limit;
}