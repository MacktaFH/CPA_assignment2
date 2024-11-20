import { atomWithQuery } from "jotai-tanstack-query";
import Papa from "papaparse";

// Station-Datentyp
export interface Station {
    HALTESTELLEN_ID: string;
    NAME: string;
    WGS84_LAT: number;
    WGS84_LON: number;
}


export const stationAtom = atomWithQuery<Station[]>((get) => ({
        queryKey: ['stations'],
        queryFn: async () => {
            const response = await fetch('https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv');
            const csvText = await response.text();

            const parsedData = Papa.parse(csvText, {header: true, skipEmptyLines: true});

            if (!parsedData.data || parsedData.data.length === 0) {
                throw new Error('Keine gültigen Daten in der CSV gefunden');
            }

            return parsedData.data
                .map((item: any) => ({
                    HALTESTELLEN_ID: item.HALTESTELLEN_ID,
                    NAME: item.NAME,
                    WGS84_LAT: parseFloat(item.WGS84_LAT),
                    WGS84_LON: parseFloat(item.WGS84_LON),
                }))
                .filter((station) => !isNaN(station.WGS84_LAT) && !isNaN(station.WGS84_LON)); // Filtere ungültige Koordinaten
        }
    }));
