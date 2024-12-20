import {IonContent, IonText} from "@ionic/react";
import React from "react";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import packageJson from '../../package.json';
import L from "leaflet";

const blueIcon = new L.DivIcon({
    className: "custom-red-marker",
    html: `
        <div style="
            background-color: blue;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        "></div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
});


const developerInfo = {
    name: 'Maria Musterfrau',
    adresse: 'Höchstädtpl. 6, 1200 Wien',
    latitude: 48.23939740124495,
    longitude: 16.37724899528676
}


export const DeveloperInfo = () => {
    return (
        <>
            <IonContent>
                <IonText>
                    <h2>About: </h2>
                    Entdecken Sie die Haltestellen der Wiener Linien mit unserer benutzerfreundlichen App! Wählen Sie
                    zwischen einer übersichtlichen Listenansicht oder einer interaktiven Karte, um alle Haltestellen in
                    Ihrer Nähe zu finden. Egal, ob Sie Ihre nächste Verbindung planen oder einfach die Umgebung erkunden
                    möchten – diese App ist der perfekte Begleiter für Ihre Fahrten in Wien.<br/><br/>

                    <h5>Version: {packageJson.version}</h5>

                    <h2>Developer Info: </h2>
                    {developerInfo.name} <br/>
                    {developerInfo.adresse}
                </IonText>
                <div style={{height: 600, width: '100%'}}>
                    <MapContainer
                        center={[developerInfo.latitude, developerInfo.longitude]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{height: '100%', width: '100%'}}
                        ref={(mapRef)=> {
                            setTimeout(() => {
                                mapRef?.invalidateSize();
                            }, 0);
                        }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[developerInfo.latitude, developerInfo.longitude]} icon={blueIcon}>
                            <Popup>
                                A pretty CSS3 popup. <br/> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </IonContent>

        </>
    );
};