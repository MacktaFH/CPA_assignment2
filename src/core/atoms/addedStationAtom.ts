import { atom } from 'jotai';
import {Station} from "../apiStationService";

export const addedStationsAtom = atom<Station[]>([]);