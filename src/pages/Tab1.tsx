import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import './Tab1.css';
import {StationList} from "../components/StationList";
import {StationMap} from "../components/StationMap";

const Tab1: React.FC = () => {
    return (
        <IonPage>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Stationen</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <StationList />
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
