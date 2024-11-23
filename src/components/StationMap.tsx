import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {useAtom} from "jotai";
import L, {LatLngTuple} from "leaflet";
import {IonButton, IonContent} from "@ionic/react";
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {Geolocation, Position} from '@capacitor/geolocation';
import {addedStationsAtom} from "../core/atoms/addedStationAtom";
import {loadStations} from "../core/storageStationService";
import {Station} from "../core/apiStationService";
import {useHistory} from "react-router-dom";

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


export const StationMap = () => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [watchId, setWatchId] = useState<string | null>(null); // To store the watcher ID
    const [stations, setStations] = useState<Station[]>([]); // Stations im lokalen Zustand speichern
    const [loading, setLoading] = useState<boolean>(false); // Ladezustand verwalten
    const [addedStations] = useAtom(addedStationsAtom);
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


        const startWatching = async () => {
            try {
                const id = await Geolocation.watchPosition({}, (newPosition: Position | null, err?: any) => {
                    if (err) {
                        console.error("Error watching position:", err);
                        return;
                    }
                    if (newPosition) {
                        setPosition({
                            lat: newPosition.coords.latitude,
                            lng: newPosition.coords.longitude,
                        });
                    }
                });
                setWatchId(id);
            } catch (error) {
                console.error("Error starting position watcher:", error);
            }
        };

        startWatching();

        return () => {
            if (watchId) {
                Geolocation.clearWatch({id: watchId});
            }
        };
    }, []);


    const ZoomToLocationButton = ({position}: { position: { lat: number; lng: number } | null }) => {
        const map = useMap();

        const zoomToLocation = () => {
            if (position) {
                map.flyTo([position.lat, position.lng], 13);
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
                    zIndex: 1000,
                }}
            >
                Zoom zu meiner Position
            </IonButton>
        );
    };

    if (!position) {
        return <p>Position wird abgerufen...</p>;
    }

    const allStations = [...stations, ...addedStations];

    return (
        <IonContent>
            <div style={{height: '100vh', width: '100%'}}>
                <MapContainer
                    center={[48.2081, 16.3713]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{height: '100vh', width: '100%'}}
                    ref={(mapRef) => {
                        setTimeout(() => {
                            mapRef?.invalidateSize();
                        }, 0);
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {allStations.map((station: Station) => {
                        if (isNaN(station.WGS84_LAT) || isNaN(station.WGS84_LON)) {
                            return null; //
                        }
                        const position: LatLngTuple = [station.WGS84_LAT, station.WGS84_LON];

                        return (
                            <Marker key={station.HALTESTELLEN_ID} position={position} icon={blueIcon}>
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
