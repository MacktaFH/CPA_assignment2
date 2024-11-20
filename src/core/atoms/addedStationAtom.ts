import { atom } from 'jotai';
import {Station} from "./stationAtom";

export const addedStationsAtom = atom<Station[]>([]);  // Atom für manuell hinzugefügte Stationen