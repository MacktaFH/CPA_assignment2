import {IonContent, IonPage} from '@ionic/react';
import './Tab1.css';
import {StationList} from "../components/StationList";

const Tab1: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
               <StationList />
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
