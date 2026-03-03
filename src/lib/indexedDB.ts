/*
 * @DESC: INDEX DB IS USED HERE TO STORE POS CART ITEMS
 */

// ========== INDEXED DB ==========
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("posDatabase", 3);
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "cartId" }); // using cartId as unique key
      }
      if (!db.objectStoreNames.contains("tableStatus")) {
        db.createObjectStore("tableStatus", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("pendingOrders")) {
        db.createObjectStore("pendingOrders", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export interface TableStatus {
  id: string;
  status: string;
  details?: string;
}

// ========== SAVE TABLE STATUS TO DB ==========
export const saveTableStatusToDB = async (tableStatus: TableStatus) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tableStatus", "readwrite");
    const store = transaction.objectStore("tableStatus");
    const request = store.put(tableStatus);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

//  ========== GET TABLE STATUS FROM DB ==========
export const getTableStatusesFromDB = async (): Promise<TableStatus[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tableStatus", "readonly");
    const store = transaction.objectStore("tableStatus");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// ========== SAVE CART ITEMS TO DB ==========
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

// ========== GET CART ITEMS FROM DB ==========
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

// ========== CLEAR CART DB ==========
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

// ========== SAVE PENDING ORDERS TO DB ==========
export const savePendingOrdersToDB = async (orders: any[]) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pendingOrders", "readwrite");
    const store = transaction.objectStore("pendingOrders");

    store.clear().onsuccess = () => {
      if (orders.length > 0) {
        let count = 0;
        orders.forEach((order) => {
          const req = store.put(order);
          req.onsuccess = () => {
            count++;
            if (count === orders.length) resolve(true);
          };
          req.onerror = () => reject(req.error);
        });
      } else {
        resolve(true); // Resolves successfully even if empty
      }
    };

    transaction.onerror = () => reject(transaction.error);
  });
};
// ========== GET PENDING ORDERS FROM DB ==========
export const getPendingOrdersFromDB = async (): Promise<any[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pendingOrders", "readonly");
    const store = transaction.objectStore("pendingOrders");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
