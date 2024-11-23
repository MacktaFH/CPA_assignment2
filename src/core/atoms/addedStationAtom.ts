import { atom } from 'jotai';
import {Station} from "../stationApiService";

export const addedStationsAtom = atom<Station[]>([]);