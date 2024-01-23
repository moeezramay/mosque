import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

function scatterCoordinates(latitude, longitude) {
    // Earth's radius in kilometers
    const earthRadius = 6371;

    // Generate a random distance between 1 and 0.1 kilometers
    const randomDistance = Math.random() * (1 - 0.1) + 1;
    const randomAngle = Math.random() * (2 * Math.PI);
    const newLatitude =
        latitude +
        (randomDistance / earthRadius) *
            (180 / Math.PI) *
            Math.cos(randomAngle);
    const newLongitude =
        longitude +
        (randomDistance / earthRadius) *
            (180 / Math.PI) *
            Math.sin(randomAngle);
    return { latitude: newLatitude, longitude: newLongitude };
}

function Map({ positions, center, display, zoom, people }) {
    const [activeMarker, setActiveMarker] = useState(null);
    const [activeName, setActiveName] = useState(null);
    const [activePeople, setActivePeople] = useState([]);
    const [mainPositions, setMainPositions] = useState([]);

    useEffect(() => {
        let temp = [];
        setMainPositions([...positions, ...activePeople]);
    }, [positions, activePeople]);

    const handleMarkerClick = (marker) => {
        /*if(marker.type == "male" || marker.type == "female") {
          // This Function Executes When the User Clicks on a Person
        }*/
        try {
            setActiveMarker(marker);
            setActiveName(marker.name);
            if (marker.type == "mosque" || marker.type == "mosque2") {
                let unmappedData = people.filter((person) => {
                    let temp = JSON.parse(person.locations);
                    for (let i in temp) {
                        if (temp[i][2] === marker.name) {
                            return true;
                        }
                    }
                });
                setActivePeople(
                    unmappedData.map((person) => {
                        let temp = JSON.parse(person.locations);
                        let scattered = scatterCoordinates(
                            marker.location.lat,
                            marker.location.lng
                        );
                        for (let i in temp) {
                            return {
                                name: person.username,
                                type: person.gender,
                                lat: scattered.latitude,
                                lng: scattered.longitude,
                            };
                        }
                    })
                );
            }
        } catch (error) {
            console.log("Error on marker: ", error);
        }
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    const handleOnLoad = (mapInput) => {
        console.log("Handle on load started");
        const bounds = new window.google.maps.LatLngBounds();
        if (positions) {
            positions.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
            mapInput.fitBounds(bounds);
        }
    };

    const getIconUrl = (type) => {
        switch (type) {
            case "mosque":
                return "https://cdn-icons-png.flaticon.com/512/2319/2319870.png";
            case "female":
                return "https://cdn-icons-png.flaticon.com/512/7029/7029970.png";
            case "male":
                return "https://cdn-icons-png.flaticon.com/512/7029/7029967.png";
            case "mosque2":
                return "https://cdn-icons-png.flaticon.com/128/4050/4050101.png";
            default:
                return "https://cdn-icons-png.flaticon.com/512/819/819814.png";
        }
    };

    return (
        <GoogleMap
            onLoad={handleOnLoad}
            onClick={() => setActiveMarker(null)}
            mapContainerStyle={{
                width: "100%",
                height: "100%",
                visibility: display ? "visible" : "hidden",
            }}
            zoom={zoom}
            center={center}
        >
            {mainPositions &&
                mainPositions.map((position) => (
                    <MarkerF
                        icon={{
                            url: getIconUrl(position.type),
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                        }}
                        key={`${
                            position.location?.lat || position.lat || "unknown"
                        }-${
                            position.location?.lng || position.lng || "unknown"
                        }`}
                        position={
                            position.location
                                ? {
                                      lat: position.location.lat,
                                      lng: position.location.lng,
                                  }
                                : { lat: position.lat, lng: position.lng }
                        }
                        onClick={() => handleMarkerClick(position)}
                        name={position.name}
                    ></MarkerF>
                ))}
            {activeMarker && (
                <InfoWindowF
                    className="map-info-window"
                    position={
                        activeMarker.location
                            ? {
                                  lat: activeMarker.location.lat,
                                  lng: activeMarker.location.lng,
                              }
                            : { lat: activeMarker.lat, lng: activeMarker.lng }
                    }
                    onCloseClick={handleInfoWindowClose}
                >
                    <div>{activeName}</div>
                </InfoWindowF>
            )}
        </GoogleMap>
    );
}

export default Map;
