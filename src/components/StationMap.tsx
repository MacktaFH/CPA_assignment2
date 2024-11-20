import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {useAtom} from "jotai";
//import {Station, stationAtom} from "../core/atoms/stationAtom";
import L, {LatLngTuple} from "leaflet";
import {IonButton, IonContent} from "@ionic/react";
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {Geolocation} from '@capacitor/geolocation';
import {combinedStationsAtom} from "../core/atoms/combinedStationAtom";
import {Station} from "../core/atoms/stationAtom";

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const redIcon = new L.DivIcon({
    className: "custom-red-marker",
    html: `<div style="
        background-color: red;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
});

export const StationMap = () => {

    const [stations] = useAtom(combinedStationsAtom); // Kombinierte Stationen aus CSV und manuell hinzugefügt

    /*const [stationsState,] = useAtom(stationAtom); // `stations` ist jetzt vom Typ `Station[]`
    const stations: Station[] = stationsState.data || [];*/
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);


    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const currentPosition = await Geolocation.getCurrentPosition();
                setPosition({
                    lat: currentPosition.coords.latitude,
                    lng: currentPosition.coords.longitude,
                });
            } catch (error) {
                console.error('Fehler beim Abrufen der Position:', error);
            }
        };

        fetchLocation();
    }, []);


    const ZoomToLocationButton = ({position}: { position: { lat: number; lng: number } | null }) => {
        const map = useMap();

        const zoomToLocation = () => {
            if (position) {
                map.flyTo([position.lat, position.lng], 13); // Adjust zoom level as needed
            } else {
                console.warn('Position is not available yet.');
            }
        };

        return (
            <IonButton
                onClick={zoomToLocation}
                disabled={!position}
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000, // Ensure the button appears above the map
                }}
            >
                Zoom zu meiner Position
            </IonButton>
        );
    };

    // Prevent rendering map until position is available
    if (!position) {
        return <p>Position wird abgerufen...</p>;
    }
    return (
        <IonContent>
            <div style={{height: '100vh', width: '100%'}}>
                <MapContainer
                    center={[48.2081, 16.3713]}
                    zoom={13}
                    scrollWheelZoom={false}// Initial zoom level
                    style={{height: '100vh', width: '100%'}}  // Full height and width
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stations.map((station: Station) => {
                        if (isNaN(station.WGS84_LAT) || isNaN(station.WGS84_LON)) {
                            return null; //
                        }
                        // Falls Latitude und Longitude vorhanden sind, setzen wir einen Marker
                        const position: LatLngTuple = [station.WGS84_LAT, station.WGS84_LON];

                        // Es wird keine Filterung von ungültigen Koordinaten mehr gemacht
                        return (
                            <Marker key={station.HALTESTELLEN_ID} position={position}>
                                <Popup>
                                    <strong>{station.NAME}</strong>
                                    <br/>
                                    Haltestellen ID: {station.HALTESTELLEN_ID}
                                    <br/>
                                    Latitude: {station.WGS84_LAT}
                                    <br/>
                                    Longitude: {station.WGS84_LON}
                                </Popup>
                            </Marker>

                        );
                    })}

                    {position && (
                        <Marker position={[position.lat, position.lng]} icon={redIcon}>
                            <Popup>You are here!</Popup>
                        </Marker>
                    )}
                    <ZoomToLocationButton position={position}/>


                </MapContainer>

            </div>
        </IonContent>
    );
};
