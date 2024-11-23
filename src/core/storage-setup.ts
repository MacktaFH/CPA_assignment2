import { Storage } from '@ionic/storage';

const store = new Storage();

// Initialisierungsfunktion
const initializeStorage = async () => {
    await store.create();
};

export { store, initializeStorage };


export default store;