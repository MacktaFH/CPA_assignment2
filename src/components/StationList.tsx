import {useAtom} from "jotai";
import {Station, stationAtom} from "../core/atoms/stationAtom";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList, IonLoading,
    IonPage,
    IonTitle, IonToast,
    IonToolbar
} from '@ionic/react';
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {combinedStationsAtom} from "../core/atoms/combinedStationAtom";
import store from "../core/storage";

export const StationList: React.FC = () => {
    const [stations] = useAtom(combinedStationsAtom);

    const[loading, setLoading] = useState<boolean>(false);
    const [isSorted, setIsSorted] = useState<boolean>(false);
    const history = useHistory();

      const sortStations = () => {
        setIsSorted(!isSorted); // Umkehren des Sortierzustands
    };

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const sortedStations = isSorted
        ? [...stations].sort((a, b) =>
            a.NAME.localeCompare(b.NAME, 'de', { sensitivity: 'base' })
        )
        : stations; // Wenn nicht sortiert, zeige die Stationen unverändert

    const saveStations = async () => {
        try {
            await store.set('stations', stations);
            setToastMessage('Haltestellen erfolgreich gespeichert!');
        } catch (error) {
            setToastMessage('Fehler beim Speichern der Haltestellen: ${error.message}');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stationen</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonButton expand="full" onClick={() => history.push("/add-station")} style={{marginTop: '20px'}}>
                Station hinzufügen
            </IonButton>
            <IonButton expand="full" onClick={sortStations} style={{ marginTop: '10px' }}>
                Alphabetisch sortieren
            </IonButton>
            <IonButton expand="full" onClick={saveStations} style={{ margin: '10px' }}>
                Haltestellen speichern
            </IonButton>
            <IonToast
                isOpen={!!toastMessage} // Show toast if there's a message
                onDidDismiss={() => setToastMessage(null)} // Reset message on dismiss
                message={toastMessage || ''}
                duration={2000} // Show for 2 seconds
                position="top" // Position the toast at the top
            />
            <IonContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div style={{flex: 1, overflowY: 'auto'}}>
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