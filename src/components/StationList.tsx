import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import SaveAddedStations from "./SaveAddedStations";
import {addedStationsAtom} from "../core/atoms/addedStationAtom";
import {useAtom} from "jotai";
import {loadStations} from "../core/storageStationService";
import {Station} from "../core/apiStationService";

export const StationList: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSorted, setIsSorted] = useState<boolean>(false);
    const [addedStations] = useAtom(addedStationsAtom); // Manuell hinzugefügte Stationen aus Atom
    const history = useHistory();

    const loadStationData = async () => {
        setLoading(true);
        try {
            const stationData = await loadStations();
            setStations(stationData);
        } catch (error) {
            console.error("Fehler beim Laden der Stationen:", error);
        } finally {
            setLoading(false);
        }
    };

   useEffect(() => {
        loadStationData();
    }, []);

    const sortStations = () => {
        setIsSorted(!isSorted);
    };

    const sortedStations = isSorted
        ? [...stations, ...addedStations].sort((a, b) => a.NAME.localeCompare(b.NAME, 'de', { sensitivity: 'base' }))
        : stations;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stationen</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonButton expand="full" onClick={() => history.push("/add-station")} style={{ marginTop: "20px" }}>
                Station hinzufügen
            </IonButton>
            <IonButton expand="full" onClick={sortStations} style={{ marginTop: "10px" }}>
                Alphabetisch sortieren
            </IonButton>
            <SaveAddedStations />

            <IonContent style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                    <IonLoading isOpen={loading} message="Lade Stationen..." />
                    <IonList>
                        {sortedStations.map((station: Station) => (
                            <IonItem key={station.HALTESTELLEN_ID}>
                                <IonLabel>{station.NAME}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </div>
            </IonContent>
        </IonPage>
    );
};