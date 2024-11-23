import store from "./storage-setup";
import {loadStationsFromApi, Station} from "./apiStationService";

export const loadStations = async (): Promise<Station[]> => {
    try {
        const storedStations = await store.get('stations');

        if (!storedStations) {
            const dataFromApi = await loadStationsFromApi();

            await store.set('stations', dataFromApi);
            return dataFromApi;
        }


        const dataFromApi = await loadStationsFromApi();


        const storedStationsStringified = JSON.stringify(storedStations);
        const dataFromApiStringified = JSON.stringify(dataFromApi);


        if (storedStationsStringified !== dataFromApiStringified) {
            console.log("Daten im lokalen Speicher sind unterschiedlich. Speichere neue Daten...");
            await store.set('stations', dataFromApi);
            return dataFromApi;
        } else {
            console.log("Daten sind identisch. Keine Änderungen notwendig.");
            return storedStations;
        }

    } catch (error) {
        console.error("Fehler beim Laden der Stationen aus dem lokalen Speicher:", error);
        return [];
    }
};