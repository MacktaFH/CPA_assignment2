import { Storage } from '@ionic/storage';

const store = new Storage();
const initializeStorage = async () => {
    const store = new Storage();
    await store.create();
};

initializeStorage();


export default store;