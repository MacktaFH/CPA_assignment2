import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import {AddStation} from "../components/AddStation";

const AddStationPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Stationen hinzufügen</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <AddStation/>
            </IonContent>
        </IonPage>
    );
};

export default AddStationPage;



