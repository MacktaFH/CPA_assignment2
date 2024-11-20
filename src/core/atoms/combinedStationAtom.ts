import { atom } from 'jotai';
import { stationAtom } from './stationAtom'; // Stationen aus CSV
import { addedStationsAtom } from './addedStationAtom'; // Manuell hinzugefügte Stationen

export const combinedStationsAtom = atom((get) => {
    const csvStationsState = get(stationAtom); // Holen des gesamten stationAtom-Zustands
    const csvStations = csvStationsState.data || [];
    const addedStations = get(addedStationsAtom); // Manuell hinzugefügte Stationen
    return [...csvStations, ...addedStations]; // Kombiniere beide Listen
});
