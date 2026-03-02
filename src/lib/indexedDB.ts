export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("posDatabase", 1);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains("cart")) {
                db.createObjectStore("cart", { keyPath: "cartId" }); // using cartId as unique key
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveCartItemsToDB = async (items: any[]) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");

        // Clear existing to simply sync the state (or we can put individually, clearing ensures deletions are handled easily)
        store.clear().onsuccess = () => {
            items.forEach((item) => store.put(item));
        };

        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getCartItemsFromDB = async (): Promise<any[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("cart", "readonly");
        const store = transaction.objectStore("cart");
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearCartDB = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("cart", "readwrite");
        const store = transaction.objectStore("cart");
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};
