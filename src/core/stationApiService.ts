import Papa from 'papaparse';
import store from "./storage-setup";

export interface Station {
    HALTESTELLEN_ID: string;
    NAME: string;
    WGS84_LAT: number;
    WGS84_LON: number;
}

export const loadStationsFromApi = async (): Promise<Station[]> => {
    const response = await fetch('https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv');
    const csvText = await response.text();

    const parsedData = Papa.parse(csvText, {header: true, skipEmptyLines: true});

    if (!parsedData.data || parsedData.data.length === 0) {
        throw new Error('Keine gültigen Daten in der CSV gefunden');
    }

    const stations: Station[] = parsedData.data.map((item: any) => ({
        HALTESTELLEN_ID: item.HALTESTELLEN_ID,
        NAME: item.NAME,
        WGS84_LAT: parseFloat(item.WGS84_LAT),
        WGS84_LON: parseFloat(item.WGS84_LON),
    })).filter((station) => !isNaN(station.WGS84_LAT) && !isNaN(station.WGS84_LON)); // Filter ungültige Koordinaten


    await store.set('stations', stations);

    return stations;
};

