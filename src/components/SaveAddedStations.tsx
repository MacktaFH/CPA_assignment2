import React, { useState } from 'react';
import {useAtom} from "jotai/index";
import {addedStationsAtom} from "../core/atoms/addedStationAtom";
import store from "../core/storage-setup";
import {IonButton, IonToast} from "@ionic/react";

const SaveAddedStations: React.FC = () => {
    const [addedStations] = useAtom(addedStationsAtom);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const saveStations = async () => {
        try {
            await store.set('addedStations', addedStations);
            setToastMessage('Haltestellen erfolgreich gespeichert!');
        } catch (error) {
            setToastMessage('Fehler beim Speichern der Haltestellen');
        }
    };

    return (
        <div>
    <IonButton expand="full" onClick={saveStations} style={{ margin: '10px' }}>
        Hinzugefügte Haltestellen speichern
    </IonButton>

    <IonToast

        isOpen={!!toastMessage}
        onDidDismiss={() => setToastMessage(null)}
        message={toastMessage || ''}
        duration={2000}
        position="top"
    />
        </div>
    );
};

export default SaveAddedStations;


