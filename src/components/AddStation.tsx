import React, { useState } from "react";
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonAlert,
    IonToolbar,
    IonTitle, IonHeader
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAtom } from "jotai";
import {addedStationsAtom } from "../core/atoms/addedStationAtom";
import {Station} from "../core/stationApiService";

export const AddStation: React.FC = () => {
    const [stations, setStations] = useAtom(addedStationsAtom);

    const [newStation, setNewStation] = useState({
        id: "",
        name: "",
        lat: "",
        lon: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const history = useHistory();


    const validateInput = (): boolean => {
        if (!newStation.id || !newStation.name || !newStation.lat || !newStation.lon) {
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateInput()) {
            const updatedStations: Station[] = [
                ...stations,
                {
                    HALTESTELLEN_ID: newStation.id,
                    NAME: newStation.name,
                    WGS84_LAT: parseFloat(newStation.lat),
                    WGS84_LON: parseFloat(newStation.lon),
                },
            ];

            setStations(updatedStations);

            history.push("/tab1");
        } else {
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stationen hinzufügen</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="stacked">ID</IonLabel>
                    <IonInput
                        value={newStation.id}
                        onIonChange={(e) => setNewStation({ ...newStation, id: e.detail.value! })}
                        type="number"
                        placeholder="Gib eine 4-stellige ID ein"
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                        value={newStation.name}
                        onIonChange={(e) => setNewStation({ ...newStation, name: e.detail.value! })}
                        placeholder="Gib den Namen der Haltestelle ein"
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Breitengrad (Latitude)</IonLabel>
                    <IonInput
                        value={newStation.lat}
                        onIonChange={(e) => setNewStation({ ...newStation, lat: e.detail.value! })}
                        type="number"
                        placeholder="Gib den Breitengrad ein"
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Längengrad (Longitude)</IonLabel>
                    <IonInput
                        value={newStation.lon}
                        onIonChange={(e) => setNewStation({ ...newStation, lon: e.detail.value! })}
                        type="number"
                        placeholder="Gib den Längengrad ein"
                    />
                </IonItem>

                <IonButton expand="full" onClick={handleSubmit}>
                    Station hinzufügen
                </IonButton>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Fehler"
                    message="Bitte alle Felder ausfüllen!"
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};